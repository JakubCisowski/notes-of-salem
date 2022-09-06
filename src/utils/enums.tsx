export enum Role {
  unknown,
  cleaned,
  notNeeded,
  jailor,
  lookout,
  spy,
  investigator,
  sheriff,
  bodyguard,
  doctor,
  veteran,
  vigilante,
  escort,
  transporter,
  medium,
  retributionist,
  mayor,
  godfather,
  mafioso,
  consigliere,
  consort,
  janitor,
  forger,
  framer,
  disguiser,
  blackmailer,
  hypnotist,
  ambusher,
  executioner,
  witch,
}

export enum Faction {
  unknown,
  town,
  mafia,
  neutral,
}

export enum TownAlignment {
  unknown,
  notTown,
  J,
  TI,
  TP,
  TK,
  TS,
}

// Probably needed:
// - show how many spots are there for specific faction/alignment (tracking)
// - show which roles are unique for automated RT suspicion
