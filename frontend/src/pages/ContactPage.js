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


    handleChange = (e) => {
        if (e.target.value.length > 0 ) {
            this.setState({
                name: e.target.value,
                isEmpty: false
            })
        } else {
            this.setState({
                name: e.target.value,
                isEmpty: true
            })
        }
    }

    

    render() {
        return (
            <div className="contact">
                <form onSubmit={this.handleSubmit}>
                    <h3>Tworzenie pokoju</h3>
                    <textarea value={this.state.name} onChange={this.handleChange} placeholder="Nazwa pokoju"></textarea>
                    <textarea value={this.state.gamename} onChange={this.handleChange} placeholder="Nazwa gry"></textarea>
                    <textarea value={this.state.desc} onChange={this.handleChange} placeholder="Opis..."></textarea>
                    <button>Utwórz</button>
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
