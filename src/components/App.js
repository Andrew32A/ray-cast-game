import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Title from './Title/Title';

function loadGame() {
  setTimeout(() => {
    window.location = "/ray-cast-game/game.html";
  }, 500);
}

function App() {  
  return (
    <div className="menuWrapper">
      <header className="menuHeader">
          <Title />
          <ul>
            {/* directly linked the game, BE SURE TO CHANGE IF SITE IS MOVED */}
            <li><div className='btn-one'><p className='startButton option' onClick={loadGame}>Start</p></div></li>
            <li><div className='btn-one'><Link to="/Sandbox" className='option'>Sandbox (not yet linked)</Link></div></li>
            <li><div className='btn-one'><Link to="/HowToPlay" className='option'>How to Play</Link></div></li>
            <li><div className='btn-one'><Link to="https://github.com/Andrew32A/ray-cast-game" className='option'>Repo</Link></div></li>
          </ul>
      </header>
    </div>
  );
}

export default App;


