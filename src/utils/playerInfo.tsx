import { Faction, Role, TownAlignment } from './enums';
import { roleToFaction, roleToTownAlignment } from './roleHelper';

type PlayersInfo = PlayerInfo[];

type PlayerInfo = {
  number: number; // Player number (1-15)
  faction: Faction; // Player faction (unknown, town, mafia, neutral)
  townAlignment: TownAlignment; // Player town alignment (unknown, notTown, J, TI, TP, TK, TS)
  role: Role; // Player role (unknown, cleaned, notNeeded, jailor, mafioso..) - notNeeded is reserved for players that are not needed to be tracked (e.g. other members of user's mafia)
  note: string; // User note about the player
  isConfirmed: boolean; // If the player is confirmed or not
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
    let faction = Faction.unknown;
    let townAlignment = TownAlignment.unknown;
    let role = Role.unknown;
    let note = '';
    let isConfirmed = false;
    let isConfirmationLocked = false;
    let isSuspicious = false;
    let isPossiblySuspicious = false;
    let isSuspicionLocked;
    roleToFaction(userRole) == Faction.mafia
      ? (isSuspicionLocked = true)
      : (isSuspicionLocked = false);
    let isDead = false;

    if (currentNumber == userNumber) {
      faction = roleToFaction(userRole);
      townAlignment = roleToTownAlignment(userRole);
      role = userRole;
      note = '---';
      isConfirmed = true;
      isConfirmationLocked = true;
    }

    playersInfo.push({
      number: number,
      faction: faction,
      townAlignment: townAlignment,
      role: role,
      note: note,
      isConfirmed: isConfirmed,
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

  targetPlayerInfo.note = 'MY TARGET (cant be Jailor/Mayor)';
  targetPlayerInfo.faction = Faction.town;
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

    targetPlayerInfo.faction = Faction.mafia;
    targetPlayerInfo.townAlignment = TownAlignment.notTown;
    targetPlayerInfo.role = Role.notNeeded;
    targetPlayerInfo.note = 'MY MAFIA MEMBER';
    targetPlayerInfo.isConfirmationLocked = true;
    // .isSuspicionLocked already set to true in generateInitialPlayersInfo()
  }

  return playersInfo; // Does it need to return anything?
}
