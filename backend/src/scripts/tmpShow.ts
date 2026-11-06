import { connectDatabase, disconnectDatabase } from "../config/database";
import { ParticipantModel } from "../models/participant.model";
import { TeamModel } from "../models/team.model";

await connectDatabase();
const team = await TeamModel.findOne({ unstopId: "UHAND001" }).lean();
const members = await ParticipantModel.find({ teamId: team?._id })
  .sort({ role: 1 })
  .lean();
for (const m of members) console.log(`    ${m.name.padEnd(14)} ${m.role}`);
await disconnectDatabase();
process.exit(0);
