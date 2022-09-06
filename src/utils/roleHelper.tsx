import { Faction, Role, TownAlignment } from './enums';

export function roleToFaction(role: Role): Faction {
  let faction = Faction.unknown;

  switch (role) {
    case Role.unknown:
    case Role.cleaned:
    case Role.notNeeded:
      faction = Faction.unknown;
      break;
    case Role.jailor:
    case Role.lookout:
    case Role.spy:
    case Role.investigator:
    case Role.sheriff:
    case Role.bodyguard:
    case Role.doctor:
    case Role.veteran:
    case Role.vigilante:
    case Role.escort:
    case Role.transporter:
    case Role.medium:
    case Role.retributionist:
    case Role.mayor:
      faction = Faction.town;
      break;
    case Role.godfather:
    case Role.mafioso:
    case Role.consigliere:
    case Role.consort:
    case Role.janitor:
    case Role.forger:
    case Role.framer:
    case Role.disguiser:
    case Role.blackmailer:
    case Role.hypnotist:
    case Role.ambusher:
      faction = Faction.mafia;
      break;
    case Role.executioner:
    case Role.witch:
      faction = Faction.neutral;
      break;
  }

  return faction;
}

export function roleToTownAlignment(role: Role): TownAlignment {
  let townAlignment = TownAlignment.unknown;

  switch (role) {
    case Role.unknown:
    case Role.cleaned:
      townAlignment = TownAlignment.unknown;
      break;
    case Role.jailor:
      townAlignment = TownAlignment.J;
      break;
    case Role.lookout:
    case Role.spy:
    case Role.investigator:
    case Role.sheriff:
      townAlignment = TownAlignment.TI;
      break;
    case Role.bodyguard:
    case Role.doctor:
      townAlignment = TownAlignment.TP;
      break;
    case Role.veteran:
    case Role.vigilante:
      townAlignment = TownAlignment.TK;
      break;
    case Role.escort:
    case Role.transporter:
    case Role.medium:
    case Role.retributionist:
    case Role.mayor:
      townAlignment = TownAlignment.TS;
      break;
    default:
      townAlignment = TownAlignment.notTown;
      break;
  }

  return townAlignment;
}

export function isRoleUnique(role: Role): boolean {
  // Is checking every role necessary? Probably not, because it's only for automated RT suspicion.
  // Executioner and witch are unique here, because app analyzes ranked games only (for now).
  let isUnique = false;

  switch (role) {
    case Role.jailor:
    case Role.veteran:
    case Role.retributionist:
    case Role.mayor:
    case Role.godfather:
    case Role.executioner:
    case Role.witch:
      isUnique = true;
      break;
    default:
      isUnique = false;
      break;
  }

  return isUnique;
}

export function getTownAlignmentSlots(townAlignment: TownAlignment): number {
  let slots = -1;

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
      slots = 1;
    case TownAlignment.TI:
      slots = 2;
    case TownAlignment.notTown:
    case TownAlignment.unknown:
      slots = -1;
      break;
  }
  return slots;
}
