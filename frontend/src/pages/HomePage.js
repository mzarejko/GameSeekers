import React from 'react';
import Article from '../components/Article';
import Chat from '../components/chat/Chat';


// chat_id={1} jest dla testu czy czat działa normalnie, potem będzie chyba trzeba zrobić jakieś
// querry aby wybrać odpowiedni numerek czatu w pokoju 

const articles = [
    {
        id: 1,
        title: "Czym jest teoria strun",
        author: "Jan Nowak",
        text: "1111Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque amet, vitae consequatur exercitationem ratione voluptatibus repudiandae alias deleniti culpa illo suscipit quia sint temporibus illum commodi itaque ea ab ipsum?"
    },
    {
        id: 2,
        title: "Czym jest paradoks fermiego?",
        author: "Ania Kwiatkowska",
        text: "2222Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cumque accusantium sapiente perspiciatis id ipsam necessitatibus recusandae unde dolores error sunt officiis ad, voluptatum veniam, blanditiis nam in totam esse."
    },
    {
        id: 3,
        title: "Ciemna materia i ciemna energia?",
        author: "Jan Kowalski",
        text: "4444Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cumque accusantium sapiente perspiciatis id ipsam necessitatibus recusandae unde dolores error sunt officiis ad, voluptatum veniam, blanditiis nam in totam esse."
    }
]

const HomePage = () => {

    const artList = articles.map(article => (
        <Article key={article.id} {...article} />
    ))
    return (
        <div className="home">
            {artList}
            <Chat chat_id={1} />
        </div>
    );
}

export default HomePage;
