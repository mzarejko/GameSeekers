import React, { Component } from 'react';
import Chat from './Chat';
import '../../styles/Chat.css';

class ChatList extends Component {

  constructor(props){
    super(props)
    this.state = {
      chats : [],
      currentChat : undefined,
      typedMessage: '',
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
              this.setState({
                chats: json.results
              })
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

  changeChat = (item) => {
    this.setState({currentChat : item.chat_id})
  }

  updateMessageInput = (input) => {
    this.setState({
      typedMessage: input.target.value
    })
  }

  createChat = () => {
    console.log("test")
    try {
        fetch(
            `https://game-seekers-backend.herokuapp.com/v1/room/${this.props.room}/chat/`, {
            method: 'post',
            body: JSON.stringify({"chat_name": this.state.typedMessage}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
        }).then((res) => {
          window.location.reload()
        })
    } catch (err) {
        console.log(err.message)
    }
  }

  render() {
    return (
      <div className="chatBlock">
        {this.state.chats.map((item) => {
          if (this.state.chats != []){
            return (
              <div onClick={() => {this.changeChat(item)}} key={item.chat_id} className={this.state.currentChat == item.chat_id ? 'actP' : 'inactP'}>
                <p>{item.chat_name}</p>
              </div>
            )
          }
        })}
        {this.renderChat()}
        <input
          onChange={this.updateMessageInput}
          value={this.state.typedMessage}
          type="text"
          placeholder="create new chat"
        />
        <button onClick={this.createChat}>add</ button>
      </div>
    )
  }
}

export default ChatList;
