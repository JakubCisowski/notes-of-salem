import { COLOR } from '../utils/color';
import { Role } from '../utils/enums';
import { getRoleDisplayString, roleToTextColor } from '../utils/infoHelper';
import { markPlayerAsDead, PlayersInfo } from '../utils/playerInfo';

export const DeadForm = ({
  setIsDeadFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  setIsDeadFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) => {
  function handleCancelOnClick() {
    setIsDeadFormShown(false); // Close this form
  }

  return (
    <>
      <div className="deadform-container">
        <h1 className="form-text">💀 What was ({playerNumber}) role? 💀</h1>

        <RoleButtonsGrid
          setIsDeadFormShown={setIsDeadFormShown}
          playersInfo={playersInfo}
          setPlayersInfo={setPlayersInfo}
          playerNumber={playerNumber}
          setNotepadUpdater={setNotepadUpdater}
          setMajority={setMajority}
        />

        <br></br>

        {/* <button
          className="button-action button-action-left"
          onClick={handleConfirmOnClick}
        >
          CONFIRM ✅
        </button> */}
        <button
          className="button-action button-action-center"
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
  setIsDeadFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  role: Role;
  setIsDeadFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  const roleName = getRoleDisplayString(role);
  const roleColor = roleToTextColor(role);

  function handleOnClick() {
    setIsDeadFormShown(false);
    markPlayerAsDead(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      role,
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
          backgroundColor: COLOR.BACKGROUND_BUTTON,
          border: '1px solid black',
        }}
        onClick={handleOnClick}
      >
        {roleName}
      </div>
    </>
  );
}

function RoleButtonsGrid({
  setIsDeadFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
  setMajority,
}: {
  setIsDeadFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
  setMajority: any;
}) {
  return (
    <>
      {/* Grid area: row start / column start / row end (+1) / column end (+1)  */}
      <div className="grid-container-start">
        <div className="grid-item" style={{ gridArea: '1/1/2/3' }}>
          <RoleButton
            role={Role.Jailor}
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/2/6/3' }}>
          <RoleButton
            role={Role.Doctor}
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
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
            setIsDeadFormShown={setIsDeadFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '9/1/10/3' }}>
          <RoleButton
            role={Role.Cleaned}
            setIsDeadFormShown={setIsDeadFormShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            playerNumber={playerNumber}
            setNotepadUpdater={setNotepadUpdater}
            setMajority={setMajority}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '9/3/10/5' }}>
          <RoleButton
            role={Role.ProbablyForged}
            setIsDeadFormShown={setIsDeadFormShown}
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
