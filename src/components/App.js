import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
// use hashrouter instead?
import Title from './Title/Title';

function loadGame() {
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

function App() {  
  return (
    <div className="menuWrapper">
      <header className="menuHeader">
          <Title />
          {/* ray-cast-game/ is necessary for github pages, remove it if only using npm start */}
          <Link to="game.html" className='startButton' onClick={loadGame}>Start</Link>
          <Link to="/HowToPlay">How to Play</Link>
      </header>
    </div>
  );
}

{/* <div>Sandbox</div>
<div>How to Play</div>
<div>Repo</div> */}

export default App;


