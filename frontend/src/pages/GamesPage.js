import React from 'react';
import Data from '../data/gamedata.json';
import GameInforShort from '../components/GameInfoShort';

const GamesPage = () => {

    const gamelist = Data.map( data => (
        <GameInforShort {...data} />
    ))

        
    return(
        <div className='big-container'>
            { gamelist }
        </div>
    )
    

}

export default GamesPage;