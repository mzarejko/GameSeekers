import React from 'react';
import '../styles/ContactPage.css';
import { Prompt } from 'react-router-dom';

class ContactPage extends React.Component {
    state = {
        name: "",
        gamename: "",
        desc: "",
        isEmpty: true,
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            name: "",
            gamename: "",
            desc: "",
            isEmpty: true
        })
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
                    <h3>Tworzenie pokoju</h3>
                    <textarea  onChange={this.handleChange} placeholder="Nazwa pokoju"></textarea>
                    <textarea  onChange={this.handleChange} placeholder="Nazwa gry"></textarea>
                    <textarea  onChange={this.handleChange} placeholder="Opis..."></textarea>
                    <button onClick={this.handleSubmit}>Utwórz</button>
                </form>
                <Prompt
                    when={!this.state.isEmpty}
                    message="Masz niewypełniony formularz. Czy na pewno chcesz opuścić tę stronę"
                />
            </div>

        );
    }
}

export default ContactPage;
