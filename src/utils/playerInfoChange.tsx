import { checkAutoSuspicion } from './autoSuspicion';
import { COLOR } from './consts/Colors';
import { TOTAL_PLAYER_COUNT, TOTAL_TOWN_COUNT } from './consts/Consts';
import { Faction, Role, TownAlignment } from './enums/enums';
import {
  factionToBackgroundColor,
  factionToTownAlignment,
  roleToBackgroundColor,
  roleToFaction,
  roleToTownAlignment,
  townAlignmentToBackgroundColor,
  townAlignmentToFaction,
} from './infoEnumsHelper';
import { PlayersInfo } from './types/PlayersInfo';

export function markPlayerAsDead(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  deadPlayerNumber: number,
  deadPlayerRole: Role,
  setMajority: (value: { town: number; notTown: number }) => void
) {
  if (deadPlayerNumber < 1 || deadPlayerNumber > TOTAL_PLAYER_COUNT) return;

  let deadPlayer = playersInfo.find(
    (player) => player.number == deadPlayerNumber
  )!;
  deadPlayer.isDead = true;

  editPlayerInfo(
    playersInfo,
    setPlayersInfo,
    deadPlayerNumber,
    deadPlayerRole,
    undefined,
    undefined,
    setMajority
  );
}

export function editPlayerInfo(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  playerNumber: number,
  playerRole: Role | undefined,
  playerTownAlignment: TownAlignment | undefined,
  playerFaction: Faction | undefined,
  setMajority: (value: { town: number; notTown: number }) => void
) {
  if (playerNumber < 1 || playerNumber > TOTAL_PLAYER_COUNT) return;

  let player = playersInfo.find((player) => player.number == playerNumber)!;
  let user = playersInfo.find((player) => player.isUser == true)!;

  // ROLE, TOWN ALIGNMENT, FACTION, COLOR (INITIAL)
  if (playerRole != undefined) {
    player.role = playerRole;
    player.townAlignment = roleToTownAlignment(playerRole);
    player.faction = roleToFaction(playerRole);
    player.displayColorBackground = roleToBackgroundColor(playerRole);
  } else if (playerTownAlignment != undefined) {
    player.role = Role.Unknown;
    player.townAlignment = playerTownAlignment;
    player.faction = townAlignmentToFaction(playerTownAlignment);
    player.displayColorBackground =
      townAlignmentToBackgroundColor(playerTownAlignment);
  } else if (playerFaction != undefined) {
    player.role = Role.Unknown;
    player.townAlignment = factionToTownAlignment(playerFaction);
    player.faction = playerFaction;
    player.displayColorBackground = factionToBackgroundColor(playerFaction);
  } else {
    player.role = Role.Unknown;
    player.townAlignment = TownAlignment.Unknown;
    player.faction = Faction.Unknown;
    player.displayColorBackground = COLOR.BACKGROUND_UNKNOWN;
  }

  // CONFIRMATION LOCK / SUSPICION LOCK
  if (
    player.faction == Faction.NotTown ||
    player.faction == Faction.NeutralEvil ||
    player.faction == Faction.NeutralKilling ||
    player.faction == Faction.Mafia
  ) {
    player.isConfirmationLocked = true;
    player.isSuspicionLocked = true;
  } else if (!player.isUser && !player.isExecutionTarget) {
    player.isConfirmationLocked = false;

    if (user.faction == Faction.Mafia) player.isSuspicionLocked = true;
    else player.isSuspicionLocked = false;
  }

  // IS CONFIRMED TOWN
  player.isConfirmedTown = isPlayerConfirmedOnInfoEdit(
    player.isConfirmedTown,
    player.faction,
    player.isDead
  );

  // IS SUSPICIOUS
  player.isSuspicious = isPlayerSuspiciousOnInfoEdit(
    player.isSuspicious,
    player.faction,
    player.isDead
  );

  // COLOR (AFTER TAKING CONFIRMATION/SUSPICION INTO ACCOUNT)
  if (player.isConfirmedTown) {
    player.displayColorBackground = COLOR.BACKGROUND_CONFIRMED_TOWN;
  } else if (player.isSuspicious) {
    player.displayColorBackground = COLOR.BACKGROUND_SUSPICIOUS;
  }

  // DEAD PLAYER
  if (player.isDead) {
    player.isSuspicionLocked = true;

    // If they player is dead, we can't confirm them as townie anymore.
    // We can only change his role afterwards, the confirmation is automatically set upon death or role change.
    player.isConfirmationLocked = true;
  }

  // CALCULATE MAJORITY
  calculateNewMajority(playersInfo, setMajority);

  // CHECK FOR ROLE AUTO CHANGE
  checkRoleAutoChange(playersInfo, setPlayersInfo, setMajority);

  // CHECK PLAYERS FOR AUTO SUSPICION
  checkAutoSuspicion(playersInfo, setPlayersInfo);

  setPlayersInfo(playersInfo);
}

