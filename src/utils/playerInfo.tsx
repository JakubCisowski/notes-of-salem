import { COLOR } from './color';
import { Faction, Role, SuspicionSeverity, TownAlignment } from './enums';
import {
  factionToBackgroundColor,
  factionToTownAlignment,
  getTownAlignmentSlots,
  isRoleUnique,
  roleToBackgroundColor,
  roleToFaction,
  roleToTownAlignment,
  townAlignmentToBackgroundColor,
  townAlignmentToFaction,
} from './infoHelper';

// todo: export to separate file

export type PlayersInfo = PlayerInfo[];

export type PlayerInfo = {
  number: number; // Player number (1-15)
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

export function generateDefaultPlayersInfo(userNumber: number, userRole: Role) {
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
    let displayColor = COLOR.BACKGROUND_UNKNOWN;
    let autoSuspicionSeverity = SuspicionSeverity.None;
    let autoSuspicionNotes = [];
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
      autoSuspicionNotes: [],
      isSuspicionLocked: isSuspicionLocked,
      isDead: isDead,
      isUser: isUser,
      isExecutionTarget: isExecutionTarget,
    });
  }

  return playersInfo;
}

export function setupExecutionerTarget(
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
  targetPlayerInfo.isConfirmationLocked = true;
  targetPlayerInfo.displayColorBackground = COLOR.BACKGROUND_CONFIRMED_TOWN;
  targetPlayerInfo.isSuspicionLocked = true;
  targetPlayerInfo.isExecutionTarget = true;

  return playersInfo; // Does it need to return anything?
}

export function setupUserMafiaNumbers(
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
    targetPlayerInfo.displayColorBackground = COLOR.BACKGROUND_MAFIA;
    targetPlayerInfo.isConfirmationLocked = true;
    // .isSuspicionLocked already set to true in generateInitialPlayersInfo()
  }

  return playersInfo; // Does it need to return anything?
}

