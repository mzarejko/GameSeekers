import React, { Component } from 'react';
import Socket from "./Socket";
import '../../styles/Chat.css';

class Chat extends Component {

  constructor(props){
    super(props)
    this.state={
      messages: [],
      typedMessage: "",
      prevChat: 0,
    }
  }

  createSocket(){
    const url = `ws://game-seekers-backend.herokuapp.com/chat/${this.props.chat_id}/?token=${localStorage.getItem('access_token')}`
    Socket.connect(url)
    this.prepareConection(()=> {
      Socket.addCallbacks(this.setMessages, this.addMessage)
      Socket.fetchMessages(this.props.chat_id)
    })
  }

  componentDidMount(){
    this.createSocket()
  }

  componentDidUpdate(){
    if(this.props.chat_id !== this.state.prevChat){
      this.setState({prevChat : this.props.chat_id})
      Socket.disconnect()
      this.createSocket()
    }
  }

  componentWillUnmount(){
    Socket.disconnect()
  }

  prepareConection(callback){
    const component = this
    setTimeout(function() {
      if (Socket.status() === 1) {
        return callback();
      } else {
        component.prepareConection(callback);
      }
    }, 100);
  }

  updateMessageInput = (input) => {
    this.setState({
      typedMessage: input.target.value
    })
  }

  renderMessages = (messages) => {
    return messages.map((message) => (
      <li key={message.id} className={(message.left) ? "leftMessage" : "rightMessage"} > 
        <p>{message.author}</p>
        <p>{message.content}</p>
        <small>{message.date}</small>
      </li>
    ));
  }

  sendMessage = (event) => {
    event.preventDefault();
    const object = {
      content: this.state.typedMessage,
      chat_id: this.props.chat_id
    };
    Socket.sendMessage(object)
    this.setState({typedMessage: ""})
  }

  setMessages = messages => {
    this.setState({
      messages: messages.reverse()
    });
  } 

  addMessage = message => {
    this.setState({
      messages: [...this.state.messages, message]
    });
  }

  render() {
    return (
      <div className='chatbox'>
        <div className='chat'>
          <ul>
            {this.renderMessages(this.state.messages)}
          </ul>
        </div>
        <form onSubmit={this.sendMessage}>
          <input
            onChange={this.updateMessageInput}
            value={this.state.typedMessage}
            type="text"
            placeholder="write your message..."
            />
        </form>
      </div>
    )
  }
}

export default Chat;