export function checkRoleAutoChange(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  setMajority: (value: { town: number; notTown: number }) => void
) {
  let exeTarget = playersInfo.find((player) => player.isExecutionTarget);
  let exe = playersInfo.find((player) => player.role == Role.Executioner);

  // EXE -> JESTER
  if (
    exeTarget != undefined &&
    exeTarget.isDead &&
    exe != undefined &&
    !exe.isDead
  ) {
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      exe.number,
      Role.Jester,
      undefined,
      undefined,
      setMajority
    );
  }

  let tkClaimingNoRoleAlivePlayers = playersInfo.filter(
    (player) =>
      player.townAlignment == TownAlignment.TK &&
      player.role == Role.Unknown &&
      !player.isDead
  );

  let confirmedOrDeadVeterans = playersInfo.filter(
    (player) =>
      player.role == Role.Veteran && (player.isDead || player.isConfirmedTown)
  );

  // TK -> VIGI (if VETERAN confirmed/dead)
  if (
    confirmedOrDeadVeterans.length > 0 &&
    tkClaimingNoRoleAlivePlayers.length > 0
  ) {
    for (let tkClaimPlayer of tkClaimingNoRoleAlivePlayers) {
      editPlayerInfo(
        playersInfo,
        setPlayersInfo,
        tkClaimPlayer.number,
        Role.Vigilante,
        undefined,
        undefined,
        setMajority
      );
    }
  }

  let aliveMafioso = playersInfo.find(
    (player) => player.role == Role.Mafioso && !player.isDead
  );
  let aliveGodfathers = playersInfo.filter(
    (player) => player.role == Role.Godfather && !player.isDead
  );
  let deadGodfathers = playersInfo.filter(
    (player) => player.role == Role.Godfather && player.isDead
  );

  // MAFIOSO -> GODFATHER (if GODFATHER dead)
  if (
    aliveGodfathers.length == 0 &&
    aliveMafioso != undefined &&
    deadGodfathers.length > 0
  ) {
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      aliveMafioso.number,
      Role.Godfather,
      undefined,
      undefined,
      setMajority
    );
  }

  let aliveMafiaPlayers = playersInfo.filter(
    (player) => player.faction == Faction.Mafia && !player.isDead
  );
  let deadMafiaPlayers = playersInfo.filter(
    (player) => player.faction == Faction.Mafia && player.isDead
  );

  // LAST MAFIA -> MAFIOSO/GF (if 3x MAFIA dead)
  if (
    aliveMafiaPlayers.length == 1 &&
    aliveMafiaPlayers[0]!.role != Role.Mafioso &&
    deadMafiaPlayers.length >= 3
  ) {
    if (deadGodfathers.length > 0) {
      aliveMafiaPlayers[0]!.role = Role.Mafioso;
    } else {
      aliveMafiaPlayers[0]!.role = Role.Godfather;
    }
  }
}

function isPlayerConfirmedOnInfoEdit(
  wasPreviouslyConfirmedTown: boolean,
  newFaction: Faction,
  isDead: boolean
) {
  let isPlayerNowConfirmed = false;
  let isNowTown = newFaction == Faction.Town;

  if (!wasPreviouslyConfirmedTown && isNowTown && !isDead) {
    isPlayerNowConfirmed = false;
  } else {
    isPlayerNowConfirmed = isNowTown;
  }

  return isPlayerNowConfirmed;
}

function isPlayerSuspiciousOnInfoEdit(
  wasPreviouslySuspicious: boolean,
  newFaction: Faction,
  isDead: boolean
) {
  let isNowTown = newFaction == Faction.Town;

  if (isDead) {
    return false;
  } else if (wasPreviouslySuspicious && isNowTown) {
    return true;
  } else {
    return false;
  }
}

function calculateNewMajority(
  playersInfo: PlayersInfo,
  setMajority: (value: { town: number; notTown: number }) => void
) {
  let deadTownCount = 0;
  let deadPlayers = playersInfo.filter((player) => player.isDead);

  deadPlayers.forEach((deadPlayer) => {
    if (
      deadPlayer.faction == Faction.Town ||
      deadPlayer.role == Role.ProbablyForged ||
      deadPlayer.role == Role.Cleaned
    ) {
      deadTownCount++;
    }
  });

  let playersAlive = TOTAL_PLAYER_COUNT - deadPlayers.length;
  let townAlive = TOTAL_TOWN_COUNT - deadTownCount;

  setMajority({
    town: townAlive,
    notTown: playersAlive - townAlive,
  });
}
