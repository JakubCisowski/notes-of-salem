import { COLOR } from '../utils/color';
import { Faction, Role, TownAlignment } from '../utils/enums';
import {
  factionToTextColor,
  roleToTextColor,
  townAlignmentToTextColor,
} from '../utils/infoHelper';
import { editPlayerInfo, PlayersInfo } from '../utils/playerInfo';

export const EditForm = ({
  setIsEditFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  setIsEditFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) => {
  function handleClearOnClick() {
    setIsEditFormShown(false);
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      undefined,
      undefined,
      undefined,
      setMajority
    );
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  function handleCancelOnClick() {
    setIsEditFormShown(false); // Close this form
  }

  return (
    <>
      <div className="editform-container">
        <h1>What is ({playerNumber})&#39s role? </h1>

        <ButtonsGrid
          setIsEditFormShown={setIsEditFormShown}
          playersInfo={playersInfo}
          setPlayersInfo={setPlayersInfo}
          playerNumber={playerNumber}
          setNotepadUpdater={setNotepadUpdater}
          setMajority={setMajority}
        />

        <button
          className="button-action button-action-left"
          onClick={handleClearOnClick}
        >
          CLEAR ➖
        </button>
        <button
          className="button-action button-action-right"
          onClick={handleCancelOnClick}
        >
          CANCEL ❌
        </button>
      </div>
    </>
  );
};

export function RoleButton({
  role,
  setIsEditFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  role: Role;
  setIsEditFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  let roleName = Role[role];
  let roleColor = roleToTextColor(role);

  function handleOnClick() {
    setIsEditFormShown(false);
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      role,
      undefined,
      undefined,
      setMajority
    );
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  return (
    <>
      <div
        className="button-role"
        style={{
          color: roleColor,
          backgroundColor: COLOR.BUTTON_BACKGROUND,
          border: '1px solid black',
        }}
        onClick={handleOnClick}
      >
        {roleName}
      </div>
    </>
  );
}

export function AlignmentButton({
  alignment,
  setIsEditFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  alignment: TownAlignment;
  setIsEditFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  let alignmentName = TownAlignment[alignment];
  let alignmentColor = townAlignmentToTextColor(alignment);

  function handleOnClick() {
    setIsEditFormShown(false);
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      undefined,
      alignment,
      undefined,
      setMajority
    );
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  return (
    <>
      <div
        className="button-role"
        style={{
          color: alignmentColor,
          backgroundColor: COLOR.BUTTON_BACKGROUND,
          border: '1px solid black',
        }}
        onClick={handleOnClick}
      >
        {alignmentName}
      </div>
    </>
  );
}

export function FactionButton({
  faction,
  setIsEditFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  faction: Faction;
  setIsEditFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  let factionName = Faction[faction];
  let factionColor = factionToTextColor(faction);

  function handleOnClick() {
    setIsEditFormShown(false);
    editPlayerInfo(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      undefined,
      undefined,
      faction,
      setMajority
    );
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  return (
    <>
      <div
        className="button-role"
        style={{
          color: factionColor,
          backgroundColor: COLOR.BUTTON_BACKGROUND,
          border: '1px solid black',
        }}
        onClick={handleOnClick}
      >
        {factionName}
      </div>
    </>
  );
}

function ButtonsGrid({
  setIsEditFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  setIsEditFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  return (
    <>
      {/* Grid area: row start / column start / row end (+1) / column end (+1)  */}
      <div className="grid-container-edit">
        <div className="grid-item" style={{ gridArea: '1/1/2/3' }}>
          <RoleButton
            role={Role.Jailor}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/3/2/4' }}>
          <RoleButton
            role={Role.Godfather}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/4/2/5' }}>
          <RoleButton
            role={Role.Mafioso}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/5/2/6' }}>
          <RoleButton
            role={Role.Witch}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/1/3/2' }}>
          <RoleButton
            role={Role.Lookout}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/2/3/3' }}>
          <RoleButton
            role={Role.Spy}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/3/3/4' }}>
          <RoleButton
            role={Role.Consigliere}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/4/3/5' }}>
          <RoleButton
            role={Role.Consort}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/5/3/6' }}>
          <RoleButton
            role={Role.Executioner}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/1/4/2' }}>
          <RoleButton
            role={Role.Investigator}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/2/4/3' }}>
          <RoleButton
            role={Role.Sheriff}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/3/4/4' }}>
          <RoleButton
            role={Role.Janitor}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/4/4/5' }}>
          <RoleButton
            role={Role.Forger}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>

        <div className="grid-item" style={{ gridArea: '3/5/4/6' }}>
          <RoleButton
            role={Role.Jester}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/1/5/2' }}>
          <RoleButton
            role={Role.Bodyguard}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/2/5/3' }}>
          <RoleButton
            role={Role.Doctor}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/3/5/4' }}>
          <RoleButton
            role={Role.Framer}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/4/5/5' }}>
          <RoleButton
            role={Role.Disguiser}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/1/6/2' }}>
          <RoleButton
            role={Role.Veteran}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/2/6/3' }}>
          <RoleButton
            role={Role.Vigilante}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/3/6/4' }}>
          <RoleButton
            role={Role.Blackmailer}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/4/6/5' }}>
          <RoleButton
            role={Role.Hypnotist}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/1/7/2' }}>
          <RoleButton
            role={Role.Escort}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/2/7/3' }}>
          <RoleButton
            role={Role.Transporter}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/3/7/5' }}>
          <RoleButton
            role={Role.Ambusher}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '7/1/8/2' }}>
          <RoleButton
            role={Role.Medium}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '7/2/8/3' }}>
          <RoleButton
            role={Role.Retributionist}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '8/1/9/3' }}>
          <RoleButton
            role={Role.Mayor}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '10/1/11/2' }}>
          <AlignmentButton
            alignment={TownAlignment.TI}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '10/2/11/3' }}>
          <AlignmentButton
            alignment={TownAlignment.TS}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '10/3/11/5' }}>
          <FactionButton
            faction={Faction.Mafia}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '10/5/11/6' }}>
          <FactionButton
            faction={Faction.NeutralEvil}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '11/1/12/2' }}>
          <AlignmentButton
            alignment={TownAlignment.TK}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '11/2/12/3' }}>
          <AlignmentButton
            alignment={TownAlignment.TP}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '11/3/12/6' }}>
          <FactionButton
            faction={Faction.NotTown}
            setIsEditFormShown={setIsEditFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
      </div>
    </>
  );
}
