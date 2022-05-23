import React from 'react';


import RoomNormal from '../components/RoomNormal';
import RoomAdmin from '../components/RoomAdmin';
import RoomFull from '../components/RoomFull';
import RoomJoin from '../components/RoomJoin';

class RoomPage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            room_name: this.props.location.state.rm,
            maxsize: this.props.location.state.ms,
            members: this.props.location.state.mm,
            admin: this.props.location.state.ad,
            available: this.props.location.state.av,
            currentUser: localStorage.getItem('currentUser'),
        }
        
        
    }
    render() {
      let status = this.state.members.map((user) => 
      {if(user.username == this.state.currentUser){return 1}}
      )
      {if(status ==1 && this.state.currentUser != this.state.admin)return (
        <RoomNormal 
        room_name={this.state.room_name}
        maxsize={this.state.maxsize}
        members={this.state.members}
        admin={this.state.admin}
        available={this.state.available}
        />
    
      );
      }
      {if(status !=1)return (
        <RoomJoin 
        room_name={this.state.room_name}
        maxsize={this.state.maxsize}
        members={this.state.members}
        admin={this.state.admin}
        available={this.state.available}
        />
    
      );
      }
      {if(this.state.available == 0)return (
        <RoomFull/>    
      );
      }
      {if(status ==1 && this.state.currentUser == this.state.admin)return (
        <RoomAdmin 
        room_name={this.state.room_name}
        maxsize={this.state.maxsize}
        members={this.state.members}
        admin={this.state.admin}
        available={this.state.available}
        />
    
      );
      }


    return (
      <div>
      <p> { this.state.room_name }</p>
      <p> { this.state.maxsize }</p>{
      this.state.members.map((item) => (
      <p> { item.username }</p>))}
      <p> { this.state.admin }</p>
      <p> { this.state.available }</p>
      
      </div>
  
    );
  }}
  
  export default RoomPage;