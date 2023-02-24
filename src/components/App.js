import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
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
          <ul>
            {/* directly linked the game, BE SURE TO CHANGE IF SITE IS MOVED */}
            <li><Link to="game.html" className='startButton' onClick={loadGame}>Start</Link></li>
            <li><Link to="/Sandbox">Sandbox (not yet linked)</Link></li>
            <li><Link to="/HowToPlay">How to Play</Link></li>
            <li><Link to="https://github.com/Andrew32A/ray-cast-game">Repo</Link></li>
          </ul>
      </header>
    </div>
  );
}

{/* <div>Sandbox</div>
<div>How to Play</div>
<div>Repo</div> */}

export default App;


