import React from "react";
import '../styles/RoomList.css';
import { Link } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class RoomList extends React.Component {


    // Constructor 
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            DataisLoaded: false,
            games: [],
        };

        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/game/", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            }).then(response => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.results) {
                            this.setState({ games: json.results })
                        }
                    })
                } else {
                    response.json().then(json => {
                        toast.error(json.detail, {
                            position: "top-center", autoClose: 4000, hideProgressBar: false,
                            closeOnClick: true, pauseOnHover: false, draggable: true, progress: undefined
                        });
                    })
                }
            })
        } catch (err) {
            console.log(err.message)
        }

    }

    // ComponentDidMount is used to
    // execute the code 
    componentDidMount() {
        fetch(
            "https://game-seekers-backend.herokuapp.com/v1/room/", {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    items: json,
                    DataisLoaded: true,
                    error: true
                })
            }).catch((error) => {
                console.log(error)
            });



    }
    render() {
        const DataisLoaded = this.state.DataisLoaded;
        const items = this.state.items;

        let games_dict = {}
        this.state.games.map(({ id, game_name }) => (
            games_dict[id] = game_name
        ))

        if (!DataisLoaded) {
            return <div>
                <h1> Pleses wait some time.... </h1> </div>;
        }
        // if (this.state.error === true) {
        //     return <p>do login</p>;}
        try {
            items.results.map((item) => (
                <div className="roomListItem">
                    <li>Nazwa: {item.room_name}</li>
                    <li>Właściciel: {item.admin}</li>
                    <li>Miejsca: {item.available}/{item.maxsize}</li>
                    <Link className="btn" to={{ pathname: "/room/:" + item.room_name, state: { rm: item.room_name, ad: item.admin, mm: item.members, av: item.available, ms: item.maxsize } }}>Wejdz</Link>
                </div>
            ))
        } catch (error) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('currentUser')
            return <Redirect to='/login' />;
        }
        if (this.state.error === true) {
            return (
                <div className="room-list">
                    <h1> Room List </h1>  {
                        items.results.map((item) => (
                            <div className="roomListItem">
                                <div className="left-row">
                                <div className="title">
                                <p>{item.room_name}</p>
                                </div>
                                
                                <div className="game">
                                <p>Gra: {games_dict[item.game]} </p>
                                <p>Miejsca: {item.available}/{item.maxsize}</p>
                                </div>
                                
                                
                                <div className="other-info">
                                <p>Właściciel: {item.admin}</p>
                                <p>Miasto: {item.city} </p>    
                                </div>
                                
                                </div>
                                <div className="button">
                                <Link to={{ pathname: "/room/:" + item.room_name, state: { rm: item.room_name, ad: item.admin, mm: item.members, av: item.available, ms: item.maxsize, game_name: item.game_name } }}>{(item.members.map(({ username }) => username)).includes(localStorage.getItem("currentUser")) ? "Wejdź" : "Dołącz"}</Link>
                            </div>
                            </div>
                        ))}
                </div>
            );
        }
    }
}

export default RoomList;