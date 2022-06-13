import React from 'react';
import { Prompt } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/EditRoom.css";


class EditRoomPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = props.location.state
        this.state.games = []
        this.state.cities = []
        this.state.members = []
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
                        item.members.map(({ username }) => {
                            this.state.members.push({ "username": username, "selected": false })
                        })
                    })
                })

        } catch (err) {
            console.log(err.message)
        }

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
                            this.setState({ games: json.results, fetchingGames: false })
                        }
                    }
                    )
                    // TODO: notification for user
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
        try {
            fetch(
                "https://game-seekers-backend.herokuapp.com/v1/city/", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
            }).then(response => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (json.results) {
                            this.setState({ cities: json.results, fetchingCities: false, })
                        }
                    }
                    )
                    // TODO: notification for user
                } else {
                    // TODO: notification for user
                }
            })
        } catch (err) {
            console.log(err.message)
            // TODO: notification for user
        }

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
                        "members": this.state.unselected,
                        "game": this.state.game,
                        "city": this.state.city

                    })

            })
                .then(response => {
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
                        this.props.history.goBack()
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


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            isEmpty: false
        });
    }

    onCheckboxChange = (event, member) => {
        this.state.members.map((item) => {
            if (item.username === member.username) { item.selected = event.target.checked }
        })

        this.getUnselectedMembers()
        console.log(this.state.members)
    }

    getUnselectedMembers() {
        this.state.unselected = this.state.members.filter((member) => !member.selected)
    }


    render() {
        return (
            <div className="meeting-form">
                <form onSubmit={this.handleSubmit}>
                    <h3>Edycja pokoju</h3>
                    <input name="room_name" type="text" value={this.state.room_name} onChange={this.handleChange} placeholder="Nazwa pokoju"></input>
                    <select name="game" value={this.state.game} onChange={this.handleChange} disabled={this.state.fetchingGames}>
                        {this.state.games.map(({ id, game_name }) => (
                            <option key={id} value={id}>{game_name}</option>
                        ))}
                    </select>
                    <input name="maxsize" type="number" value={this.state.maxsize} onChange={this.handleChange} placeholder="Maksymalna liczba graczy"></input>
                    <select name="city" value={this.state.city} onChange={this.handleChange} disabled={this.state.fetchingCities}>
                        {this.state.cities.map(({ city_name }) => (
                            <option key={city_name} value={city_name}>{city_name}</option>
                        ))}
                    </select>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope="col">
                                    Usuń członków
                                </th>
                                <th scope="col">
                                    Imię
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.members.map((member) => (
                                <tr key={member.username} className={member.selected ? "selected" : ""}>
                                    <th scope='row'>
                                        <input type="checkbox" checked={member.selected} className="form-check-input" id="select{member.username}" onChange={(e) => this.onCheckboxChange(e, member)} disabled={member.username === this.state.admin} />
                                    </th>
                                    <td>{member.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='btn' type="submit">Zapisz</button>
                </form>
                <Prompt
                    when={this.state.isEmpty}
                    message="Masz niewypełniony formularz. Czy na pewno chcesz opuścić tę stronę"
                />
            </div>

        );
    }
}

export default EditRoomPage;