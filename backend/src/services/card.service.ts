import { CARD_CODE_MAX_ATTEMPTS, ERROR_CODES } from "../config/constants";
import { CardModel } from "../models/card.model";
import { ParticipantModel } from "../models/participant.model";
import { ApiError } from "../utils/ApiError";
import { generateCardCode } from "../utils/cardCode";
import { logActivity } from "./activity.service";
import { toVolunteerView } from "./checkin.service";
import { duplicateKeyFields } from "./participant.service";

const cardUnknown = () =>
  new ApiError(
    404,
    "This code is not one of the printed cards",
    ERROR_CODES.CARD_UNKNOWN,
  );

const requireCard = async (code: string) => {
  const card = await CardModel.findOne({ code }).select("code").lean();
  if (!card) throw cardUnknown();
  return card;
};

export const getCardHolder = async (code: string) => {
  const [card, participant] = await Promise.all([
    CardModel.findOne({ code }).select("code").lean(),
    ParticipantModel.findOne({ qrCode: code }).lean(),
  ]);

  if (!card) throw cardUnknown();

  if (!participant) {
    throw new ApiError(
      404,
      "This card has not been linked to a participant yet",
      ERROR_CODES.CARD_NOT_LINKED,
    );
  }

  return toVolunteerView(participant);
};

export const linkCard = async (
  actorId: string,
  code: string,
  rsvpCode: string,
) => {
  await requireCard(code);

  let previous;

  try {
    previous = await ParticipantModel.findOneAndUpdate(
      { rsvpCode, $or: [{ qrCode: null }, { qrCode: code }] },
      { $set: { qrCode: code } },
      { returnDocument: "before", projection: "+qrCode" },
    ).lean();
  } catch (error) {
    if (duplicateKeyFields(error)?.includes("qrCode")) {
      throw new ApiError(
        409,
        "This card is already linked to another participant",
        ERROR_CODES.CARD_IN_USE,
      );
    }
    throw error;
  }

  if (!previous) {
    const holder = await ParticipantModel.exists({ rsvpCode });

    if (holder) {
      throw new ApiError(
        409,
        "This participant already holds a different card",
        ERROR_CODES.PARTICIPANT_HAS_CARD,
      );
    }

    throw new ApiError(
      404,
      "No participant has that RSVP code",
      ERROR_CODES.PARTICIPANT_NOT_FOUND,
    );
  }

  const changed = previous.qrCode !== code;

  if (changed) {
    await logActivity({
      actorId,
      action: "CARD_LINKED",
      participantId: String(previous._id),
      teamId: String(previous.teamId),
      details: { card: code },
    });
  }

  return { ...(await toVolunteerView(previous)), changed };
};

export const createCards = async (count: number) => {
  const created: string[] = [];
  let retries = 0;

  while (created.length < count) {
    let inserted = false;

    for (
      let attempt = 0;
      attempt < CARD_CODE_MAX_ATTEMPTS && !inserted;
      attempt += 1
    ) {
      const code = generateCardCode();

      try {
        await CardModel.create({ code });
        created.push(code);
        inserted = true;
      } catch (error) {
        if (duplicateKeyFields(error)?.includes("code")) {
          retries += 1;
          continue;
        }
        throw error;
      }
    }

    if (!inserted) {
      throw new Error(
        `Could not generate an unused card code after ` +
          `${CARD_CODE_MAX_ATTEMPTS} attempts; ${created.length} were created`,
      );
    }
  }

  return { created, retries };
};

export const countCards = async () => CardModel.countDocuments();
