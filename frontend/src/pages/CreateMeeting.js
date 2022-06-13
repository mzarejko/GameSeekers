import React from 'react';
import '../styles/ContactPage.css';
import { Prompt } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class CreateMeetingPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            room_name: props.location.state.room_name,
            meeting_date: "",
            address: "",
            currentUser: localStorage.getItem('currentUser'),
            status: "",
            number_of_participants: "",
            
        }}

        




    handleSubmit = (e) => {
        e.preventDefault();
        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/meeting/", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body:
                    JSON.stringify({
                        "address": this.state.address,
                        "meeting_date": this.state.meeting_date,
                        "number_of_participants": this.state.number_of_participants,
                        "status": this.state.status,
                    })

            }).then(response => {

                if (response.status === 200) {
                    // TODO: notification for user
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
            // TODO: notification for user
        }
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            isEmpty: false
        });
    }



    render() {
        
        console.log(this.state.meeting_date)
        console.log(this.state.address)
        return (
            <div className="meeting-form">
                <form onSubmit={this.handleSubmit}>
                    <h3>Tworzenie spotkania { this.state.room_name}</h3>
                    <input type="date"  name="meeting_date" value={this.state.meeting_date} onChange={this.handleChange}></input>
                    <input name="address" type="text" value={this.state.address } onChange={this.handleChange} placeholder="Adres"></input>
                    <input type="number"  name="number_of_participants" onChange={this.handleChange} value={this.state.number_of_participants} placeholder="Liczba graczy"></input>
                    <input type="text"  name="status" onChange={this.handleChange} value={this.state.status} placeholder="Status"></input>
                    <button className='btn' type="submit">Utwórz</button>
                </form>
                <Prompt
                    when={this.state.isEmpty}
                    message="Masz niewypełniony formularz. Czy na pewno chcesz opuścić tę stronę"
                />
            </div>

        );
    }
}

export default CreateMeetingPage;