import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getData } from "../actions/get";
import MeetingInfo from "./MeetingInfo";
import { useState, useEffect } from "react";

class RoomNormal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            props,
            items: {},
        }

        
    }

    componentDidMount() {
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
                        Object.keys(item).map((key) => {
                            this.setState({[key]: item[key]})
                        })})
                })

        } catch (err) {
            console.log(err.message)
        }
        
    }

    
    render() {        
        
        return (
            <div>
                <p> Witamy w pokoju {this.state.room_name} </p>

                
                <p>Gra: {this.state.game_name}</p>
                <p> Admin: {this.state.admin}</p>
                <p> Wolnych miejsc: {this.state.available}</p>
                <p> Maksymalna liczba graczy: {this.state.maxsize}</p>
                <p>Członkowie:</p>
                <MeetingInfo room_name={ this.state.room_name } />
                
            </div>
        )
    }
}

export default RoomNormal;