export function markPlayerAsDead(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void,
  deadPlayerNumber: number,
  deadPlayerRole: Role,
  setMajority: any
) {
  if (deadPlayerNumber < 1 || deadPlayerNumber > 15) return;

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
  setMajority: any
) {
  if (playerNumber < 1 || playerNumber > 15) return;

  let player = playersInfo.find((player) => player.number == playerNumber)!;

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

  // CONFIRMATION / SUSPICION LOCK
  if (
    player.faction == Faction.NotTown ||
    player.faction == Faction.NeutralEvil ||
    player.faction == Faction.Mafia
  ) {
    player.isConfirmationLocked = true;
    player.isSuspicionLocked = true;
  } else if (!player.isUser && !player.isExecutionTarget) {
    player.isConfirmationLocked = false;
    player.isSuspicionLocked = false;
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
  setMajority: any
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
  // ? It's not really clear what to do, for example if there is 2 mafia alive [consig] and [not set]
  // ? and gf dies, its obvious that [not set] becomes gf, but it's too much work to implement it
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

  // LAST MAFIA -> MAFIOSO (if 3x MAFIA dead)
  // ? I don't know if he should become mafioso or godfather, will not implement it for now.
}

function isPlayerConfirmedOnInfoEdit(
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

function isPlayerSuspiciousOnInfoEdit(
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

function calculateNewMajority(playersInfo: PlayersInfo, setMajority: any) {
  let deadTownCount = 0;

  let deadPlayers = playersInfo.filter((player) => player.isDead);

  deadPlayers.forEach((deadPlayer) => {
    // It counts forged/cleaned dead players as dead town.
    if (
      deadPlayer.faction == Faction.Town ||
      deadPlayer.role == Role.ProbablyForged ||
      deadPlayer.role == Role.Cleaned
    ) {
      deadTownCount++;
    }
  });

  let playersAlive = 15 - deadPlayers.length;
  let townAlive = 9 - deadTownCount;

  let newMajority = {
    town: townAlive,
    notTown: playersAlive - townAlive,
  };

  setMajority(newMajority);
}

export function checkAutoSuspicion(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void
) {
  const RT_SLOTS = 3;
  let confirmedRandomTownAmount = howManyConfirmedRT(playersInfo);
  let unconfirmedRandomTownClaimsAmount =
    howManyUnconfirmedClaimRT(playersInfo);

  // MODERATE SUSPICION
  // M1) there is place for alive rt (after counting dead/confirmed), and is one of the people that claim to be RT and number of people who claim RT is too high
  // M2) claims unique role with at least one other not confirmed player

  // HIGH SUSPICION
  // H1) there is no place for RT (after counting dead/confirmed) and claims RT
  // H2) claims unique role with at least one other confirmed player

  // AUTO SUSPICION TRUST USER CONFIRMATION
  // SO WE DONT CHECK IT FOR CONFIRMED AND DEAD PLAYERS
  // AND ONLY FOR TOWN/UNKNOWN FACTION PLAYERS
  playersInfo.forEach((player) => {
    if (
      !player.isConfirmedTown &&
      !player.isDead &&
      (player.faction == Faction.Unknown || player.faction == Faction.Town)
    ) {
      let moderateSuspiciousLeads = 0;
      let highSuspiciousLeads = 0;
      let newAutoSuspicionNotes: string[] = [];
      let doesPlayerClaimRandomTown = doesPlayerClaimRT(
        player.number,
        playersInfo
      );
      let isPlayerRoleUnique = isRoleUnique(player.role);
      let unconfirmedPlayersClaimThisRoleAmount =
        howManyUnconfirmedPlayersClaimThisRole(player.role, playersInfo);
      let confirmedPlayersClaimThisRoleAmount =
        howManyConfirmedPlayersClaimThisRole(player.role, playersInfo);

      // M1)
      if (
        confirmedRandomTownAmount < RT_SLOTS &&
        doesPlayerClaimRandomTown &&
        unconfirmedRandomTownClaimsAmount > RT_SLOTS - confirmedRandomTownAmount
      ) {
        moderateSuspiciousLeads++;
        newAutoSuspicionNotes.push(
          '- One of too many unconfirmed players who claim RT.'
        );
      }

      // M2)
      if (isPlayerRoleUnique && unconfirmedPlayersClaimThisRoleAmount > 1) {
        moderateSuspiciousLeads++;
        newAutoSuspicionNotes.push(
          '- Claims unique role (' +
            Role[player.role] +
            ') with other unconfirmed player.'
        );
      }

      // H1)
      if (confirmedRandomTownAmount >= RT_SLOTS && doesPlayerClaimRandomTown) {
        highSuspiciousLeads++;
        newAutoSuspicionNotes.push('- Claims RT but there is no place for RT.');
      }

      // H2)
      if (isPlayerRoleUnique && confirmedPlayersClaimThisRoleAmount >= 1) {
        highSuspiciousLeads++;
        newAutoSuspicionNotes.push(
          '- Claims unique role (' +
            Role[player.role] +
            ') but other confirmed player occupies it.'
        );
      }

      if (highSuspiciousLeads > 0 || moderateSuspiciousLeads > 1) {
        player.autoSuspicionSeverity = SuspicionSeverity.High;
      } else if (moderateSuspiciousLeads > 0) {
        player.autoSuspicionSeverity = SuspicionSeverity.Moderate;
      } else {
        player.autoSuspicionSeverity = SuspicionSeverity.None;
      }

      player.autoSuspicionNotes = newAutoSuspicionNotes;
    } else {
      player.autoSuspicionSeverity = SuspicionSeverity.None;
      player.autoSuspicionNotes = [];
    }
  });

  setPlayersInfo(playersInfo);
  console.log(playersInfo);
}

function howManyConfirmedAreFromAlignment(
  playersInfo: PlayersInfo,
  alignment: TownAlignment
) {
  let confirmedCount = playersInfo.filter(
    (player) =>
      (player.isConfirmedTown || player.isDead) &&
      player.townAlignment == alignment
  ).length;

  return confirmedCount;
}

function howManyUnconfirmedClaimAlignment(
  playersInfo: PlayersInfo,
  alignment: TownAlignment
) {
  let unconfirmedCount = playersInfo.filter(
    (player) =>
      !(player.isConfirmedTown || player.isDead) &&
      player.townAlignment == alignment
  ).length;

  return unconfirmedCount;
}

function howManyConfirmedRT(playersInfo: PlayersInfo) {
  let confirmedRTCount = 0;

  let eligibleAlignmentsForRT = [
    TownAlignment.TI,
    TownAlignment.TP,
    TownAlignment.TK,
    TownAlignment.TS,
  ];

  for (let alignment of eligibleAlignmentsForRT) {
    let alignmentConfirmed = howManyConfirmedAreFromAlignment(
      playersInfo,
      alignment
    );
    let alignmentSlots = getTownAlignmentSlots(alignment);
    if (alignmentConfirmed > alignmentSlots)
      confirmedRTCount += alignmentConfirmed - alignmentSlots;
  }

  return confirmedRTCount;
}

function howManyUnconfirmedClaimRT(playersInfo: PlayersInfo) {
  let unConfirmedRTClaimCount = 0;

  let eligibleAlignmentsForRT = [
    TownAlignment.TI,
    TownAlignment.TP,
    TownAlignment.TK,
    TownAlignment.TS,
  ];

  /*
  todo: Rewrite these examples in english.

  x 3 confirmed doctorow
  y 2 uncofirmed tp claimow
  z sloty: 1

  ile confirmed RT claimow = 2 (jesli x>z to x-z, jesli x<=z to 0)
  ile unconfirmed RT = 2 (jesli x >= z to y)

  x 1 confirmed spy
  y 5 uncofirmed TI claimow
  z sloty: 2

  ile confirmed RT claimow = 0     (jesli x>z to x-z, jesli x<=z toz 0)
  ile unconfirmed RT = 5!!! (jesli x+y > z TO [jesli x >= z to y, jesli x < z to y] )

  x 0(!) confirmed spy
  y 2 uncofirmed TI claimow
  z sloty: 2

  ile confirmed RT claimow = 0     (jesli x>z to x-z, jesli x<=z toz 0)
  ile unconfirmed RT = 0 (jesli x+y <= z to 0, wtedy ci unforimed nie claimuja RT bo wszystko sie zgadza)



  When amount of uncofirmed claims exceed amount of slots, every one of 
  */

  for (let alignment of eligibleAlignmentsForRT) {
    let alignmentConfirmed = howManyConfirmedAreFromAlignment(
      playersInfo,
      alignment
    );
    let alignmentUnconfirmed = howManyUnconfirmedClaimAlignment(
      playersInfo,
      alignment
    );
    let alignmentSlots = getTownAlignmentSlots(alignment);

    if (alignmentConfirmed + alignmentUnconfirmed > alignmentSlots)
      unConfirmedRTClaimCount += alignmentUnconfirmed;
  }

  return unConfirmedRTClaimCount;
}

function doesPlayerClaimRT(playerNumber: number, playersInfo: PlayersInfo) {
  let eligibleAlignmentsForRT = [
    TownAlignment.TI,
    TownAlignment.TP,
    TownAlignment.TK,
    TownAlignment.TS,
  ];

  let player = playersInfo.find((player) => player.number == playerNumber);

  if (!eligibleAlignmentsForRT.includes(player!.townAlignment)) return false;

  let alignment = player!.townAlignment;

  let alignmentConfirmed = howManyConfirmedAreFromAlignment(
    playersInfo,
    alignment
  );
  let alignmentUnconfirmed = howManyUnconfirmedClaimAlignment(
    playersInfo,
    alignment
  );
  let alignmentSlots = getTownAlignmentSlots(alignment);

  if (alignmentConfirmed + alignmentUnconfirmed > alignmentSlots) return true;

  return false;
}

function howManyConfirmedPlayersClaimThisRole(
  role: Role,
  playersInfo: PlayersInfo
) {
  let roleCount = playersInfo.filter(
    (player) => (player.isConfirmedTown || player.isDead) && player.role == role
  ).length;

  return roleCount;
}

function howManyUnconfirmedPlayersClaimThisRole(
  role: Role,
  playersInfo: PlayersInfo
) {
  let roleCount = playersInfo.filter(
    (player) =>
      !(player.isConfirmedTown || player.isDead) && player.role == role
  ).length;

  return roleCount;
}
