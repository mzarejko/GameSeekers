import React from 'react';

import { login, logout } from '../actions/auth';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/LoginPage.css";


class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            redirect: "",
        };
        
    }

    

    changeValue = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    login_user = (e) => {
        e.preventDefault();
        login(this.state.username, this.state.password)
    }

    logout_user = (e) => {
        e.preventDefault();
        logout()
    }

    submit = () => {
        axios.post("https://game-seekers-backend.herokuapp.com/v1/accounts/login/", {
            "username": this.state.username,
            "password": this.state.password
        }).then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('currentUser', this.state.username)
            this.setState({redirect: response.status})
        }).catch((error) => {

        });        
    }
   
    render(){  

        if (this.state.redirect === 200) {
            return <Redirect to='/roomlist'/>;
        }
        else{
            return (
            
            <div className="login-page-container" hidden={localStorage.getItem("currentUser")!=null}>
                <h1>Logowanie</h1>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.changeValue}
                    placeholder = "nazwa użytkownika"
                /> 
                <input
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.changeValue}
                    placeholder = "hasło"
                />
                <div className='btn-container'>
                <button className='btn' onClick={this.submit}>Zaloguj się</button>
                </div>
                <p>Jeśli nie masz konta -{'>'} <Link to={{ pathname: "/register" }}>Rejestracja</Link></p> 

            
           <form onSubmit={this.logout_user} hidden={localStorage.getItem("currentUser")==null}>
                    <button className='btn' type="submit">Wyloguj</button>
                </form>
                </div>
        );
    }
}}

export default LoginPage;
