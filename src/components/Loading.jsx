import React from 'react';
import Heracross from '../assets/img/Heracross.webp';
import './Loading.css';

const Loading = () => {
    const playCries = () => {
        const audio = new Audio("/sounds/Heracross.ogg");
        // Optional: stop previous sound before playing again
        audio.currentTime = 0;
        audio.play().catch(error => console.error("Audio playback failed:", error));
    };

    return (
        <div className='loading'>
            <div className='loading_heracross'>
                <button
                    className='heracross-btn'
                    onClick={playCries}
                    aria-label="Play Heracross cry"
                >
                    <img
                        src={Heracross}
                        className='heracross'
                        alt="Loading Heracross"
                    />
                </button>
            </div>
        </div>
    );
};

export default Loading;