import {
  Faction,
  Role,
  SuspicionSeverity,
  TownAlignment,
} from '../enums/enums';

export type PlayersInfo = PlayerInfo[];

export type PlayerInfo = {
  number: number; // Player number [1 - 15(TOTAL_PLAYER_COUNT)]
  faction: Faction; // Player faction (unknown, town, mafia, neutral)
  townAlignment: TownAlignment; // Player town alignment (unknown, notTown, J, TI, TP, TK, TS)
  role: Role; // Player role (unknown, cleaned, notNeeded, jailor, mafioso..) - notNeeded is reserved for players that are not needed to be tracked (e.g. other members of user's mafia)
  displayColorBackground: string; // Player display color (lightgreen, lightred, green, red, y)
  note: string; // User note about the player
  isConfirmedTown: boolean; // If the player is confirmed townie or not
  isConfirmationLocked: boolean; // If this player is either user or user mafia, confirmation checkbox is locked because unnecessary
  isSuspicious: boolean; // If the player is suspicious of being evil or not
  autoSuspicionSeverity: SuspicionSeverity; // Special field for automated RT suspicion, or multiple unique roles claim, etc.
  autoSuspicionNotes: string[]; // Automates suspicion notes
  isSuspicionLocked: boolean; // If user is mafia, there is no need to track suspicious players, so all players' suspicion checkboxes are locked
  isDead: boolean; // If the player is dead or not
  isUser: boolean; // If the player is user or not
  isExecutionTarget: boolean; // If the player is execution target or not
};
