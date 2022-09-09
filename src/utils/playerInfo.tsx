import { COLORS } from './colors';
import { Faction, Role, TownAlignment } from './enums';
import {
  factionToColor,
  factionToTownAlignment,
  roleToColor,
  roleToFaction,
  roleToTownAlignment,
  townAlignmentToColor,
  townAlignmentToFaction,
} from './infoHelper';

export type PlayersInfo = PlayerInfo[];

export type PlayerInfo = {
  number: number; // Player number (1-15)
  faction: Faction; // Player faction (unknown, town, mafia, neutral)
  townAlignment: TownAlignment; // Player town alignment (unknown, notTown, J, TI, TP, TK, TS)
  role: Role; // Player role (unknown, cleaned, notNeeded, jailor, mafioso..) - notNeeded is reserved for players that are not needed to be tracked (e.g. other members of user's mafia)
  displayColor: string; // Player display color (lightgreen, lightred, green, red, y)
  note: string; // User note about the player
  isConfirmedTown: boolean; // If the player is confirmed townie or not
  isConfirmationLocked: boolean; // If this player is either user or user mafia, confirmation checkbox is locked because unnecessary
  isSuspicious: boolean; // If the player is suspicious of being evil or not
  isPossiblySuspicious: boolean; // Special field for automated RT suspicion, or multiple unique roles claim
  isSuspicionLocked: boolean; // If user is mafia, there is no need to track suspicious players, so all players' suspicion checkboxes are locked
  isDead: boolean; // If the player is dead or not
};

export function generateInitialPlayersInfo(userNumber: number, userRole: Role) {
  let playersInfo = [] as PlayersInfo;

  for (let currentNumber = 1; currentNumber <= 15; currentNumber++) {
    let number = currentNumber;
    let faction = Faction.Unknown;
    let townAlignment = TownAlignment.Unknown;
    let role = Role.Unknown;
    let note = '';
    let isConfirmedTown = false;
    let isConfirmationLocked = false;
    let isSuspicious = false;
    let displayColor = COLORS.UNKNOWN;
    let isPossiblySuspicious = false;
    let isSuspicionLocked;
    roleToFaction(userRole) == Faction.Mafia
      ? (isSuspicionLocked = true)
      : (isSuspicionLocked = false);
    let isDead = false;

    if (currentNumber == userNumber) {
      faction = roleToFaction(userRole);
      townAlignment = roleToTownAlignment(userRole);
      role = userRole;
      note = '(ME)';
      roleToFaction(userRole) == Faction.Town
        ? (isConfirmedTown = true)
        : (isConfirmedTown = false);
      isConfirmationLocked = true;

      if (faction != Faction.Town) {
        displayColor = roleToColor(role);
      } else if (isConfirmedTown) {
        displayColor = COLORS.CONFIRMED_TOWN;
      }
    }

    playersInfo.push({
      number: number,
      faction: faction,
      townAlignment: townAlignment,
      role: role,
      note: note,
      displayColor: displayColor,
      isConfirmedTown: isConfirmedTown,
      isConfirmationLocked: isConfirmationLocked,
      isSuspicious: isSuspicious,
      isPossiblySuspicious: isPossiblySuspicious,
      isSuspicionLocked: isSuspicionLocked,
      isDead: isDead,
    });
  }

  return playersInfo;
}

export function setExecutionerTarget(
  playersInfo: PlayersInfo,
  targetNumber: number
) {
  if (targetNumber < 1 || targetNumber > 15) return;

  let targetPlayerInfo = playersInfo.find(
    (player) => player.number == targetNumber
  )!;

  targetPlayerInfo.note = '(TARGET -> not Jailor/Mayor)';
  targetPlayerInfo.faction = Faction.Town;
  targetPlayerInfo.isConfirmedTown = true;
  targetPlayerInfo.displayColor = COLORS.CONFIRMED_TOWN;
  targetPlayerInfo.isSuspicionLocked = true;

  return playersInfo; // Does it need to return anything?
}

