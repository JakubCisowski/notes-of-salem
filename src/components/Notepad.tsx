import React, { useState } from 'react';
import { COLOR } from '../utils/color';
import { Faction } from '../utils/enums';
import {
  getFactionDisplayString,
  getRoleDisplayString,
  getTownAlignmentDisplayString,
  roleToColor,
} from '../utils/infoHelper';
import { PlayersInfo } from '../utils/playerInfo';
import { DeadForm } from './DeadForm';
import { EditForm } from './EditForm';

export function Notepad({
  playersInfo,
  setPlayersInfo,
  gameNote,
  setGameNote,
}: {
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  gameNote: string;
  setGameNote: any;
}) {
  const [notepadUpadter, setNotepadUpdater] = useState(0); // This is a hack to force a re-render of the notepad.

  const alivePlayerCards: any[] = [];
  const deadPlayerCards: any[] = [];

  playersInfo.forEach((playerInfo) => {
    let card = (
      <PlayerCard
        playerNumber={playerInfo.number}
        playersInfo={playersInfo}
        setPlayersInfo={setPlayersInfo}
        setNotepadUpdater={setNotepadUpdater}
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
        <HeaderAlive />
        <div className="notepad-alive-container">{alivePlayerCards}</div>
        {deadPlayerCards.length > 0 && (
          <>
            <hr className="horizontal-line"></hr>
            <HeaderDead />
            <div className="notepad-dead-container">{deadPlayerCards}</div>
          </>
        )}
      </div>
      <div className="sidenotes-container">
        <Sidenotes gameNote={gameNote} setGameNote={setGameNote} />
      </div>
    </>
  );
}

function PlayerCard({
  playerNumber,
  playersInfo,
  setPlayersInfo,
  setNotepadUpdater,
}: {
  playerNumber: number;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  setNotepadUpdater: (value: number) => void;
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

  const [playerColor, setPlayerColor] = React.useState<string>(
    player.displayColor
  );

  const [playerNote, setPlayerNote] = React.useState<string>(player.note);

  const [isDeadFormShown, setIsDeadFormShown] = useState(false);
  const [isEditFormShown, setIsEditFormShown] = useState(false);

  function onConfirmedCheckboxChange(e: any) {
    setIsConfirmed(e.target.checked);
    player.isConfirmedTown = e.target.checked;
    if (e.target.checked == true) {
      player.isSuspicious = false;
      setIsSuspicious(false);
    }
    player.displayColor = calculateDisplayColor();
    setPlayerColor(calculateDisplayColor());
    //setPlayersInfo(playersInfo); // should we use this anywyas?
    console.log(playersInfo);
  }

  function onSuspiciousCheckboxChange(e: any) {
    setIsSuspicious(e.target.checked);
    player.isSuspicious = e.target.checked;
    if (e.target.checked == true) {
      player.isConfirmedTown = false;
      setIsConfirmed(false);
    }
    player.displayColor = calculateDisplayColor();
    setPlayerColor(calculateDisplayColor());
    //setPlayersInfo(playersInfo); // should we use this anywyas?
    console.log(playersInfo);
  }

  function onNoteChange(e: any) {
    player.note = e.target.value;
    setPlayerNote(e.target.value);
  }

  function calculateDisplayColor() {
    if (player.faction != Faction.Unknown && player.faction != Faction.Town) {
      return roleToColor(player.role);
    } else if (player.isConfirmedTown) {
      return COLOR.CONFIRMED_TOWN;
    } else if (player.isSuspicious || player.isPossiblySuspicious) {
      return COLOR.SUSPICIOUS;
    } else {
      return COLOR.UNKNOWN;
    }
  }

  function onDeadButtonClick() {
    setIsDeadFormShown(true);
  }

  function onSetRoleButtonClick() {
    setIsEditFormShown(true);
  }

  return (
    <>
      {isDeadFormShown && (
        <DeadForm
          setIsDeadFormShown={setIsDeadFormShown}
          playersInfo={playersInfo}
          setPlayersInfo={setPlayersInfo}
          playerNumber={playerNumber}
          setNotepadUpdater={setNotepadUpdater}
        />
      )}
      {isEditFormShown && (
        <EditForm
          setIsEditFormShown={setIsEditFormShown}
          playersInfo={playersInfo}
          setPlayersInfo={setPlayersInfo}
          playerNumber={playerNumber}
          setNotepadUpdater={setNotepadUpdater}
        />
      )}
      <div className="notepad-player-card-container">
        <div
          className="notepad-card-section-number"
          style={{ backgroundColor: player.displayColor }}
        >
          {player.number}
        </div>
        {player.isDead ? (
          <div
            className="notepad-card-section-button"
            onClick={onDeadButtonClick}
          >
            SET ROLE
          </div>
        ) : (
          <div
            className="notepad-card-section-button"
            onClick={onSetRoleButtonClick}
          >
            SET ROLE
          </div>
        )}

        <div className="notepad-card-section-confirmed">
          {player.isConfirmationLocked ? (
            <input
              type="checkbox"
              checked={player.isConfirmedTown}
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
        <div
          className="notepad-card-section-faction"
          style={{ backgroundColor: player.displayColor }}
        >
          {getFactionDisplayString(player.faction)}
        </div>
        <div
          className="notepad-card-section-alignment"
          style={{ backgroundColor: player.displayColor }}
        >
          {getTownAlignmentDisplayString(player.townAlignment)}
        </div>
        <div
          className="notepad-card-section-role"
          style={{ backgroundColor: player.displayColor }}
        >
          {getRoleDisplayString(player.role)}
        </div>
        <div className="notepad-card-section-suspicious">
          {player.isSuspicionLocked ? (
            <input
              type="checkbox"
              checked={player.isSuspicious}
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
        <div className="notepad-card-section-note">
          <input
            className="input-note"
            type="text"
            value={player.note}
            onChange={onNoteChange}
          ></input>
        </div>
        {player.isDead ? (
          <div className="notepad-card-section-dead-button">
            (<span style={{ fontWeight: 'bold' }}>{player.number}</span>)
          </div>
        ) : (
          <div
            className="notepad-card-section-dead-button"
            onClick={onDeadButtonClick}
          >
            DEAD (<span style={{ fontWeight: 'bold' }}>{player.number}</span>)
          </div>
        )}
      </div>
    </>
  );
}

function HeaderAlive() {
  return (
    <>
      <div className="header-flexbox">
        <div className="header-number">ALIVE</div>
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

function HeaderDead() {
  return (
    <>
      <div className="header-flexbox">
        <div className="header-number">DEAD</div>
      </div>
    </>
  );
}

function Sidenotes({
  gameNote,
  setGameNote,
}: {
  gameNote: string;
  setGameNote: any;
}) {
  function onNoteChange(e: any) {
    gameNote = e.target.value;
    setGameNote(e.target.value);
  }

  return (
    <>
      <div className="game-note">
        <input
          className="input-note"
          type="text"
          value={gameNote}
          onChange={onNoteChange}
        ></input>
      </div>
    </>
  );
}
