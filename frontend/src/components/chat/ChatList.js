import React, { Component } from 'react';
import Chat from './Chat';
import '../../styles/Chat.css';

class ChatList extends Component {

  constructor(props){
    super(props)
    this.state = {
      chats : [],
      currentChat : undefined,
    }
  }

  componentDidMount(){
    try {
        fetch(
            `https://game-seekers-backend.herokuapp.com/v1/room/${this.props.room}/chat/`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
        }).then((res) => res.json())
            .then((json) => {
              if (json.results != undefined){
                this.setState({
                  chats: json.results
                })
              }
            })
    } catch (err) {
        console.log(err.message)
    }
  }

  renderChat = () => {
    if(this.state.currentChat != undefined){
      return (<Chat chat_id={this.state.currentChat} />)
    }
  }

  rerenderChat = (item) => {
    this.setState({currentChat : item.chat_id})
  }



  render() {
    return (
      <div className="chatBlock">
        {this.state.chats.map((item) => {
          if (this.state.chats != []){
            return (
              <div onClick={() => {this.rerenderChat(item)}} key={item.chat_id}>
                <p>{item.chat_name}</p>
              </div>
            )
          }
        })}
        {this.renderChat()}
        <button onClick={()=>{this.setState({currentChat : undefined})}}>exit chat</ button>
      </div>
    )
  }
}

export default ChatList;
