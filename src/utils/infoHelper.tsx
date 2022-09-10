import { COLOR } from './color';
import { Faction, Role, TownAlignment } from './enums';

export function roleToFaction(role: Role): Faction {
  let faction = Faction.Unknown;

  switch (role) {
    case Role.Unknown:
    case Role.Cleaned:
    case Role.YourOtherMafia:
    case Role.ProbablyForged:
      faction = Faction.Unknown;
      break;
    case Role.Jailor:
    case Role.Lookout:
    case Role.Spy:
    case Role.Investigator:
    case Role.Sheriff:
    case Role.Bodyguard:
    case Role.Doctor:
    case Role.Veteran:
    case Role.Vigilante:
    case Role.Escort:
    case Role.Transporter:
    case Role.Medium:
    case Role.Retributionist:
    case Role.Mayor:
      faction = Faction.Town;
      break;
    case Role.Godfather:
    case Role.Mafioso:
    case Role.Consigliere:
    case Role.Consort:
    case Role.Janitor:
    case Role.Forger:
    case Role.Framer:
    case Role.Disguiser:
    case Role.Blackmailer:
    case Role.Hypnotist:
    case Role.Ambusher:
      faction = Faction.Mafia;
      break;
    case Role.Executioner:
    case Role.Jester:
    case Role.Witch:
      faction = Faction.NeutralEvil;
      break;
  }

  return faction;
}

export function roleToTownAlignment(role: Role): TownAlignment {
  let townAlignment = TownAlignment.Unknown;

  switch (role) {
    case Role.Unknown:
    case Role.Cleaned:
    case Role.ProbablyForged:
      townAlignment = TownAlignment.Unknown;
      break;
    case Role.Jailor:
      townAlignment = TownAlignment.J;
      break;
    case Role.Lookout:
    case Role.Spy:
    case Role.Investigator:
    case Role.Sheriff:
      townAlignment = TownAlignment.TI;
      break;
    case Role.Bodyguard:
    case Role.Doctor:
      townAlignment = TownAlignment.TP;
      break;
    case Role.Veteran:
    case Role.Vigilante:
      townAlignment = TownAlignment.TK;
      break;
    case Role.Escort:
    case Role.Transporter:
    case Role.Medium:
    case Role.Retributionist:
    case Role.Mayor:
      townAlignment = TownAlignment.TS;
      break;
    default:
      townAlignment = TownAlignment.NotTown;
      break;
  }

  return townAlignment;
}

export function roleToBackgroundColor(role: Role): string {
  let colorString = COLOR.BLACK;

  switch (role) {
    case Role.Unknown:
      colorString = 'white';
      break;
    case Role.Cleaned:
    case Role.ProbablyForged:
      colorString = COLOR.CLEANED_OR_FORGED;
      break;
    case Role.Jailor:
    case Role.Lookout:
    case Role.Spy:
    case Role.Investigator:
    case Role.Sheriff:
    case Role.Bodyguard:
    case Role.Doctor:
    case Role.Veteran:
    case Role.Vigilante:
    case Role.Escort:
    case Role.Transporter:
    case Role.Medium:
    case Role.Retributionist:
    case Role.Mayor:
      colorString = COLOR.UNKNOWN;
      break;
    case Role.Godfather:
    case Role.YourOtherMafia:
    case Role.Mafioso:
    case Role.Consigliere:
    case Role.Consort:
    case Role.Janitor:
    case Role.Forger:
    case Role.Framer:
    case Role.Disguiser:
    case Role.Blackmailer:
    case Role.Hypnotist:
    case Role.Ambusher:
      colorString = COLOR.MAFIA;
      break;
    case Role.Executioner:
      colorString = COLOR.EXE;
      break;
    case Role.Jester:
      colorString = COLOR.JESTER;
      break;
    case Role.Witch:
      colorString = COLOR.WITCH;
      break;
  }

  return colorString;
}

export function roleToTextColor(role: Role): string {
  let colorString = COLOR.BLACK;

  switch (role) {
    case Role.Unknown:
      colorString = COLOR.BLACK;
      break;
    case Role.Cleaned:
    case Role.ProbablyForged:
      colorString = COLOR.BLACK;
      break;
    case Role.Jailor:
    case Role.Lookout:
    case Role.Spy:
    case Role.Investigator:
    case Role.Sheriff:
    case Role.Bodyguard:
    case Role.Doctor:
    case Role.Veteran:
    case Role.Vigilante:
    case Role.Escort:
    case Role.Transporter:
    case Role.Medium:
    case Role.Retributionist:
    case Role.Mayor:
      colorString = COLOR.CONFIRMED_TOWN_TEXT;
      break;
    case Role.Godfather:
    case Role.YourOtherMafia:
    case Role.Mafioso:
    case Role.Consigliere:
    case Role.Consort:
    case Role.Janitor:
    case Role.Forger:
    case Role.Framer:
    case Role.Disguiser:
    case Role.Blackmailer:
    case Role.Hypnotist:
    case Role.Ambusher:
      colorString = COLOR.MAFIA;
      break;
    case Role.Executioner:
      colorString = COLOR.BLACK;
      break;
    case Role.Jester:
      colorString = COLOR.JESTER;
      break;
    case Role.Witch:
      colorString = COLOR.WITCH_TEXT;
      break;
  }

  return colorString;
}

