import type { NextPage } from 'next';
import { useState } from 'react';
import { Notepad } from '../components/Notepad';
import { StartForm } from '../components/StartForm';
import { PlayersInfo } from '../utils/playerInfo';

const Home: NextPage = () => {
  const [playersInfo, setPlayersInfo] = useState<PlayersInfo>([]);
  const [isNotepadShown, setIsNotepadShown] = useState(false); // to not initially show the notes
  const [isStartFormShown, setIsStartFormShown] = useState(false);
  const [isClaimsFormShown, setIsClaimsFormShown] = useState(false);

  function handleNewGameOnClick() {
    setIsStartFormShown(true);
  }

  return (
    <>
      <button className="button-new" onClick={handleNewGameOnClick}>
        New game
      </button>

      {/* Component with all info */}
      {isStartFormShown && (
        <StartForm
          setIsStartFormShown={setIsStartFormShown}
          setIsNotepadShown={setIsNotepadShown}
          setPlayersInfo={setPlayersInfo}
        />
      )}

      {isNotepadShown && (
        <>
          <Notepad playersInfo={playersInfo} setPlayersInfo={setPlayersInfo} />
        </>
      )}
    </>
  );
};

export default Home;
