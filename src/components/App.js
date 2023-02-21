import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';
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
        <Router>
          <Title />
          {/* ray-cast-game/ is necessary for github pages, remove it if only using npm start */}
          <Link to="ray-cast-game/game.html" className='startButton' onClick={loadGame}>Start</Link>
        </Router>
      </header>
    </div>
  );
}

export default App;