export function isRoleUnique(role: Role): boolean {
  // Is checking every role necessary? Probably not, because it's only for automated RT suspicion.
  // Executioner and witch are unique here, because app analyzes ranked games only (for now).
  let isUnique = false;

  switch (role) {
    case Role.Jailor:
    case Role.Veteran:
    case Role.Retributionist:
    case Role.Mayor:
    case Role.Godfather:
    case Role.Executioner:
    case Role.Jester:
    case Role.Witch:
      isUnique = true;
      break;
    default:
      isUnique = false;
      break;
  }

  return isUnique;
}

export function getRoleDisplayString(role: Role): string {
  let displayString = '';

  switch (role) {
    case Role.Unknown:
      displayString = '?';
      break;
    case Role.YourOtherMafia:
      displayString = '(Mafia)';
      break;
    case Role.ProbablyForged:
      displayString = '(Forged)';
      break;
    case Role.Cleaned:
      displayString = '(Cleaned)';
      break;
    default:
      displayString = Role[role]!;
      break;
  }

  return displayString;
}

export function getTownAlignmentSlots(townAlignment: TownAlignment): number {
  let slots = -1;

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
      slots = 1;
      break;
    case TownAlignment.TI:
      slots = 2;
      break;
    case TownAlignment.NotTown:
    case TownAlignment.Unknown:
      slots = -1;
      break;
  }
  return slots;
}

export function townAlignmentToFaction(townAlignment: TownAlignment): Faction {
  let faction = Faction.Unknown;

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
    case TownAlignment.TI:
      faction = Faction.Town;
      break;
    case TownAlignment.NotTown:
      faction = Faction.NotTown; // This might cause bugs, maybe should be Unknown.
      break;
    case TownAlignment.Unknown:
      faction = Faction.Unknown;
      break;
  }
  return faction;
}

export function townAlignmentToBackgroundColor(
  townAlignment: TownAlignment
): string {
  let colorString = COLOR.BLACK;

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
    case TownAlignment.TI:
    case TownAlignment.Unknown:
      colorString = COLOR.UNKNOWN;
      break;
    case TownAlignment.NotTown:
      colorString = COLOR.SUSPICIOUS;
      break;
  }
  return colorString;
}

export function townAlignmentToTextColor(townAlignment: TownAlignment): string {
  let colorString = COLOR.BLACK;

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
    case TownAlignment.TI:
    case TownAlignment.Unknown:
      colorString = COLOR.CONFIRMED_TOWN_TEXT;
      break;
    case TownAlignment.NotTown:
      colorString = COLOR.BLACK;
      break;
  }
  return colorString;
}

export function getTownAlignmentDisplayString(
  townAlignment: TownAlignment
): string {
  let displayString = '';

  switch (townAlignment) {
    case TownAlignment.J:
    case TownAlignment.TK:
    case TownAlignment.TP:
    case TownAlignment.TS:
    case TownAlignment.TI:
      displayString = TownAlignment[townAlignment]!;
      break;
    case TownAlignment.NotTown:
    case TownAlignment.Unknown:
      displayString = '';
      break;
  }
  return displayString;
}

export function getFactionDisplayString(faction: Faction): string {
  let displayString = '';
  switch (faction) {
    case Faction.Unknown:
    case Faction.Town:
      displayString = '';
      break;
    case Faction.Mafia:
      displayString = 'M';
      break;
    case Faction.NeutralEvil:
      displayString = 'NE';
      break;
    case Faction.NotTown:
      displayString = 'EVIL';
      break;
  }

  return displayString;
}

export function factionToTownAlignment(faction: Faction): TownAlignment {
  let alignment = TownAlignment.Unknown;

  switch (faction) {
    case Faction.Unknown:
    case Faction.Town:
      alignment = TownAlignment.Unknown;
      break;
    case Faction.Mafia:
    case Faction.NeutralEvil:
    case Faction.NotTown:
      alignment = TownAlignment.NotTown;
      break;
  }

  return alignment;
}

export function factionToBackgroundColor(faction: Faction): string {
  let color = COLOR.BLACK;

  switch (faction) {
    case Faction.Unknown:
    case Faction.Town:
      color = COLOR.UNKNOWN;
      break;
    case Faction.Mafia:
      color = COLOR.MAFIA;
      break;
    case Faction.NeutralEvil:
    case Faction.NotTown:
      color = COLOR.NOTTOWN_BACKGROUND; // ? or maybe something else? suspicious is too light if we know its NE
      break;
  }

  return color;
}

export function factionToTextColor(faction: Faction): string {
  let color = COLOR.BLACK;

  switch (faction) {
    case Faction.Unknown:
    case Faction.Town:
      color = COLOR.UNKNOWN;
      break;
    case Faction.Mafia:
      color = COLOR.MAFIA;
      break;
    case Faction.NeutralEvil:
    case Faction.NotTown:
      color = COLOR.BLACK;
      break;
  }

  return color;
}
