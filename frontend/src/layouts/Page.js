import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ContactPage from '../pages/ContactPage';
import AdminPage from '../pages/AdminPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import GamesPage from '../pages/GamesPage';
import RoomList from '../components/RoomList';
import RoomPage from '../pages/RoomPage';

const Page = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/roomlist" component={RoomList} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/gamelist" component={GamesPage} />
        <Route path="/room" component={RoomPage} />
        <Route component={ErrorPage} />
      </Switch>
    </>
  );
}

export default Page;