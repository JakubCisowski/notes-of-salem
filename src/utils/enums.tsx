export enum Role {
  Unknown,
  Cleaned,
  NotNeeded,
  Jailor,
  Lookout,
  Spy,
  Investigator,
  Sheriff,
  Bodyguard,
  Doctor,
  Veteran,
  Vigilante,
  Escort,
  Transporter,
  Medium,
  Retributionist,
  Mayor,
  Godfather,
  Mafioso,
  Consigliere,
  Consort,
  Janitor,
  Forger,
  Framer,
  Disguiser,
  Blackmailer,
  Hypnotist,
  Ambusher,
  Executioner,
  Witch,
}

export enum Faction {
  Unknown,
  Town,
  Mafia,
  Neutral,
}

export enum TownAlignment {
  Unknown,
  NotTown,
  J,
  TI,
  TP,
  TK,
  TS,
}

// Probably needed:
// - show how many spots are there for specific faction/alignment (tracking)
// - show which roles are unique for automated RT suspicion
