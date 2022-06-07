import React from 'react';
import Chat from '../components/chat/Chat';

// chat_id={1} jest dla testu czy czat działa normalnie, potem będzie chyba trzeba zrobić jakieś
// querry aby wybrać odpowiedni numerek czatu w pokoju 

const HomePage = () => {

    
    return (
        <div className="home">             
            <Chat chat_id={1} />
        </div>
    );
}

export default HomePage;