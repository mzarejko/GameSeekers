import React from 'react';
import '../styles/ContactPage.css';
import { Prompt } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class CreateRoomPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            room_name: "",
            maxsize: "",
            game: "",
            currentUser: localStorage.getItem('currentUser'),
            game: "",
            city: "",
            isEmpty: true,
            games: [],
            cities: [],
            fetchingGames: true,
            fetchingCities: true,
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
                            this.setState({ game: json.results[0].id })
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
                            this.setState({ cities: json.results, fetchingCities: false, city: json.results[0].city_name })
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
                "https://game-seekers-backend.herokuapp.com/v1/room/", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body:
                    JSON.stringify({
                        "room_name": this.state.room_name,
                        "maxsize": this.state.maxsize,
                        "game": this.state.game,
                        "city": this.state.city,
                        "members": [{ username: localStorage.getItem('currentUser') }]
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
        return (
            <div className="contact">
                <form onSubmit={this.handleSubmit}>
                    <h3>Tworzenie pokoju</h3>
                    <input name="room_name" type="text" value={this.state.name} onChange={this.handleChange} placeholder="Nazwa pokoju"></input>
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
                    <button type="submit">Utwórz</button>
                </form>
                <Prompt
                    when={this.state.isEmpty}
                    message="Masz niewypełniony formularz. Czy na pewno chcesz opuścić tę stronę"
                />
            </div>

        );
    }
}

export default CreateRoomPage;