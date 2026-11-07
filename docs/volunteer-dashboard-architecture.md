# Volunteer dashboard: check-in and allocation architecture

Status: proposed design, updated after organizer clarification; not implemented. Repository review based on VihaanX `fa6b912`, vihaan-26 `236680a`, and supplied room diagrams. Code was inspected, not the live database or production records.

## 1. Confirmed requirements

- Every shortlisted offline participant receives an individual, unique check-in/RSVP code by email. VihaanX functions should generate and send these emails.
- Cards are printed with random QR identifiers before the event. A volunteer scans the card. If it is already linked, the dashboard shows its participant and team. If it is unlinked, the volunteer enters that participant's RSVP code and submits it, linking the scanned identifier to the participant.
- A linked QR indicates that the participant has arrived. The original roster, not actual turnout, determines the team's capacity requirement.
- A table label such as `104-T1` is **one slot for up to two people**. Teams of 1–2 receive one slot; teams of 3–4 receive two slots in the same physical row, such as `104-T1` and `104-T2`. Any two available slots in the same physical row may be used; configure each slot’s row in the room inventory.
- Assign on the spot, not through a prepublished allocation. The room and tables belong to the team and are visible to all its members.
- AB4-104 is a small room and AB4-201 is a larger room. No more than 15 teams in a small room is a preference, not a hard restriction. Hardware occupancy and room configuration will be uploaded later.
- Keeping teams with shared colleges close is preferred, including for mixed-college teams, but is not mandatory.
- Volunteers can handle card linking, replacement and meals; only super admins edit participant details. Participants cannot alter check-in, cards, rooms or table allocations. Room-move permissions remain to be decided.

**Confirmed:** the first successful card link triggers allocation for the whole team. Volunteers and super admins can replace lost cards, with an audit reason. Participant login retains the existing email + RSVP code + linked QR flow.

## 2. Existing implementation and comparison

Both systems use Node, Express, TypeScript, MongoDB and Mongoose. VihaanX also uses Zod and an Express route → controller → service → model structure; its frontend is Next.js/React. vihaan-26 uses a React/Vite volunteer dashboard with camera scanning and manual entry.

| Area | vihaan-26 | VihaanX today |
| --- | --- | --- |
| People and teams | Student stores external team ID and duplicates team name and room; Team also has room. | Participant references Team by ObjectId; Team owns room, so team details can be shared. |
| RSVP code | Eight characters from an email prefix and `Math.random`; collision tracking is in-process. | Eight random characters generated with `crypto.randomInt`, unique index and collision retry; retained on re-import. No shortlist state is modeled. |
| Card | Links supplied QR to user; no printed-card inventory check in that flow; linking can overwrite an existing QR. | Printed card inventory exists; link checks inventory, prevents replacement and a partial unique index prevents assigning one QR to two participants. Eight-digit identifiers are stored as plaintext, not hashes. |
| Attendance | Links card and marks present separately. | Links card and marks present separately; `checkedIn` is independent of `qrCode`. This must change or be kept strictly synchronized to match the requested linked-card attendance rule. |
| Room | Assigned at check-in based on member count; duplicated room fields and non-atomic operations can drift. Hardware room selection lacks a capacity predicate. | Assigns on check-in, using remaining **people spaces**, conditional writes and compensating release. Partial failures can still leak capacity. No named slots, same-row pairs, college grouping or team-count preference. |
| Operations | Volunteer UI includes meals, bedding, check-in and manual QR entry. | Backend has roles, scan/link, check-in, meals, room moves and activity log; no volunteer dashboard UI found in the current Next.js application. |

Sources: VihaanX `backend/src/models`, `backend/src/services/{card,checkin,room,participant,team}.service.ts`, routes and scripts; vihaan-26 `backend/src/controllers/user.controller.ts`, `backend/src/services/upload.service.ts`, models and `frontend/src/pages/VolunteerDashboard.jsx`. The existing participant login uses RSVP code and QR code; changes to either must be coordinated with authentication. Current code exports codes; no email-sending workflow was found in the inspected application.

