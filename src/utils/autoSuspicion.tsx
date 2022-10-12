import { TOTAL_RT_SLOTS } from './consts/Consts';
import { Faction, Role, SuspicionSeverity, TownAlignment } from './enums/enums';
import { getTownAlignmentSlots, isRoleUnique } from './infoEnumsHelper';
import { PlayersInfo } from './types/PlayersInfo';

const RTalignments = [
  TownAlignment.TI,
  TownAlignment.TP,
  TownAlignment.TK,
  TownAlignment.TS,
];

export function checkAutoSuspicion(
  playersInfo: PlayersInfo,
  setPlayersInfo: (value: PlayersInfo) => void
) {
  let confirmedRTAmount = howManyConfirmedRT(playersInfo);
  let unconfirmedRTClaimsAmount = howManyUnconfirmedClaimRT(playersInfo);

  // MODERATE SUSPICION
  // M1) there is place for alive rt (after counting dead/confirmed), and is one of the people that claim to be RT and number of people who claim RT is too high
  // M2) claims unique role with at least one other not confirmed player

  // HIGH SUSPICION
  // H1) there is no place for RT (after counting dead/confirmed) and claims RT
  // H2) claims unique role with at least one other confirmed player

  // Auto suspicion is checked only for: (1) not confirmed town, (2) alive, (3) not evil
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
        confirmedRTAmount < TOTAL_RT_SLOTS &&
        doesPlayerClaimRandomTown &&
        unconfirmedRTClaimsAmount > TOTAL_RT_SLOTS - confirmedRTAmount
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
      if (confirmedRTAmount >= TOTAL_RT_SLOTS && doesPlayerClaimRandomTown) {
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

  for (let alignment of RTalignments) {
    let alignmentConfirmed = howManyConfirmedAreFromAlignment(
      playersInfo,
      alignment
    );
    let alignmentSlots = getTownAlignmentSlots(alignment);
    if (alignmentConfirmed > alignmentSlots && alignmentSlots != -1)
      confirmedRTCount += alignmentConfirmed - alignmentSlots;
  }

  return confirmedRTCount;
}

function howManyUnconfirmedClaimRT(playersInfo: PlayersInfo) {
  let unConfirmedRTClaimCount = 0;

  for (let alignment of RTalignments) {
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
  let player = playersInfo.find((player) => player.number == playerNumber)!;

  if (!RTalignments.includes(player.townAlignment)) return false;

  let alignment = player.townAlignment;

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
