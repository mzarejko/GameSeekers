import React from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class RoomJoin extends React.Component {

    constructor(props) {
        super(props)

        this.state = props
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
                            this.setState({ [key]: item[key] })
                        })
                    })
                })

        } catch (err) {
            console.log(err.message)
        }
        this.state.members.push({ "username": localStorage.getItem("currentUser") })
    }

    componentDidMount() {
        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/room/?room_name=" + this.state.room_name, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body:
                    JSON.stringify({
                        "room_name": this.state.room_name,
                        "maxsize": this.state.maxsize,
                        "city": this.state.city,
                        "members": this.state.members,
                        "game": this.state.game
                    })
            }).then(response => {
                if (response.status === 200) {
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
                    this.props.history.push({ pathname: "/room/:" + this.state.room_name, state: { rm: this.state.room_name, ad: this.state.currentUser, mm: [{ username: this.state.currentUser }], av: this.state.maxsize - 1, ms: this.state.maxsize } })
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
        //this.props.history.push({ pathname: "/roomlist" })
        return (
        <div>
            <h1>coś nie tak

            </h1>
        </div> 
    )}
}

export default RoomJoin;