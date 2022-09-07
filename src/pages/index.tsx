import type { NextPage } from 'next';
import { useState } from 'react';
import { StartForm } from '../components/startForm';
import { PlayersInfo } from '../utils/playerInfo';

const Home: NextPage = () => {
  const [playerInfo, setPlayerInfo] = useState<PlayersInfo>([]);
  const [isNotepadShown, setIsNotepadShown] = useState(false); // to not initially show the notes
  const [isStartFormShown, setIsStartFormShown] = useState(false);
  const [isClaimsFormShown, setIsClaimsFormShown] = useState(false);

  function handleNewGameOnClick() {
    setIsStartFormShown(true);
    return null;
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
          setPlayerInfo={setPlayerInfo}
        />
      )}
    </>
  );
};

export default Home;
