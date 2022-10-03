export enum Role {
  Unknown,
  Cleaned,
  ProbablyForged,
  YourOtherMafia,
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
  Jester,
  Witch,
  Arsonist,
  SerialKiller,
  Werewolf,
}

export enum TownAlignment { // For tracking RT's
  Unknown,
  NotTown,
  J,
  TI,
  TP,
  TK,
  TS,
}

export enum Faction {
  Unknown,
  NotTown, // When we know they're not town, but not sure which faction
  Mafia,
  NeutralEvil,
  NeutralKilling,
  Town,
}

export enum SuspicionSeverity {
  None,
  Moderate,
  High,
}