## 3. Domain and data model

Continue using `Participant.teamId`; do not duplicate the team assignment on individual participant records.

- **Participant:** identity, email, college, role, team and eligibility. Keep a unique RSVP code per person and migrate credential storage carefully. Attendance should be derived from an **active linked card**, or represented with a separate immutable first-arrival timestamp plus active-card link; do not keep a freely editable `checkedIn` flag that can disagree with the card. Preserve arrival history across card replacement. An active linked card establishes check-in, not real-time physical presence or departure.
- **Team:** current team-level `assignment: {roomId, slotIds, rosterSize, assignedAt, assignedBy, version}`. Count the original eligible roster for assignment; do not resize for absent members. Require 1–4 members for automatic allocation and flag invalid rosters to an administrator. The first successful link reserves the whole team's allocation when a valid placement is available.
- **Room:** stable ID and label, enabled state, `sizeClass` (small/large), hardware eligibility, optional physical people limit, and a configurable **preferred** team count. A separate hard team maximum is optional only if organizers define one. Exact hardware rules and capacity data will be uploaded later.
- **Slot:** stable room reference, label, physical row, enabled/reserved state and assigned team. Unique `(roomId, label)`; any two enabled, available slots sharing the same configured row may be used together. For AB4-104, `104-T1` plus `104-T2` is an example valid pair, once both are confirmed in the same row of the room inventory. Disabled and mentor positions cannot be assigned.
- **Card:** pre-generated inventory with unique card identifier/digest, status (`AVAILABLE`, `ASSIGNED`, `REVOKED`), current participant, batch and timestamps. Enforce at most one active card per participant and one holder per card; retain revoked card history. VihaanX currently stores the link on `Participant.qrCode`; choose one source of truth and migrate login and reads together.
- **Email delivery:** per-participant invitation/outbox record with status, attempts, message ID and safe error information. Emails contain team name and only that person's code. Do not log codes, QR tokens or email bodies. Restrict access to any exported codes.
- **Activity:** actor, action, participant/team/card references, time, non-secret before/after values, reason and request ID. Include card link/replacement and assignment/move. Write critical audit events in the same transaction or through a transactional outbox.

College names need normalization/aliases to avoid treating spellings as different institutions. For a mixed-college team, represent its set of verified college IDs. A candidate room gains preference for sharing any of those colleges with teams already there; the team remains eligible for other rooms. Unknown colleges carry no grouping bonus.

## 4. End-to-end flow

### Before the event

1. Import or mark shortlisted eligible participants, validate team IDs, duplicates, one leader and 1–4 members, and preserve their original roster. Do not issue invitations to ineligible participants.
2. Generate unique human-readable random RSVP codes per person using a cryptographically secure generator and a unique database index. Send each person an individual email with their own code and team name. Track queued, sent and failed delivery; and retry failed delivery safely without sending another invitation after successful delivery. No resend feature is required. Since login also uses this code, coordinate any credential-storage change with login; if using a digest, retain delivery material encrypted only until successful delivery, then delete it. A lost-code recovery policy remains to be determined.
3. Pre-generate and register cards; print and scan-test each batch. Prefer high-entropy opaque random QR values (e.g. 128 random bits), plus a short non-secret serial for manual lookup. The existing eight-digit format requires an explicit migration/compatibility decision. A QR is an identifier, not proof that its holder is the correct person.
4. Import all room labels, slot rows, hardware suitability and any physical capacity limits when available. Validate the uploaded data and run a **read-only capacity simulation** if useful; do not preassign or publish teams. The simulation cannot guarantee that arrival-order allocation will always find a placement.

### At the desk

