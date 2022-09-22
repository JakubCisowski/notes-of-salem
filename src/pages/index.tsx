import type { NextPage } from 'next';
import { useState } from 'react';
import { FormNewGame } from '../components/forms/FormNewGame';
import { GameNotepad } from '../components/GameNotepad';
import styles from '../styles/Index.module.css';
import { PlayersInfo } from '../utils/types/PlayersInfo';

const Home: NextPage = () => {
  const [playersInfo, setPlayersInfo] = useState<PlayersInfo>([]);
  const [gameNote, setGameNote] = useState('');
  const [gameMajority, setGameMajority] = useState({ town: 9, notTown: 6 });
  const [isNotepadShown, setIsNotepadShown] = useState(false); // to not initially show the notes
  const [isNewGameFormShown, setIsNewGameFormShown] = useState(false);

  function handleNewGameOnClick() {
    setIsNewGameFormShown(true);
  }

  return (
    <>
      <button className={styles['button-new']} onClick={handleNewGameOnClick}>
        New game 📋
      </button>

      {/* Component with all info */}
      {isNewGameFormShown && (
        <div className="disable-outside-clicks">
          <FormNewGame
            setIsNewGameFormShown={setIsNewGameFormShown}
            setIsNotepadShown={setIsNotepadShown}
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            setGameNote={setGameNote}
            setGameMajority={setGameMajority}
          />
        </div>
      )}

      {isNotepadShown && (
        <>
          <GameNotepad
            playersInfo={playersInfo}
            setPlayersInfo={setPlayersInfo}
            gameNote={gameNote}
            setGameNote={setGameNote}
            majority={gameMajority}
            setMajority={setGameMajority}
          />
        </>
      )}
    </>
  );
};

export default Home;
