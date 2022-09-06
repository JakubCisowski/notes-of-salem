import type { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false); // to not initially show the notes
  const [playerInfo, setPlayerInfo] = useState([]);

  function handleOnClick() {
    return null;
  }

  return (
    <>
      <button className="button-new" onClick={handleOnClick}>
        New game
      </button>

      {/* Component with all info */}
    </>
  );
};

export default Home;
