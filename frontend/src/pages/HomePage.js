import React from 'react';
import Chat from '../components/chat/Chat';
import '../styles/HomePage.css'

// chat_id={1} jest dla testu czy czat działa normalnie, potem będzie chyba trzeba zrobić jakieś
// querry aby wybrać odpowiedni numerek czatu w pokoju 

const HomePage = () => {

    
    return (
        <div className="home">
            <h1 className='home-page-title'>Witaj w GameSeekers</h1>
            <p className='description'></p>             
            <div className='panel'>
                <div className='panel-left-side text-panel  img11'><div>
                    <p className='panel-title'>Gracze zbierzcie się</p>
                    <p className='panel-info'>Ciężko Ci znaleźć ekipę do gier planszowych? Z naszą aplikacją to już przeszłość! Dołącz do istniejących grup lub stwórz własną i poznaj nowe osoby!</p>
                </div></div>
                <div className='panel-right-side img1' ></div>
            </div>
            <div className='panel2'>
                <div className='panel2-left-side img2'></div>
                <div className='panel2-right-side text-panel img22' ><div>
                    <p className='panel-title'>Organizuj spotkania</p>
                    <p className='panel-info'>Nasza aplikacja pomaga w zarządzaniu spotkaniami w twoich ulubionych grach.</p>
                </div></div>
            </div>
            <div className='panel'>
                <div className='panel-left-side text-panel img33'><div>
                    <p className='panel-title'>Rozmawiaj z przyjaciółmi</p>
                    <p className='panel-info'>Z naszym dedykowanym chatem będziesz mógł komunikować się z resztą grupy. Dopracuj szczegóły spotkania, pochwal się znajomością gier, napisz o bzdetach. Po prostu pisz co chcesz!</p>
                </div></div>
                <div className='panel-right-side img3' ></div>
            </div>
        </div>
    );
}

export default HomePage;