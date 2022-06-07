import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import MeetingInfo from "./MeetingInfo";
import ChatList from '../components/chat/ChatList';

class RoomAdmin extends React.Component {

    constructor(props) {
        super(props)

        this.state = props

        
    }

    componentDidMount() {
        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/room/?room_name=" + this.state.room_name, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            }).then((res) => res.json())
                .then((json) => {
                    json.results.map((item) => {
                        Object.keys(item).map((key) => {
                            this.setState({[key]: item[key]})
                        })})
                })

        } catch (err) {
            console.log(err.message)
        }
    }

    handleDelete = (e) => {
        e.preventDefault();
        try {
            fetch("https://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/", {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            }).then(response => {
                if (response.status == 200) {
                    response.json().then(json => {
                        toast.success('🦄 ' + json.detail, {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
                    this.props.history.push({ pathname: "/roomlist" })
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

    render() {
        return (
            <div className="room-container">
                <ChatList room={this.state.room_name} />
                <p> Jesteś administratorem tego pokoju </p>

                <p> {this.state.room_name}</p>
                <p>Gra: {this.state.game_name}</p>
                <p> Admin: {this.state.admin}</p>
                <p> Wolnych miejsc: {this.state.available}</p>
                <p> Maksymalna liczba graczy: {this.state.maxsize}</p>
                <p>Członkowie:</p>
                {this.state.members.map((item) => (
                    <p key={item.username}> {item.username}</p>))}
                <MeetingInfo room_name={this.state.room_name} ifAdmin={ 1 }/>
                <div className="buttons">
                <Link to={{ pathname: "/editroom/:" + this.state.room_name, state: { room_name: this.state.room_name, admin: this.state.admin, members: this.state.members, maxsize: this.state.maxsize, game: this.state.game } }}>Edycja</Link>
                <Link to={{ pathname: "/createmeeting", state: { room_name: this.state.room_name} }}>meeting create</Link>
                <form  onSubmit={this.handleDelete}>
                    <button className="btn" type="submit">Usuń pokój</button>
                </form>
                </div>
            </div>
        )
    }
}

export default withRouter(RoomAdmin);