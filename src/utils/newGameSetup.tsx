import { COLOR } from './consts/Colors';
import { TOTAL_PLAYER_COUNT } from './consts/Consts';
import { Faction, Role, SuspicionSeverity, TownAlignment } from './enums/enums';
import {
  roleToBackgroundColor,
  roleToFaction,
  roleToTownAlignment,
} from './infoEnumsHelper';
import { PlayersInfo } from './types/PlayersInfo';

export function generateDefaultPlayersInfo(
  userNumber: number,
  userRole: Role,
  setPlayersInfo: (playersInfo: PlayersInfo) => void
) {
  let playersInfo = [] as PlayersInfo;

  for (
    let currentNumber = 1;
    currentNumber <= TOTAL_PLAYER_COUNT;
    currentNumber++
  ) {
    let number = currentNumber;
    let faction = Faction.Unknown;
    let townAlignment = TownAlignment.Unknown;
    let role = Role.Unknown;
    let note = '';
    let isConfirmedTown = false;
    let isConfirmationLocked = false;
    let isSuspicious = false;
    let displayColor = COLOR.BACKGROUND_UNKNOWN;
    let autoSuspicionSeverity = SuspicionSeverity.None;
    let autoSuspicionNotes: string[] = [];
    let isSuspicionLocked;
    roleToFaction(userRole) == Faction.Mafia
      ? (isSuspicionLocked = true)
      : (isSuspicionLocked = false);
    let isDead = false;
    let isUser = false;
    let isExecutionTarget = false;

    if (currentNumber == userNumber) {
      faction = roleToFaction(userRole);
      townAlignment = roleToTownAlignment(userRole);
      role = userRole;
      note = '';
      roleToFaction(userRole) == Faction.Town
        ? (isConfirmedTown = true)
        : (isConfirmedTown = false);
      isConfirmationLocked = true;
      isSuspicionLocked = true;

      if (faction != Faction.Town) {
        displayColor = roleToBackgroundColor(role);
      } else if (isConfirmedTown) {
        displayColor = COLOR.BACKGROUND_CONFIRMED_TOWN;
      }

      isUser = true;
    }

    playersInfo.push({
      number: number,
      faction: faction,
      townAlignment: townAlignment,
      role: role,
      note: note,
      displayColorBackground: displayColor,
      isConfirmedTown: isConfirmedTown,
      isConfirmationLocked: isConfirmationLocked,
      isSuspicious: isSuspicious,
      autoSuspicionSeverity: autoSuspicionSeverity,
      autoSuspicionNotes: autoSuspicionNotes,
      isSuspicionLocked: isSuspicionLocked,
      isDead: isDead,
      isUser: isUser,
      isExecutionTarget: isExecutionTarget,
    });
  }

  setPlayersInfo(playersInfo);
}

export function setupExecutionerTarget(
  playersInfo: PlayersInfo,
  targetNumber: number,
  setPlayersInfo: (playersInfo: PlayersInfo) => void
) {
  if (targetNumber < 1 || targetNumber > TOTAL_PLAYER_COUNT) return;

  let targetPlayerInfo = playersInfo.find(
    (player) => player.number == targetNumber
  )!;

  targetPlayerInfo.note = '(TARGET -> not Jailor/Mayor)';
  targetPlayerInfo.faction = Faction.Town;
  targetPlayerInfo.isConfirmedTown = true;
  targetPlayerInfo.isConfirmationLocked = true;
  targetPlayerInfo.displayColorBackground = COLOR.BACKGROUND_CONFIRMED_TOWN;
  targetPlayerInfo.isSuspicionLocked = true;
  targetPlayerInfo.isExecutionTarget = true;

  setPlayersInfo(playersInfo);
}

export function setupUserMafiaNumbers(
  playersInfo: PlayersInfo,
  mafiaNumbers: number[],
  setPlayersInfo: (playersInfo: PlayersInfo) => void
) {
  for (let mafiaNumber of mafiaNumbers) {
    if (mafiaNumber < 1 || mafiaNumber > TOTAL_PLAYER_COUNT) return;

    let targetPlayerInfo = playersInfo.find(
      (player) => player.number == mafiaNumber
    )!;

    targetPlayerInfo.faction = Faction.Mafia;
    targetPlayerInfo.townAlignment = TownAlignment.NotTown;
    targetPlayerInfo.role = Role.YourOtherMafia;
    targetPlayerInfo.displayColorBackground = COLOR.BACKGROUND_MAFIA;
    targetPlayerInfo.isConfirmationLocked = true;
    // .isSuspicionLocked already set to true in generateDefaultPlayersInfo()
  }

  setPlayersInfo(playersInfo);
}
