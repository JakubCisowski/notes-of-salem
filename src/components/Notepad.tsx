import { PlayersInfo } from '../utils/playerInfo';
import { factionAbbreviation } from '../utils/roleHelper';

export function Notepad({
  playersInfo,
  setPlayersInfo,
}: {
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
}) {
  const alivePlayerCards: any[] = [];
  const deadPlayerCards: any[] = [];

  playersInfo.forEach((playerInfo) => {
    let card = (
      <PlayerCard
        playerNumber={playerInfo.number}
        playersInfo={playersInfo}
        setPlayersInfo={setPlayersInfo}
      />
    );
    if (!playerInfo.isDead) {
      alivePlayerCards.push(card);
    } else {
      deadPlayerCards.push(card);
    }
  });

  return (
    <>
      <div className="notepad-container">
        <h1>Alive</h1>
        <Header />
        <div className="notepad-alive-container">{alivePlayerCards}</div>
        {deadPlayerCards.length > 0 && (
          <>
            <h1>Dead</h1>
            <Header />
            <div className="notepad-dead-container">{deadPlayerCards}</div>
          </>
        )}
      </div>
    </>
  );
}

function Header() {
  return (
    <>
      <div className="header-flexbox">
        <div className="header-number">#</div>
        <div className="header-confirmed">CONFIRMED?</div>
        <div className="header-suspicious">SUSPICIOUS?</div>
      </div>
    </>
  );
}

function PlayerCard({
  playerNumber,
  playersInfo,
  setPlayersInfo,
}: {
  playerNumber: number;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
}) {
  let player = playersInfo.find((player) => player.number == playerNumber)!;
  return (
    <>
      <div className="notepad-player-card-container">
        <div className="notepad-card-section-number">{player.number}</div>
        <div className="notepad-card-section-button">SET ROLE</div>
        <div className="notepad-card-section-confirmed">x</div>
        <div className="notepad-card-section-faction">
          {factionAbbreviation(player.faction)}
        </div>
        <div className="notepad-card-section-alignment">TI</div>
        <div className="notepad-card-section-role">Investigator</div>
        <div className="notepad-card-section-suspicious">x</div>
        <div className="notepad-card-section-possibly-suspicious">?</div>
        <div className="notepad-card-section-note">note</div>
        <div className="notepad-card-section-dead-button">DEAD</div>
      </div>
    </>
  );
}
