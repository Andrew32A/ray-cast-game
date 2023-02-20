// import { NavLink } from 'react-router-dom'
import './Title.css';
import React from 'react';

function Title() {
    return (
        <div className="Title">
        <header>
            <h1>Ray Cast Demo</h1>
            <div className="Title-Subtitle"></div>

            <div>
                {/* <NavLink 
                    className={({ isActive }) => isActive ? "nav-link-active" : "nav-link" }
                    to="/">List</NavLink>
                <NavLink 
                    className={({ isActive }) => isActive ? "nav-link-active" : "nav-link" }
                    to="/about">About</NavLink>
                <RandomSpace /> */}
            </div>

        </header>
        </div>
    )
}
  
export default Title