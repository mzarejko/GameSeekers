import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'react-router-dom/Link';
import { refreshToken } from '../actions/auth';
import "../styles/Meeting.css"

export default class MeetingInfo extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          room_name: props.room_name, 
          items: {},
          autorized: true
        }
      }

      componentDidMount() {
          refreshToken()
          console.log("https://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/meeting/")
        try {
            
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/meeting/", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            }).then((res) => res.json())
                .then((json) => {
                    this.setState({ 
                        items: json.results
                    })
                })

        } catch (err) {
            console.log(err.message)
            
        }
    }

    

    handleDelete = (e) => {
        refreshToken()
        e.preventDefault();
        console.log(e.target.id)
        try {
            fetch("http://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/meeting/" + e.target.id + "/", {
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
                    window.location.reload(false)
                } else {
                if (response.status ===401){
                    this.setState({autorized: false})
                }
                else 
                { 
                    response.json().then(json => {
                        toast.error(json.detail, {
                            position: "top-center", autoClose: 4000, hideProgressBar: false,
                            closeOnClick: true, pauseOnHover: false, draggable: true, progress: undefined
                        });
                    })
                }
            }})
        } catch (err) {
            console.log(err.message)
        }

    }

    render() {
        let items = this.state.items
        console.log(this.state.autorized)
        if(this.state.autorized === false) {
            refreshToken()
            window.location.reload(false)
            this.componentDidMount()
            this.setState({autorized: true})
        }
        if ( items === undefined || Object.keys(items).length === 0){
            
            return (
                <div>
                    <h1>Nie ma spotkań</h1>
                </div>
            );
        }
        else {
        return (
            <div>
            {
                items.map((item) => (
                    <div className="meetingInfo">
                        <p>Data: {item.meeting_date}</p>
                        <p>Addres: {item.address} </p>
                        <p>Ile uczest: {item.number_of_participants} </p>
                        <p>ID: {item.id}</p>
                        <p>Status: {item.status_value}</p>
                        <Link to={{ pathname: "/editmeeting/:" + this.state.room_name, state: { id: item.id, room_name: this.state.room_name, meeting_date: item.meeting_date, address: item.address, status: item.status, number_of_participants: item.number_of_participants } }}>Edycja</Link>
                        <form id={item.id} onSubmit={this.handleDelete}>
                            <button className="btn" type="submit">Usuń pokój</button>
                        </form>
                    </div>
                ))}
                </div>
        );
      }}
}