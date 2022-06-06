import React from 'react';

const GameInforShort = ({ title, desc, minplayers, maxplayers }) => {

    return (
        <div className='game-info-container'>
                <h3>{ title }</h3>
                <p>{ desc }</p>
                <p>Players: { minplayers }-{ maxplayers } </p>
        </div>
    );
}   

export default GameInforShort
