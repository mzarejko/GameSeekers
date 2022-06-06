import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import "../styles/RegisterPage.css"


class RegisterPage extends React.Component {
    
    constructor(props){
        super(props)
        this.state={
            username: "",
            email: "",
            password1: "",
            password2: "",
            redirect: "",
            
        };
        
    }

    

    changeValue = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit = () => {
        axios.post("https://game-seekers-backend.herokuapp.com/v1/accounts/register/", {
        "username": this.state.username,
        "email": this.state.email,
        "password1": this.state.password1,
        "password2": this.state.password2
    }).then((response) => {
        this.setState({redirect: response.status})
        console.log(this.state.redirect)
    }).catch((error) => {
        console.log(error)
        this.setState({redirect: error.response.status})
        console.log(error.response.status)
        console.log(this.state.redirect)
    });       
    }
   
    render(){  

        if (this.state.redirect === 200) {
            return <Redirect to='/'/>;
        }
        if (this.state.redirect === 400) {
        return (
            <div className='register-page-container'>
                <h1>Rejestracja</h1>
                <p>Sprawdź poprawność</p>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.changeValue}
                    placeholder = "username"
                /> 
                <input
                    name="email"
                    type="text"
                    value={this.state.email}
                    onChange={this.changeValue}
                    placeholder = "email"
                />
                <input
                    name="password1"
                    type="password"
                    value={this.state.password1}
                    onChange={this.changeValue}
                    placeholder = "Password"
                />
                <input
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.changeValue}
                    placeholder = "repeat"
                />
                <button className='btn' onClick={this.submit}>login</button> 
            </div>
        );
    }
    else {
        return (
            
            <div className='register-page-container'>
                <h1>Rejestracja</h1>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.changeValue}
                    placeholder = "username"
                /> 
                <input
                    name="email"
                    type="text"
                    value={this.state.email}
                    onChange={this.changeValue}
                    placeholder = "email"
                />
                <input
                    name="password1"
                    type="password"
                    value={this.state.password1}
                    onChange={this.changeValue}
                    placeholder = "Password"
                />
                <input
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.changeValue}
                    placeholder = "repeat"
                />
                <button className='btn' onClick={this.submit}>login</button> 
            </div>
        );
    }}
}

export default RegisterPage;