1. Volunteer signs in and scans the QR or enters the printed serial. The backend checks the registered inventory. Unknown/revoked → reject and escalate. Assigned → show the linked participant, team, arrival and allocation. Available → prompt for that participant's RSVP code.
2. The backend checks the code against an eligible participant. Show name and team so the volunteer can verify identity. On confirmation, recheck the card and participant and link them atomically. A successful active link marks arrival. A repeated link of the same participant/card is idempotent; different-card or different-holder conflicts go to an authorized exception flow.
3. If this is the first linked participant from a team with no room, atomically choose and claim its room and one or two slots based on the full original roster. The member need not be the leader. Other team members arriving later receive their own cards and see the same assignment.
4. If no valid room/pair exists, do not invent or double-assign a slot. Mark the participant as arrived if the link succeeded and show **allocation required** prominently; place the team in an admin exception queue. The allocation can be retried after a suitable slot is made available. If the system chooses to commit link and assignment together, it must still explicitly support the no-capacity arrival path without pretending allocation succeeded.
5. A repeated scan shows the current details; it must not allocate the team again. Meals or other operations remain separate actions. Room moves update the team and every claimed slot atomically, with the change immediately visible to all teammates.

Card replacement must revoke the old card and link the new one atomically while preserving arrival history and team assignment. Volunteers and super admins may replace cards, with a recorded reason; the identity-verification procedure is pending. An unlinked/revoked badge cannot be treated as an active badge; do not silently erase a historical arrival because a card was replaced. Existing separate check-in and undo endpoints must be redesigned or disabled so they cannot contradict the agreed arrival definition.

### Meals at the volunteer desk

The confirmed event plan has six distinct meal rounds: day 1 lunch, day 1 dinner, midnight snack 1, midnight snack 2, day 2 breakfast, and day 2 lunch. VihaanX currently defines only four IDs (day 1 lunch, day 1 dinner, one midnight snack, and day 2 breakfast), so its configuration must add the second snack and day 2 lunch; retain or migrate the existing snack ID deliberately. The existing service stores `mealsTaken` per participant, requires `checkedIn`, prevents serving the same meal twice through an atomic conditional update, and logs serve/undo actions. The exact snack timings and menu options can be configured when confirmed.

In the dashboard, the volunteer selects the meal round and scans a linked card. Show the participant and whether that meal is already served. A serve action records that meal **for that person**, not the team, and immediately shows success; a duplicate scan shows already served and cannot count twice. Validate the active card/arrival rule on the server when adapting the current `checkedIn` check. Failed network requests must be safe to retry, and a duplicate response must clearly show the actual recorded state. Retain meal history across card replacement. Only super admins can undo a mistakenly recorded meal; retain the audit log. A reason field is a proposed enhancement. Meal status is independent of table allocation, so an arrived participant awaiting a room can still receive a meal.

## 5. On-the-spot room and table allocation

### Inputs and hard constraints

Inputs are the current original team roster, each member's normalized college, team world and special requirements, plus live room/slot inventory and existing assignments. Before choosing a candidate, require:

- 1–2 members → exactly one free enabled slot; 3–4 → exactly two free enabled slots in the same configured physical row and room.
- Room is enabled and meets the team's hardware/accessibility requirements, once configured. Reserve the full original roster against any configured physical people limit.
- Slots are not reserved, disabled or assigned. Any explicitly defined safety/physical limits are hard constraints.
- A team has no other current assignment. If a member arrives after a teammate, return the existing team allocation.

The **15-team count in small rooms is a soft preference**. Do not reject an otherwise valid assignment merely because it would be team 16. Prefer suitable rooms below the recommendation when available; show a warning when a small room crosses it. Organizers can override an allocation through an authorized, audited move without violating hard constraints.

### Selection

For each arriving unassigned team:

1. Read compatible rooms and all free single slots or combinations of two free slots in the same configured row. Use the configured physical row, not numbering alone.
2. Rank candidates deterministically: first prefer a suitable room below 15 teams over a small room already at 15; then prefer rooms with teams sharing any normalized college; then prefer choices that preserve valid same-row pairs for future larger teams and leave usable capacity; finally use stable room/row/slot ordering. This priority is a preference, not a hard limit; college proximity comes after it.
3. Claim the chosen slots and update the team assignment and room counters in one transaction using conditional writes. If another volunteer claims a slot first, retry from fresh data. Repeated requests must return the same assignment.
4. If no candidate fits, return `UNASSIGNED` and raise an exception for an organizer. Total free slots alone do not guarantee a valid same-row pair. The greedy arrival-order algorithm cannot guarantee globally optimal college grouping or eliminate all avoidable fragmentation; a future admin move can resolve specific cases.

