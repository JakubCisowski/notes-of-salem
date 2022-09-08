import React from 'react';
import { PlayersInfo } from '../utils/playerInfo';
import {
  alignmentDisplayString,
  factionDisplayString,
  roleDisplayString,
} from '../utils/roleHelper';

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

function PlayerCard({
  playerNumber,
  playersInfo,
  setPlayersInfo,
}: {
  playerNumber: number;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
}) {
  // Modifying player DOES modify playersInfo.
  // But shouldn't we use setPlayersInfo to modify playersInfo - rendering issues possible?
  // For example some components wont rerender when player is modified (not setPlayersInfo).
  let player = playersInfo.find((player) => player.number == playerNumber)!;

  // These states only exist for this compononent to rerender, they are not used anywhere else.
  // todo: How to avoid that?
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(
    player.isConfirmedTown
  );
  const [isSuspicious, setIsSuspicious] = React.useState<boolean>(
    player.isSuspicious
  );

  function onConfirmedCheckboxChange(e: any) {
    setIsConfirmed(e.target.checked);
    player.isConfirmedTown = e.target.checked;
    //setPlayersInfo(playersInfo); // should we use this anywyas?
    console.log(playersInfo);
  }

  function onSuspiciousCheckboxChange(e: any) {
    setIsSuspicious(e.target.checked);
    player.isSuspicious = e.target.checked;
    //setPlayersInfo(playersInfo); // should we use this anywyas?
    console.log(playersInfo);
  }

  return (
    <>
      <div className="notepad-player-card-container">
        <div className="notepad-card-section-number">{player.number}</div>
        <div className="notepad-card-section-button">SET ROLE</div>
        <div className="notepad-card-section-confirmed">
          {player.isConfirmationLocked ? (
            <input
              type="checkbox"
              checked={player.isConfirmedTown}
              onChange={onConfirmedCheckboxChange}
              disabled
              className="checkbox"
            ></input>
          ) : (
            <input
              type="checkbox"
              checked={player.isConfirmedTown}
              onChange={onConfirmedCheckboxChange}
              className="checkbox"
            ></input>
          )}
        </div>
        <div className="notepad-card-section-faction">
          {factionDisplayString(player.faction)}
        </div>
        <div className="notepad-card-section-alignment">
          {alignmentDisplayString(player.townAlignment)}
        </div>
        <div className="notepad-card-section-role">
          {roleDisplayString(player.role)}
        </div>
        <div className="notepad-card-section-suspicious">
          {player.isSuspicionLocked ? (
            <input
              type="checkbox"
              checked={player.isSuspicious}
              onChange={onSuspiciousCheckboxChange}
              disabled
              className="checkbox"
            ></input>
          ) : (
            <input
              type="checkbox"
              checked={player.isSuspicious}
              onChange={onSuspiciousCheckboxChange}
              className="checkbox"
            ></input>
          )}
        </div>
        <div className="notepad-card-section-possibly-suspicious">{}</div>
        <div className="notepad-card-section-note">note</div>
        <div className="notepad-card-section-dead-button">DEAD</div>
      </div>
    </>
  );
}

function Header() {
  return (
    <>
      <div className="header-flexbox">
        <div className="header-number">#</div>
        <div className="header-confirmed">
          <p style={{ margin: 0 }}>
            CONFIRMED
            <br />
            TOWN?
          </p>
        </div>
        <div className="header-suspicious">SUSPICIOUS?</div>
      </div>
    </>
  );
}