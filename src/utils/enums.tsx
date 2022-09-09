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
}

export enum TownAlignment { // Stritcly for tracking RT's
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
  NotTown, // When we don't know if Mafia or Neutral Evil
  Mafia,
  NeutralEvil,
  Town,
}

export enum SuspicionSeverity {
  None,
  Moderate,
  High,
}
