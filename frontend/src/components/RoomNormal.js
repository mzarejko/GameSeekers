import React from "react";


class RoomNormal extends React.Component {

    constructor(props) {
        super(props)
        this.state = props
    }

    render() {
        return (
            <div>
                <p> {this.state.room_name}</p>
                <p>Gra: {this.state.game_name}</p>
                <p> Admin: {this.state.admin}</p>
                <p> Wolnych miejsc: {this.state.available}</p>
                <p> Maksymalna liczba graczy: {this.state.maxsize}</p>
                <p>Członkowie:</p>
                {this.state.members.map((item) => (
                    <p key={item.username}> {item.username}</p>))}
            </div>
        );
    }
}

export default RoomNormal;