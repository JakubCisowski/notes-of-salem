import { useState } from 'react';
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
  const [selectedRole, setSelectedRole] = useState<Role>();

  function handleConfirmOnClick() {
    if (selectedRole === undefined) return;
    setIsDeadFormShown(false);
    markPlayerAsDead(
      playersInfo,
      setPlayersInfo,
      playerNumber,
      selectedRole!,
      setMajority
    );
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  function handleCancelOnClick() {
    setIsDeadFormShown(false); // Close this form
  }

  return (
    <>
      <div className="deadform-container">
        <h1 className="form-text"> What was ({playerNumber})&#39s role? </h1>

        <RoleButtonsGrid
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />

        <br></br>

        <button
          className="button-action button-action-left"
          onClick={handleConfirmOnClick}
        >
          CONFIRM ✅
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
  selectedRole,
  setSelectedRole,
}: {
  role: Role;
  selectedRole: Role | undefined;
  setSelectedRole: (value: Role) => void;
}) {
  const roleName = getRoleDisplayString(role);
  const roleColor = roleToTextColor(role);

  function handleOnClick() {
    setSelectedRole(role);
  }

  return (
    <>
      {selectedRole == role && (
        <div
          className="button-role"
          style={{
            color: roleColor,
            backgroundColor: COLOR.BUTTON_BACKGROUND_SELECTED,
            border: '3px solid black',
          }}
          onClick={handleOnClick}
        >
          {roleName}
        </div>
      )}
      {selectedRole != role && (
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
      )}
    </>
  );
}

function RoleButtonsGrid({
  selectedRole,
  setSelectedRole,
}: {
  selectedRole: Role | undefined;
  setSelectedRole: (value: Role) => void;
}) {
  return (
    <>
      {/* Grid area: row start / column start / row end (+1) / column end (+1)  */}
      <div className="grid-container-start">
        <div className="grid-item" style={{ gridArea: '1/1/2/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Jailor}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/3/2/4' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Godfather}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/4/2/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Mafioso}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '1/5/2/6' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Witch}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/1/3/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Lookout}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/2/3/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Spy}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/3/3/4' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Consigliere}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/4/3/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Consort}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '2/5/3/6' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Executioner}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/1/4/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Investigator}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/2/4/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Sheriff}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/3/4/4' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Janitor}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/4/4/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Forger}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/5/4/6' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Jester}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/1/5/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Bodyguard}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/2/6/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Doctor}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/3/5/4' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Framer}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/4/5/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Disguiser}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/1/6/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Veteran}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/2/6/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Vigilante}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/3/6/4' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Blackmailer}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '5/4/6/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Hypnotist}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/1/7/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Escort}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/2/7/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Transporter}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/3/7/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Ambusher}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '7/1/8/2' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Medium}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '7/2/8/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Retributionist}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '8/1/9/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Mayor}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '9/1/10/3' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.Cleaned}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '9/3/10/5' }}>
          <RoleButton
            selectedRole={selectedRole}
            role={Role.ProbablyForged}
            setSelectedRole={setSelectedRole}
          />
        </div>
      </div>
    </>
  );
}
