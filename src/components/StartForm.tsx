import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { COLOR } from '../utils/color';
import { Faction, Role } from '../utils/enums';
import { roleToFaction, roleToTextColor } from '../utils/infoHelper';
import {
  generateDefaultPlayersInfo,
  PlayersInfo,
  setupExecutionerTarget,
  setupUserMafiaNumbers,
} from '../utils/playerInfo';

export const StartForm = ({
  setIsStartFormShown,
  setIsNotepadShown,
  setPlayersInfo: setPlayerInfo,
  setGameNote,
  setGameMajority,
}: {
  setIsStartFormShown: (value: boolean) => void;
  setIsNotepadShown: (value: boolean) => void;
  setPlayersInfo: (value: PlayersInfo) => void;
  setGameNote: any;
  setGameMajority: (value: { town: number; notTown: number }) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [selectedUserNumber, setSelectedUserNumber] = useState<number>(-1);
  const [selectedExeTargetNumber, setSelectedExeTargetNumber] =
    useState<number>(-1);
  const [selectedMafia1Number, setSelectedMafia1Number] = useState<number>(-1);
  const [selectedMafia2Number, setSelectedMafia2Number] = useState<number>(-1);
  const [selectedMafia3Number, setSelectedMafia3Number] = useState<number>(-1);

  function handleConfirmOnClick() {
    if (isSelectionValid()) {
      setIsStartFormShown(false);
      let newPlayerInfo = generateDefaultPlayersInfo(
        selectedUserNumber,
        selectedRole!
      );
      if (selectedRole == Role.Executioner) {
        setupExecutionerTarget(newPlayerInfo, selectedExeTargetNumber);
      } else if (roleToFaction(selectedRole!) == Faction.Mafia) {
        setupUserMafiaNumbers(newPlayerInfo, [
          selectedMafia1Number,
          selectedMafia2Number,
          selectedMafia3Number,
        ]);
      }
      console.log(newPlayerInfo);
      setPlayerInfo(newPlayerInfo);
      setIsNotepadShown(true);
      setGameNote('');
      setGameMajority({ town: 9, notTown: 6 });
    }
  }

  function handleCancelOnClick() {
    setIsStartFormShown(false); // Close this form
  }

  function isSelectionValid() {
    let isUserRoleSelected = selectedRole !== undefined;
    let isUserNumberSelected = selectedUserNumber !== -1;
    let isExeTargetNumberSelected = selectedExeTargetNumber !== -1;
    let isMafiaNumbersSelected =
      selectedMafia1Number !== -1 &&
      selectedMafia2Number !== -1 &&
      selectedMafia3Number !== -1;
    let isUserExe = selectedRole === Role.Executioner;
    let isUserMaf = roleToFaction(selectedRole!) == Faction.Mafia;
    let isTargetNumberUnique = selectedExeTargetNumber != selectedUserNumber;
    let isEveryMafiaNumberUnique =
      selectedUserNumber != selectedMafia1Number &&
      selectedUserNumber != selectedMafia2Number &&
      selectedUserNumber != selectedMafia3Number &&
      selectedMafia1Number != selectedMafia2Number &&
      selectedMafia1Number != selectedMafia3Number &&
      selectedMafia2Number != selectedMafia3Number;

    if (!isUserRoleSelected) {
      showError('Please select your ROLE by clicking on its name!');
      return false;
    }
    if (!isUserNumberSelected) {
      showError('Please select your NUMBER!');
      return false;
    }
    if (isUserExe && !isExeTargetNumberSelected) {
      showError('Please select your EXE TARGET NUMBER!');
      return false;
    }
    if (isUserMaf && !isMafiaNumbersSelected) {
      showError('Please select OTHER MAFIA NUMBERS!');
      return false;
    }
    if (isUserExe && !isTargetNumberUnique) {
      showError(
        'Your number and your execution target number cannot be IDENTICAL!'
      );
      return false;
    }
    if (isUserMaf && !isEveryMafiaNumberUnique) {
      showError('Your number and other mafia numbers cannot be IDENTICAL!');
      return false;
    }

    return true;
  }

  const showError = (text: string) =>
    toast.error(text, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />

      <div className="startform-container">
        <h1> 1. Select your role: </h1>

        <RoleButtonsGrid setSelectedRole={setSelectedRole} />

        <h1>{Role[selectedRole!]} </h1>

        {selectedRole != undefined && (
          <>
            <h2> 2. Select YOUR number: {selectedUserNumber}</h2>
            <NumberSelection setReference={setSelectedUserNumber} />
          </>
        )}

        {selectedRole == Role.Executioner && selectedUserNumber != -1 && (
          <>
            <h2>
              3. Select your EXECUTION TARGET number: {selectedExeTargetNumber}
            </h2>
            <NumberSelection setReference={setSelectedExeTargetNumber} />
          </>
        )}

        {roleToFaction(selectedRole!) == Faction.Mafia &&
          selectedUserNumber != -1 && (
            <>
              <h2>
                3. Select OTHER MAFIA numbers: {selectedMafia1Number} /{' '}
                {selectedMafia2Number} / {selectedMafia3Number}
              </h2>
              <NumberSelection setReference={setSelectedMafia1Number} />
              <NumberSelection setReference={setSelectedMafia2Number} />
              <NumberSelection setReference={setSelectedMafia3Number} />
            </>
          )}

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
  let roleColor = roleToTextColor(role);

  function handleOnClick() {
    setSelectedRole(role);
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

function NumberSelection({
  setReference,
}: {
  setReference: (value: number) => void;
}) {
  const [value, setValue] = useState('-1');

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setReference(e.target.value);
  };

  return (
    <>
      <select
        id="numbers"
        name="numbers"
        className="select-number"
        value={value}
        onChange={handleChange}
      >
        <option value="-1">SELECT</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
      </select>
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
      </div>
    </>
  );
}