export function setUserMafiaNumbers(
  playersInfo: PlayersInfo,
  mafiaNumbers: number[]
) {
  for (let mafiaNumber of mafiaNumbers) {
    if (mafiaNumber < 1 || mafiaNumber > 15) return;

    let targetPlayerInfo = playersInfo.find(
      (player) => player.number == mafiaNumber
    )!;

    targetPlayerInfo.faction = Faction.Mafia;
    targetPlayerInfo.townAlignment = TownAlignment.NotTown;
    targetPlayerInfo.role = Role.YourOtherMafia;
    targetPlayerInfo.displayColor = COLORS.MAFIA;
    targetPlayerInfo.isConfirmationLocked = true;
    // .isSuspicionLocked already set to true in generateInitialPlayersInfo()
  }

  return playersInfo; // Does it need to return anything?
}

export function markPlayerAsDead(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  deadPlayerNumber: number,
  deadPlayerRole: Role
) {
  if (deadPlayerNumber < 1 || deadPlayerNumber > 15) return;

  let targetPlayerInfo = playersInfo.find(
    (player) => player.number == deadPlayerNumber
  )!;
  targetPlayerInfo.isDead = true;

  // todo: lock suspicious and confirmed town checkboxes on some targets

  let confirmed = false;
  roleToFaction(deadPlayerRole) == Faction.Town
    ? (confirmed = true)
    : (confirmed = false);

  markPlayerClaim(
    playersInfo,
    setPlayersInfo,
    deadPlayerNumber,
    deadPlayerRole,
    undefined,
    undefined,
    confirmed
  );

  // setPlayersInfo(playersInfo);
  // Does it need to return anything?
}

export function markPlayerClaim(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  playerNumber: number,
  playerRole: Role | undefined,
  playerTownAlignment: TownAlignment | undefined,
  playerFaction: Faction | undefined,
  isConfirmedTown: boolean
) {
  if (playerNumber < 1 || playerNumber > 15) return;
  // todo: make sure is confirmed town is correct...

  let targetPlayerInfo = playersInfo.find(
    (player) => player.number == playerNumber
  )!;

  targetPlayerInfo.isConfirmedTown = isConfirmedTown;

  if (playerRole != undefined) {
    targetPlayerInfo.role = playerRole;
    targetPlayerInfo.townAlignment = roleToTownAlignment(playerRole);
    targetPlayerInfo.faction = roleToFaction(playerRole);
    targetPlayerInfo.displayColor = roleToColor(playerRole);
  } else if (playerTownAlignment != undefined) {
    targetPlayerInfo.role = Role.Unknown;
    targetPlayerInfo.townAlignment = playerTownAlignment;
    targetPlayerInfo.faction = townAlignmentToFaction(playerTownAlignment);
    targetPlayerInfo.displayColor = townAlignmentToColor(playerTownAlignment);
  } else if (playerFaction != undefined) {
    targetPlayerInfo.role = Role.Unknown;
    targetPlayerInfo.townAlignment = factionToTownAlignment(playerFaction);
    targetPlayerInfo.faction = playerFaction;
    targetPlayerInfo.displayColor = factionToColor(playerFaction);
  }

  // Confirmed town should override all other colors.
  // Suspicious color should stay that way if still not confirmed or MAFIA/NEUTRAL.
  if (isConfirmedTown) {
    targetPlayerInfo.displayColor = COLORS.CONFIRMED_TOWN;
    targetPlayerInfo.isSuspicious = false;
  } else if (
    targetPlayerInfo.isSuspicious &&
    targetPlayerInfo.faction != Faction.Mafia &&
    targetPlayerInfo.faction != Faction.NeutralEvil
  ) {
    targetPlayerInfo.displayColor = COLORS.SUSPICIOUS;
  }

  setPlayersInfo(playersInfo);
  // Does it need to return anything?
}

export function checkPlayerPossiblySuspicious() {}
