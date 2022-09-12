import React, { useState } from 'react';
import { COLOR } from '../utils/color';
import { Faction, Role, TownAlignment } from '../utils/enums';
import {
  factionToBackgroundColor,
  getFactionDisplayString,
  getRoleDisplayString,
  getTownAlignmentDisplayString,
  roleToBackgroundColor,
  townAlignmentToBackgroundColor,
} from '../utils/infoHelper';
import {
  checkAutoSuspicion,
  checkRoleAutoChange,
  markPlayerAsDead,
  PlayersInfo,
} from '../utils/playerInfo';
import { DeadForm } from './DeadForm';
import { EditForm } from './EditForm';

export function Notepad({
  playersInfo,
  setPlayersInfo,
  gameNote,
  setGameNote,
  majority,
  setMajority,
}: {
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  gameNote: string;
  setGameNote: any;
  majority: { town: number; notTown: number };
  setMajority: any;
}) {
  const [notepadUpadter, setNotepadUpdater] = useState(0); // This is a hack to force a re-render of the notepad.

  const alivePlayerCards: any[] = [];
  const deadPlayerCards: any[] = [];

  playersInfo.forEach((playerInfo) => {
    const card = (
      <PlayerCard
        playerNumber={playerInfo.number}
        playersInfo={playersInfo}
        setPlayersInfo={setPlayersInfo}
        setNotepadUpdater={setNotepadUpdater}
        setMajority={setMajority}
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
        <HeaderAlive majority={majority} />
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
        <GameNotes gameNote={gameNote} setGameNote={setGameNote} />
      </div>
    </>
  );
}

function PlayerCard({
  playerNumber,
  playersInfo,
  setPlayersInfo,
  setNotepadUpdater,
  setMajority,
}: {
  playerNumber: number;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  // Modifying player DOES modify playersInfo.
  // But shouldn't we use setPlayersInfo to modify playersInfo - rendering issues possible?
  // For example some components wont rerender when player is modified (not setPlayersInfo).
  let player = playersInfo.find((player) => player.number == playerNumber)!;

  let notePlaceholder = 'Player ' + playerNumber + ' note...';

  // These states only exist for this compononent to rerender, they are not used anywhere else.
  // todo: How to avoid that?
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(
    player.isConfirmedTown
  );
  const [isSuspicious, setIsSuspicious] = React.useState<boolean>(
    player.isSuspicious
  );

  const [playerColor, setPlayerColor] = React.useState<string>(
    player.displayColorBackground
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
    player.displayColorBackground = calculateDisplayColor();
    setPlayerColor(calculateDisplayColor());
    //setPlayersInfo(playersInfo); // should we use this anywyas?

    checkAutoSuspicion(playersInfo, setPlayersInfo);
    checkRoleAutoChange(playersInfo, setPlayersInfo, setMajority);
    setNotepadUpdater((prevState: number) => prevState + 1);
    console.log(playersInfo);
  }

  function onSuspiciousCheckboxChange(e: any) {
    setIsSuspicious(e.target.checked);
    player.isSuspicious = e.target.checked;
    if (e.target.checked == true) {
      player.isConfirmedTown = false;
      setIsConfirmed(false);
      checkAutoSuspicion(playersInfo, setPlayersInfo);
      checkRoleAutoChange(playersInfo, setPlayersInfo, setMajority);
    }
    player.displayColorBackground = calculateDisplayColor();
    setPlayerColor(calculateDisplayColor());
    //setPlayersInfo(playersInfo); // should we use this anywyas?
    setNotepadUpdater((prevState: number) => prevState + 1);
    console.log(playersInfo);
  }

  function onNoteChange(e: any) {
    player.note = e.target.value;
    setPlayerNote(e.target.value);
  }

  function calculateDisplayColor() {
    if (player.isConfirmedTown) {
      return COLOR.BACKGROUND_CONFIRMED_TOWN;
    } else if (player.isSuspicious) {
      return COLOR.BACKGROUND_SUSPICIOUS;
    } else if (player.role != Role.Unknown) {
      return roleToBackgroundColor(player.role);
    } else if (player.townAlignment != TownAlignment.Unknown) {
      return townAlignmentToBackgroundColor(player.townAlignment);
    } else if (player.faction != Faction.Unknown) {
      return factionToBackgroundColor(player.faction);
    } else {
      return COLOR.BACKGROUND_UNKNOWN;
    }
  }

  function onDeadButtonClick() {
    if (!player.isUser) {
      setIsDeadFormShown(true);
    } else {
      markPlayerAsDead(
        playersInfo,
        setPlayersInfo,
        playerNumber,
        player.role,
        setMajority
      );
      setNotepadUpdater((prevState: number) => prevState + 1);
    }
  }

  function onSetRoleButtonClick() {
    setIsEditFormShown(true);
  }

  return (
    <>
      {isDeadFormShown && (
        <div className="disable-outside-clicks">
          <DeadForm
            setIsDeadFormShown={setIsDeadFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
      )}
      {isEditFormShown && (
        <div className="disable-outside-clicks">
          <EditForm
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
      )}
      <div className="notepad-player-card-container">
        <div
          className="notepad-card-section-number"
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {player.number}
        </div>
        {player.isUser && (
          <div
            className="notepad-card-section-button"
            style={{ backgroundColor: 'white' }}
          >
            (me)
          </div>
        )}
        {player.isDead && !player.isUser && (
          <div
            className="notepad-card-section-button"
            onClick={onDeadButtonClick}
            style={{ cursor: 'pointer' }}
          >
            SET ROLE
          </div>
        )}
        {!player.isDead && !player.isUser && (
          <div
            className="notepad-card-section-button"
            onClick={onSetRoleButtonClick}
            style={{ cursor: 'pointer' }}
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
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {getFactionDisplayString(player.faction)}
        </div>
        <div
          className="notepad-card-section-alignment"
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {getTownAlignmentDisplayString(player.townAlignment)}
        </div>
        <div
          className="notepad-card-section-role"
          style={{ backgroundColor: player.displayColorBackground }}
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
        <div className="notepad-card-section-autosuspicion">
          {player.autoSuspicionSeverity == 0 && ''}
          {player.autoSuspicionSeverity == 1 && (
            <div className="serverity-moderate">
              ?
              <div className="hover-content">
                {player.autoSuspicionNotes.map((note) => {
                  return (
                    <>
                      {note}
                      {'\n'}
                    </>
                  );
                })}
              </div>
            </div>
          )}
          {player.autoSuspicionSeverity == 2 && (
            <div className="serverity-high">
              !!!
              <div className="hover-content">
                {player.autoSuspicionNotes.join('\n')}
              </div>
            </div>
          )}
        </div>
        <div className="notepad-card-section-note">
          <input
            className="input-note"
            type="text"
            value={player.note}
            onChange={onNoteChange}
            placeholder={notePlaceholder}
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
            💀<span style={{ fontWeight: 'bold' }}> {player.number}</span>
          </div>
        )}
      </div>
    </>
  );
}

function HeaderAlive({
  majority,
}: {
  majority: { town: number; notTown: number };
}) {
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
        <div className="header-majority">
          <p style={{ margin: 0 }}>
            <span style={{ color: COLOR.TEXT_CONFIRMED_TOWN }}>
              {majority.town}{' '}
            </span>
            town <span style={{ fontSize: '1.2rem' }}>vs</span>
            <span style={{ color: COLOR.BACKGROUND_MAFIA }}>
              {' '}
              {majority.notTown}
            </span>{' '}
            evil
          </p>
        </div>
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

function GameNotes({
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
          placeholder="Game notes..."
        ></input>
      </div>
    </>
  );
}
