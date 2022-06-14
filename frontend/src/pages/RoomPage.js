import React from 'react';

import RoomNormal from '../components/RoomNormal';
import RoomAdmin from '../components/RoomAdmin';
import RoomFull from '../components/RoomFull';
import RoomJoin from '../components/RoomJoin';


class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      room_name: this.props.location.state.rm,
      maxsize: this.props.location.state.ms,
      members: this.props.location.state.mm,
      admin: this.props.location.state.ad,
      available: this.props.location.state.av,
      currentUser: localStorage.getItem('currentUser'),
      status: false,
      game_name: this.props.location.game_name
    }
  }
    componentDidMount(){
      this.state.members.map((user) => { if (user.username == this.state.currentUser) { this.setState({status: true}) } }
    
    )
    }

  
  render() {
      if (this.state.status == true && this.state.currentUser != this.state.admin) {return (
        <RoomNormal
          room_name={this.state.room_name}
          maxsize={this.state.maxsize}
          members={this.state.members}
          admin={this.state.admin}
          available={this.state.available}
          game_name={this.state.game_name}
        />

      );
    }
    else {
      if (this.state.status == true && this.state.currentUser == this.state.admin) {

        return (
          <RoomAdmin
            room_name={this.state.room_name}
            maxsize={this.state.maxsize}
            members={this.state.members}
            admin={this.state.admin}
            available={this.state.available}
            game_name={this.state.game_name}
          />

        );
      }
      else {
    
  
      if (this.state.status != true) {return (
        <RoomJoin
          room_name={this.state.room_name}
          maxsize={this.state.maxsize}
          members={this.state.members}
          admin={this.state.admin}
          available={this.state.available}
          game_name={this.state.game_name}
        />

      );
    }
    else{
      if (this.state.available == 0) {return (
        <RoomFull />
      );
    }
    else{

    return (
      <div>
        <p> {this.state.room_name}</p>
        <p> {this.state.maxsize}</p>{
          this.state.members.map((item) => (
            <p> {item.username}</p>))}
        <p> {this.state.admin}</p>
        <p> {this.state.available}</p>

      </div>

    );
  }}}}
}
}

export default RoomPage;