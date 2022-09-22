import React, { useState } from 'react';
import styles from '../styles/GameNotepad.module.css';
import { checkAutoSuspicion } from '../utils/autoSuspicion';
import { COLOR } from '../utils/consts/Colors';
import { Faction, Role, TownAlignment } from '../utils/enums/enums';
import {
  factionToBackgroundColor,
  getFactionDisplayString,
  getRoleDisplayString,
  getTownAlignmentDisplayString,
  roleToBackgroundColor,
  townAlignmentToBackgroundColor,
} from '../utils/infoEnumsHelper';
import {
  checkRoleAutoChange,
  editPlayerInfo,
  markPlayerAsDead,
} from '../utils/playerInfoChange';
import { PlayersInfo } from '../utils/types/PlayersInfo';
import { FormDeadPlayer } from './forms/FormDeadPlayer';
import { FormEditInfo } from './forms/FormEditInfo';

export function GameNotepad({
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
  setGameNote: (value: string) => void;
  majority: { town: number; notTown: number };
  setMajority: (value: { town: number; notTown: number }) => void;
}) {
  const [notepadUpadter, setNotepadUpdater] = useState(0); // This is a hack to force a re-render of the notepad.

  const alivePlayerCards: JSX.Element[] = [];
  const deadPlayerCards: JSX.Element[] = [];

  playersInfo.forEach((playerInfo) => {
    const card = (
      <PlayerRow
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
      <div className={styles['container']}>
        <TableHeaderAlive majority={majority} />
        <div className={styles['notepad-alive-container']}>
          {alivePlayerCards}
        </div>
        {deadPlayerCards.length > 0 && (
          <>
            <hr className={styles['horizontal-line']}></hr>
            <TableHeaderDead />
            <div className={styles['notepad-dead-container']}>
              {deadPlayerCards}
            </div>
          </>
        )}
      </div>
      <div className={styles['sidenotes-container']}>
        <GeneralNote gameNote={gameNote} setGameNote={setGameNote} />
      </div>
    </>
  );
}

function PlayerRow({
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
  setMajority: (value: { town: number; notTown: number }) => void;
}) {
  // Modifying player DOES modify playersInfo.
  // But shouldn't we use setPlayersInfo to modify playersInfo - rendering issues possible?
  // For example some components wont rerender when player is modified (not setPlayersInfo).
  let player = playersInfo.find((player) => player.number == playerNumber)!;

  let notePlaceholder = 'Player ' + playerNumber + ' note...';

  // These states only exist for this compononent to rerender, they are not used anywhere else.
  // todo: How to avoid that? Probably use notepad counter instead of them.
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

  function onConfirmedCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsConfirmed(e.target.checked);
    player.isConfirmedTown = e.target.checked;
    if (e.target.checked == true) {
      player.isSuspicious = false;
      setIsSuspicious(false);
    }
    player.displayColorBackground = calculateDisplayColor();
    setPlayerColor(calculateDisplayColor());

    checkAutoSuspicion(playersInfo, setPlayersInfo);
    checkRoleAutoChange(playersInfo, setPlayersInfo, setMajority);
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  function onSuspiciousCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  function onNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  function resurrectPlayer() {
    player.isDead = false;
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      player.role,
      undefined,
      undefined,
      setMajority
    );

    if (player.isUser || player.isExecutionTarget) {
      player.isConfirmedTown = true;
    } else {
      player.isConfirmedTown = false;
    }
  }

  return (
    <>
      {isDeadFormShown && (
        <div className="disable-outside-clicks">
          <FormDeadPlayer
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
          <FormEditInfo
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
      )}
      <div className={styles['row-container']}>
        <div
          className={`${styles['row-section']} ${styles['row-number']}`}
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {player.number}
        </div>
        {player.isUser && (
          <div
            className={`${styles['row-section']} ${styles['row-edit-button']}`}
            style={{ backgroundColor: 'white' }}
          >
            (me)
          </div>
        )}
        {player.isDead && !player.isUser && (
          <div
            className={`${styles['row-section']} ${styles['row-edit-button']}`}
            onClick={onDeadButtonClick}
            style={{ cursor: 'pointer' }}
          >
            SET ROLE
          </div>
        )}
        {!player.isDead && !player.isUser && (
          <div
            className={`${styles['row-section']} ${styles['row-edit-button']}`}
            onClick={onSetRoleButtonClick}
            style={{ cursor: 'pointer' }}
          >
            SET ROLE
          </div>
        )}
        <div className={`${styles['row-section']} ${styles['row-confirmed']}`}>
          {player.isConfirmationLocked ? (
            <input
              type="checkbox"
              checked={player.isConfirmedTown}
              disabled
              className={styles['checkbox']}
            ></input>
          ) : (
            <input
              type="checkbox"
              checked={player.isConfirmedTown}
              onChange={onConfirmedCheckboxChange}
              className={styles['checkbox']}
            ></input>
          )}
        </div>
        <div
          className={`${styles['row-section']} ${styles['row-faction']}`}
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {getFactionDisplayString(player.faction)}
        </div>
        <div
          className={`${styles['row-section']} ${styles['row-alignment']}`}
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {getTownAlignmentDisplayString(player.townAlignment)}
        </div>
        <div
          className={`${styles['row-section']} ${styles['row-role']}`}
          style={{ backgroundColor: player.displayColorBackground }}
        >
          {getRoleDisplayString(player.role)}
        </div>
        <div className={`${styles['row-section']} ${styles['row-suspicious']}`}>
          {player.isSuspicionLocked ? (
            <input
              type="checkbox"
              checked={player.isSuspicious}
              disabled
              className={styles['checkbox']}
            ></input>
          ) : (
            <input
              type="checkbox"
              checked={player.isSuspicious}
              onChange={onSuspiciousCheckboxChange}
              className={styles['checkbox']}
            ></input>
          )}
        </div>
        <div
          className={`${styles['row-section']} ${styles['row-autosuspicion']}`}
        >
          {player.autoSuspicionSeverity == 0 && ''}
          {player.autoSuspicionSeverity == 1 && (
            <div className={styles['serverity-moderate']}>
              ?
              <div className={styles['hover-content']}>
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
            <div className={styles['serverity-high']}>
              !!!
              <div className={styles['hover-content']}>
                {player.autoSuspicionNotes.join('\n')}
              </div>
            </div>
          )}
        </div>
        <div className={`${styles['row-section']} ${styles['row-note']}`}>
          <input
            className={styles['input-note']}
            type="text"
            value={player.note}
            onChange={onNoteChange}
            placeholder={notePlaceholder}
          ></input>
        </div>
        {player.isDead ? (
          <div
            className={`${styles['row-section']} ${styles['row-dead-button']}`}
            onClick={resurrectPlayer}
          >
            <span style={{ fontWeight: 'bold' }}>💚 {player.number}</span>
          </div>
        ) : (
          <div
            className={`${styles['row-section']} ${styles['row-dead-button']}`}
            onClick={onDeadButtonClick}
          >
            💀<span style={{ fontWeight: 'bold' }}> {player.number}</span>
          </div>
        )}
      </div>
    </>
  );
}

function TableHeaderAlive({
  majority,
}: {
  majority: { town: number; notTown: number };
}) {
  return (
    <>
      <div className={styles['header-flexbox']}>
        <div className={`${styles['header-item']} ${styles['header-number']}`}>
          ALIVE
        </div>
        <div
          className={`${styles['header-item']} ${styles['header-confirmed']}`}
        >
          <p style={{ margin: 0 }}>
            CONFIRMED
            <br />
            TOWN?
          </p>
        </div>
        <div
          className={`${styles['header-item']} ${styles['header-suspicious']}`}
        >
          SUSPICIOUS?
        </div>
        <div
          className={`${styles['header-item']} ${styles['header-majority']}`}
        >
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

function TableHeaderDead() {
  return (
    <>
      <div className={styles['header-flexbox']}>
        <div className={`${styles['header-item']} ${styles['header-number']}`}>
          DEAD
        </div>
      </div>
    </>
  );
}

function GeneralNote({
  gameNote,
  setGameNote,
}: {
  gameNote: string;
  setGameNote: (value: string) => void;
}) {
  function onNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    gameNote = e.target.value;
    setGameNote(e.target.value);
  }

  return (
    <>
      <div className={styles['game-note']}>
        <input
          className={styles['input-note']}
          type="text"
          value={gameNote}
          onChange={onNoteChange}
          placeholder="Game notes..."
        ></input>
      </div>
    </>
  );
}
