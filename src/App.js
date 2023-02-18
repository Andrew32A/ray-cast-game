import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';

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
          <Link to="/game.html" className='startButton' onClick={loadGame}>Start</Link>
        </Router>
      </header>
    </div>
  );
}

export default App;
