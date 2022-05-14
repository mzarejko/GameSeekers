import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductListPage.css';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

const users = ["Misaru", "Adamom", "MagisterYoda"];

const ProductListPage = () => {

  const list = users.map(user => (
    <li key={user}>
      <p>{user}</p>
    </li>
  ))

  return (
    <div className="products">

      <h2>Pokój: SzaloneRPG</h2>
      <div>
        <h3>Lista zapisanych graczy</h3>
        <ul>
          {list}
        </ul>
      </div>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.7572796506297!2d17.05352921575559!3d51.112938279572326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fe9d465f76f6d%3A0xb8fd07f877525cf8!2sCybermachina!5e0!3m2!1spl!2spl!4v1650909097567!5m2!1spl!2spl" width="100%" height="300"  ></iframe>
    </div>

  );
}

export default ProductListPage;

