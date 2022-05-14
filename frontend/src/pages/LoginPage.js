import React from 'react';
import {login} from '../actions/auth';

class LoginPage extends React.Component {
    
    constructor(props){
        super(props)
        this.state={
            username: "",
            password: "",
        };
    }

    changeValue = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit = () => {login(this.state.username, this.state.password)}
   
    render(){    
        return (
            <div>
                <input
                    name="username"
                    type="text"
                    value={this.state.username}
                    onChange={this.changeValue}
                    placeholder = "username"
                /> 
                <input
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.changeValue}
                    placeholder = "password"
                />
                <button onClick={this.submit}>login</button> 
            </div>
        );
    }
}

export default LoginPage;
