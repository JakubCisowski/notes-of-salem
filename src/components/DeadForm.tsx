import { useState } from 'react';
import { Role } from '../utils/enums';
import { roleToColor } from '../utils/infoHelper';
import { markPlayerAsDead, PlayersInfo } from '../utils/playerInfo';

export const DeadForm = ({
  setIsDeadFormShown,
  playersInfo,
  setPlayersInfo,
  playerNumber,
  setNotepadUpdater,
}: {
  setIsDeadFormShown: (value: boolean) => void;
  playersInfo: PlayersInfo;
  setPlayersInfo: (value: PlayersInfo) => void;
  playerNumber: number;
  setNotepadUpdater: any;
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>();

  function handleConfirmOnClick() {
    if (selectedRole === undefined) return;
    setIsDeadFormShown(false);
    markPlayerAsDead(playersInfo, setPlayersInfo, playerNumber, selectedRole!);
    setNotepadUpdater((prevState: number) => prevState + 1);
  }

  function handleCancelOnClick() {
    setIsDeadFormShown(false); // Close this form
  }

  return (
    <>
      <div className="startform-container">
        <h1> What was ({playerNumber})'s role? </h1>

        <RoleButtonsGrid setSelectedRole={setSelectedRole} />

        <h1>{Role[selectedRole!]} </h1>

        <br></br>

        <button className="button-action" onClick={handleConfirmOnClick}>
          CONFIRM
        </button>
        <button className="button-action" onClick={handleCancelOnClick}>
          CANCEL
        </button>
      </div>
    </>
  );
};

export function RoleButton({
  role,
  setSelectedRole,
}: {
  role: Role;
  setSelectedRole: (value: Role) => void;
}) {
  let roleName = Role[role];
  let roleColor = roleToColor(role);
  let borderColor = 'lightgray';

  function handleOnClick() {
    setSelectedRole(role);
    borderColor = 'black';
  }

  return (
    <>
      <div
        className="button-role"
        style={{
          color: roleColor,
          borderColor: borderColor,
          borderStyle: 'solid',
          borderWidth: '2px',
        }}
        onClick={handleOnClick}
      >
        {roleName}
      </div>
    </>
  );
}

function RoleButtonsGrid({
  setSelectedRole,
}: {
  setSelectedRole: (value: Role) => void;
}) {
  return (
    <>
      {/* Grid area: row start / column start / row end (+1) / column end (+1)  */}
      <div className="grid-container-start">
        <div className="grid-item" style={{ gridArea: '1/1/2/3' }}>
          TOWN
        </div>
        <div className="grid-item" style={{ gridArea: '1/3/2/5' }}>
          MAFIA
        </div>
        <div className="grid-item" style={{ gridArea: '1/5/2/6' }}>
          NEUTRAL
        </div>
        <div className="grid-item" style={{ gridArea: '2/1/3/3' }}>
          <RoleButton role={Role.Jailor} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '2/3/3/4' }}>
          <RoleButton role={Role.Godfather} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '2/4/3/5' }}>
          <RoleButton role={Role.Mafioso} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '2/5/3/6' }}>
          <RoleButton role={Role.Witch} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '3/1/4/2' }}>
          <RoleButton role={Role.Lookout} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '3/2/4/3' }}>
          <RoleButton role={Role.Spy} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '3/3/4/4' }}>
          <RoleButton
            role={Role.Consigliere}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '3/4/4/5' }}>
          <RoleButton role={Role.Consort} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '3/5/4/6' }}>
          <RoleButton
            role={Role.Executioner}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/1/5/2' }}>
          <RoleButton
            role={Role.Investigator}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '4/2/5/3' }}>
          <RoleButton role={Role.Sheriff} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '4/3/5/4' }}>
          <RoleButton role={Role.Janitor} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '4/4/5/5' }}>
          <RoleButton role={Role.Forger} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '4/5/5/6' }}>
          <RoleButton role={Role.Jester} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '5/1/6/2' }}>
          <RoleButton role={Role.Bodyguard} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '5/2/6/3' }}>
          <RoleButton role={Role.Doctor} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '5/3/6/4' }}>
          <RoleButton role={Role.Framer} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '5/4/6/5' }}>
          <RoleButton role={Role.Disguiser} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '6/1/7/2' }}>
          <RoleButton role={Role.Veteran} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '6/2/7/3' }}>
          <RoleButton role={Role.Vigilante} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '6/3/7/4' }}>
          <RoleButton
            role={Role.Blackmailer}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '6/4/7/5' }}>
          <RoleButton role={Role.Hypnotist} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '7/1/8/2' }}>
          <RoleButton role={Role.Escort} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '7/2/8/3' }}>
          <RoleButton
            role={Role.Transporter}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '7/3/8/5' }}>
          <RoleButton role={Role.Ambusher} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '8/1/9/2' }}>
          <RoleButton role={Role.Medium} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '8/2/9/3' }}>
          <RoleButton
            role={Role.Retributionist}
            setSelectedRole={setSelectedRole}
          />
        </div>
        <div className="grid-item" style={{ gridArea: '9/1/10/3' }}>
          <RoleButton role={Role.Mayor} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '10/1/11/3' }}>
          <RoleButton role={Role.Cleaned} setSelectedRole={setSelectedRole} />
        </div>
        <div className="grid-item" style={{ gridArea: '10/3/11/5' }}>
          <RoleButton
            role={Role.ProbablyForged}
            setSelectedRole={setSelectedRole}
          />
        </div>
      </div>
    </>
  );
}