**Example:** assuming these labels are enabled and `104-T1`/`104-T2` are configured in the same row, a three-person team receives both. A two-person team receives only one. AB4-104 depicts T1–T28, AB4-201 depicts T1–T36; actual usable labels, row membership, capacity and hardware designations require the organizer's room upload. Team 16 may use AB4-104 if it is the best valid option, with a recommendation warning.

## 6. Security, concurrency and operational recovery

- Authenticate all staff operations on the server and validate input with Zod allowlists. Participants may read their team assignment but cannot link cards, change attendance or modify room/table data. Only super admins may edit participant details; room-move permissions are still pending. Current VihaanX allows volunteer room moves.
- Use CSPRNGs and database uniqueness, rate-limit code lookup/link per account and IP using shared storage across API instances, and never log raw codes, QR tokens or sensitive payloads. Use authenticated POST bodies rather than URLs for QR lookups. Current card-link activity logs the code and must be changed.
- A photographed QR can be copied. Staff should verify identity when linking or replacing a badge. QR plus a short code should not be assumed to be strong independent authentication. The current participant login must be migrated compatibly with any code or QR-storage changes.
- Use MongoDB transactions for the multi-document card/attendance and allocation/move changes, with guarded writes, unique indexes, idempotency keys and retry of transient conflicts. MongoDB transactions need a replica set or managed equivalent; the current local compose runs standalone. A reconciliation report should compare team assignments, slot occupancy and counters.
- Do not permit independent offline devices to assign cards or slots: global uniqueness cannot be enforced. If network/database service fails, keep a controlled paper queue and reconcile centrally when service returns. Test backups and restoration.

## 7. API, implementation and acceptance

Follow the existing `/api/v1` routes/controllers/services/models/Zod convention. Suggested changes:

- `POST /cards/lookup` with a token or serial → available, assigned, revoked or unknown; authenticated staff only. Avoid secrets in URLs.
- A preview endpoint for code + available card shows minimal identity information; a confirm endpoint rechecks and atomically links. Alternatively use one confirmation action if identity verification can be done safely. Return participant, team, arrival status, allocation status and room/slots. Build on the existing card service without retaining a conflicting second source of truth.
- Staff-only team allocation retry/move and inventory management; admin permissions for sensitive actions according to policy. Participant `/me` reads the team assignment and cannot change it.
- Existing staff meal serve and undo endpoints can be adapted to active-card arrival and the final undo policy.
- Code generation and email functions use an outbox/worker with idempotent sends and status tracking; keep API credentials server-side and coordinate code rotation with login.

Implementation order: (1) settle pending decisions and room upload format; (2) replica-set development environment, indexes and data migration; (3) shortlist, individual codes and delivery; (4) card/link/arrival flow; (5) on-arrival allocation with configured rows and atomic moves; (6) volunteer dashboard with camera/manual entry; (7) access-control, concurrency and recovery testing; (8) rehearse printed cards and production-shaped anonymized data.

Acceptance cases: simultaneous claims on one badge or slot; simultaneous first arrivals from one team; repeated scan/link and network retry; invalid roster; no valid pair despite free single slots; small room above 15 teams; hardware constraints after upload; mixed/unknown college; a team with no feasible placement; failed email delivery; card loss/replacement; unauthorized participant write; atomic move rollback and database failure mid-operation. Check that all team members see one assignment and no credentials appear in logs.

## 8. Open questions

1. May volunteers move teams or only super admins? What identity verification should staff use when replacing a card, and how should a lost RSVP code be handled without a resend feature?
2. Please provide the room inventory when ready: enabled labels, their physical rows, physical occupancy limits, room size and hardware suitability.
3. Which email provider/account and sender address should the backend use?
4. Are any dietary options needed in the dashboard?
