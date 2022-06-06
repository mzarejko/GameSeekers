import React from 'react';
import { Prompt } from 'react-router-dom';

class EditRoomPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = props.location.state
    }


    handleSubmit = (e) => {
        e.preventDefault();
        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/room/" + this.state.room_name + "/", {
                method: 'patch',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body:
                    JSON.stringify({
                        "room_name": this.state.room_name,
                        "maxsize": this.state.maxsize,
                        "members": this.state.members,
                        "game": this.state.game,
                    })

            })
                .then(response => {
                    if (response.status === 200) {
                        // TODO notify user
                        this.props.history.goBack()
                    } else {
                        // TODO notify user
                    }
                    return response.json();
                })

        } catch (err) {
            console.log(err.message)
        }
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }



    render() {
        return (
            <div className="contact">
                <form onSubmit={this.handleSubmit}>
                    <h3>Edycja pokoju</h3>
                    <input name="room_name" type="text" value={this.state.room_name} onChange={this.handleChange} placeholder="Nazwa pokoju"></input>
                    <input name="game" type="text" value={this.state.game} onChange={this.handleChange} placeholder="Gra"></input>
                    <input name="maxsize" type="number" value={this.state.maxsize} onChange={this.handleChange} placeholder="Maksymalna liczba graczy"></input>
                    <button onClick={this.handleSubmit}>Zapisz zmiany</button>
                </form>
                {/* <Prompt
                    when={this.state.isEmpty}
                    message="Masz niewypełniony formularz. Czy na pewno chcesz opuścić tę stronę"
                /> */}
            </div>

        );
    }
}

export default EditRoomPage;