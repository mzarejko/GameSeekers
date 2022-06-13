import React from 'react';
import { Route, Switch } from 'react-router-dom';
import "../styles/Page.css"

import HomePage from '../pages/HomePage';
import CreateRoomPage from '../pages/CreateRoomPage';
import AdminPage from '../pages/AdminPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import GamesPage from '../pages/GamesPage';
import RoomList from '../components/RoomList';
import RoomPage from '../pages/RoomPage';
import EditRoomPage from '../pages/EditRoomPage';
import CreateMeetingPage from '../pages/CreateMeeting';
import EditMeetingPage from '../pages/EditMeetingPage';
import RegisterPage from '../pages/RegisterPage';



const Page = () => {
  return (
    <div className='page-container'>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/roomlist" component={RoomList} />
        <Route path="/createroom" component={CreateRoomPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/gamelist" component={GamesPage} />
        <Route path="/room/:room_name" component={RoomPage} />
        <Route path="/editroom/:room_name" component={EditRoomPage} />
        <Route path="/createmeeting/" component={CreateMeetingPage} />
        <Route path="/editmeeting/" component={EditMeetingPage} />

        <Route component={ErrorPage} />
      </Switch>
    </div>
  );
}

export default Page;