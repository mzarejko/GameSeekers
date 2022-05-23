import React from "react";
import '../styles/RoomList.css';
import { Link } from 'react-router-dom';




class RoomList extends React.Component {
   
    goTORoom(roomName) {
        this.props.history.push('/room', { name: roomName })
    }
    
    // Constructor 
    constructor(props) {
        super(props);
   
        this.state = {
            items: {},
            DataisLoaded: false
        };
    }
   
    // ComponentDidMount is used to
    // execute the code 
    componentDidMount() {
        fetch(
"https://game-seekers-backend.herokuapp.com/v1/room/")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    items: json,
                    DataisLoaded: true
                });
            })
            localStorage.setItem('currentUser', 'test123')
    }
    render() {
        const { DataisLoaded, items } = this.state;
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;
   
        return (
        <div className = "App">
            <h1> Fetch data from an api in react </h1>  {
                items.results.map((item) => ( 
                <div className="roomListItem">
                    <li>Nazwa: {item.room_name}</li>
                    <li>Właściciel: {item.admin}</li>
                    <li>Miejsca: {item.available}/{item.maxsize}</li>
                    <Link  to={{pathname: "/room",state: {rm: item.room_name,ad: item.admin,mm: item.members,av: item.available,ms: item.maxsize}}}>Wejdz</Link>
                </div>    
                ))
            }
        </div>
    );
}
}
   
export default RoomList;