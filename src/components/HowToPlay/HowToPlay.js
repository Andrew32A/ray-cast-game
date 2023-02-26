import React from 'react';
import "./HowToPlay.css"
import Title from '../Title/Title';

function HowToPlay() {
    return (
        <div className="HowToPlay">
            <Title />
            <section>
                <div className="rules">
                    <div className='rules-title'>How To Play</div>
                    <div className='rules-content'>
                        <ol>
                            <li>If the enemy touches the player, it’s <b className='bolded-red'>game over</b></li>
                            <li>The player can <b className='bolded-blue'>“freeze”</b> the <b className='bolded-red'>enemy</b> by looking at them</li>
                            <li>Gain points by looking away from the <b className='bolded-red'>enemy</b></li>
                        </ol>
                    </div>
                </div>
                <div className="controls">
                    <div className='controls-title'>Controls</div>
                    <div className='controls-content'>
                        <ul>
                            <li>WASD - Move</li>
                            <li>Mouse - Camera angle</li>
                            <li>Q - Toggle minimap</li>
                        </ul>
                    </div>

                </div>
            </section>
        </div>
    )
}
  
export default HowToPlay