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

// todo: export to separate file

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

  let deadPlayer = playersInfo.find(
    (player) => player.number == deadPlayerNumber
  )!;
  deadPlayer.isDead = true;

  adjustPlayerInfo(
    playersInfo,
    setPlayersInfo,
    deadPlayerNumber,
    deadPlayerRole,
    undefined,
    undefined
  );
}

export function adjustPlayerInfo(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  playerNumber: number,
  playerRole: Role | undefined,
  playerTownAlignment: TownAlignment | undefined,
  playerFaction: Faction | undefined
) {
  if (playerNumber < 1 || playerNumber > 15) return;

  let player = playersInfo.find((player) => player.number == playerNumber)!;

  // ROLE, TOWN ALIGNMENT, FACTION, COLOR (INITIAL)
  if (playerRole != undefined) {
    player.role = playerRole;
    player.townAlignment = roleToTownAlignment(playerRole);
    player.faction = roleToFaction(playerRole);
    player.displayColor = roleToColor(playerRole);
  } else if (playerTownAlignment != undefined) {
    player.role = Role.Unknown;
    player.townAlignment = playerTownAlignment;
    player.faction = townAlignmentToFaction(playerTownAlignment);
    player.displayColor = townAlignmentToColor(playerTownAlignment);
  } else if (playerFaction != undefined) {
    player.role = Role.Unknown;
    player.townAlignment = factionToTownAlignment(playerFaction);
    player.faction = playerFaction;
    player.displayColor = factionToColor(playerFaction);
  }

  // IS CONFIRMED TOWN
  player.isConfirmedTown = isPlayerConfirmedAfterInfoChange(
    player.isConfirmedTown,
    player.faction,
    player.isDead
  );

  // IS SUSPICIOUS
  player.isSuspicious = isPlayerSuspiciousAfterInfoChange(
    player.isSuspicious,
    player.faction,
    player.isDead
  );

  // COLOR (AFTER TAKING CONFIRMATION/SUSPICION INTO ACCOUNT)
  if (player.isConfirmedTown) {
    player.displayColor = COLORS.CONFIRMED_TOWN;
  } else if (player.isSuspicious) {
    player.displayColor = COLORS.SUSPICIOUS;
  }

  // DEAD PLAYER
  if (player.isDead) {
    player.isSuspicionLocked = true;
    // todo: this will be in another function, when I deal with automated possible suspicion
    player.isPossiblySuspicious = false;

    // If they player is dead, we can't confirm them as townie anymore.
    // We can only change his role afterwards, the confirmation is automatically set upon death or role change.
    player.isConfirmationLocked = true;
  }

  setPlayersInfo(playersInfo);
}

function isPlayerConfirmedAfterInfoChange(
  wasPreviouslyConfirmedTown: boolean,
  newFaction: Faction,
  isDead: boolean
) {
  // What are the options?
  // 1. Was confirmedTown, dies (town)         -> isConfirmedTown = true
  // 2. Was confirmedTown, dies (not town)     -> isConfirmedTown = false
  // 3. Was not confirmedTown, dies (town)     -> isConfirmedTown = true
  // 4. Was not confirmedTown, dies (not town) -> isConfirmedTown = false
  // 5. Was confirmedTown, we switch role to (town) -> isConfirmedTown = true
  // 6. Was confirmedTown, we switch role to (not town) -> isConfirmedTown = false
  // 7. Was not confirmedTown, we switch role to (town) -> isConfirmedTown = false (that's the special case)
  // 8. Was not confirmedTown, we switch role to (not town) -> isConfirmedTown = false
  // 9. If dead -  Was not confirmedTown, we switch role to (town) -> isConfirmedTown = true
  // 8. If dead -  Was not confirmedTown, we switch role to (not town) -> isConfirmedTown = false

  let isPlayerNowConfirmed = false;
  let isNowTown = newFaction == Faction.Town;

  // Only if the player isn't dead and wasn't previously confirmed,
  // we can't automatically confirm him as townie if his role is Town now.
  if (!wasPreviouslyConfirmedTown && isNowTown && !isDead) {
    isPlayerNowConfirmed = false;
  } else {
    isPlayerNowConfirmed = isNowTown;
  }

  return isPlayerNowConfirmed;
}

function isPlayerSuspiciousAfterInfoChange(
  wasPreviouslySuspicious: boolean,
  newFaction: Faction,
  isDead: boolean
) {
  let isNowTown = newFaction == Faction.Town;
  // What are the options?
  // 1. If the player is dead, they are no longer suspicious because we know if they are evil or not.
  // If we don't know (because his role was cleaned/forged - we should's set his role to cleaned/forged, not mark suspicion).
  if (isDead) {
    return false;
  }
  // 2. Was suspicious, we switch role to (town) -> suspicious = true
  // 3. Was suspicious, we switch role to (not town) -> suspicious = false (because we KNOW he is not town)
  // 4. Was not suspicious, we switch role to (town) -> suspicious = false
  // 5. Was not suspicious, we switch role to (not town) -> suspicious = false (because we KNOW he is not town)
  else if (wasPreviouslySuspicious && isNowTown) {
    return true;
  } else {
    return false;
  }
}

export function checkPlayerPossiblySuspicious() {}
