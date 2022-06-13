import React, { Component } from 'react';
import Chat from './Chat';
import '../../styles/Chat.css';
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";

class ChatList extends Component {

  mode = {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete'
  }

  constructor(props){
    super(props)
    this.state = {
      chats : [],
      currentChat : undefined,
      typedNewChatName: '',
      typedChatName: '',
      currentMode: undefined,
      currentChat: undefined,
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
      [input.target.name]: input.target.value
    })
  }

  createChat = () => {
    try {
        fetch(
            `https://game-seekers-backend.herokuapp.com/v1/room/${this.props.room}/chat/`, {
            method: 'post',
            body: JSON.stringify({"chat_name": this.state.typedNewChatName}),
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

  deleteChat = (chat_id) => {
    try {
        fetch(
            `https://game-seekers-backend.herokuapp.com/v1/room/${this.props.room}/chat/${chat_id}/`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
        }).then((res) => {
          window.location.reload()
        })
    } catch (err) {
        console.log(err.message)
    }
  }

  editChat = (chat_id) => {
    try {
        fetch(
            `https://game-seekers-backend.herokuapp.com/v1/room/${this.props.room}/chat/${chat_id}/`, {
            method: 'PATCH',
            body: JSON.stringify({"chat_name": this.state.typedChatName}),
            headers: {
              'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
        }).then((res) => {
          window.location.reload()
        })
    } catch (err) {
        console.log(err.message)
    }
  }

  renderPopupChatAdd = () => {
    if (this.state.currentMode == this.mode.ADD){
      return (
        <div className='popup'>
          <input
            name="typedNewChatName"
            onChange={this.updateMessageInput}
            value={this.state.typedNewChatName}
            type="text"
            placeholder="chat name"
          />
          <div className='popupbuttons'>
          <button onClick={this.createChat}>create</ button>
          <button onClick={()=>{this.changeMode(undefined, undefined)}}>cancel</ button>
          </div>
        </div>
      )
    }
  }

  renderDeletePopup = () => {
    if (this.state.currentMode == this.mode.DELETE){
      return (
        <div className='popup'>
          <p>Are you sure you want to delete this chat?</p>
          <div className='popupbuttons'>
            <button onClick={()=>{this.deleteChat(this.state.currentChat)}}>yes</button>
            <button onClick={()=> {this.changeMode(undefined, undefined)}}>no</button>
          </div>
        </div>
      )
    }
  }

  renderEditChatPopup = () => {
    if (this.state.currentMode == this.mode.EDIT){
      return (
        <div className="popup">
          <input
            name="typedChatName"
            onChange={this.updateMessageInput}
            value={this.state.typedChatName}
            type="text"
            placeholder="new name for chat"
          />
          <div>
            <button onClick={()=> {this.editChat(this.state.currentChat)}}>accept</ button>
            <button onClick={()=>{this.changeMode(undefined, undefined)}}>cancel</ button>
          </div>
        </div>
      )
    }
  }

  changeMode = (type, id) => {
    this.setState({currentMode: type, 
                   currentChat: id})
  }

  render() {
    return (
      <div className="chatBlock">
        <button className="addChat" onClick={()=>{this.changeMode(this.mode.ADD)}}><BiIcons.BiPlusMedical /></button>
        {this.state.chats.map((item) => {
          if (this.state.chats != []){
            return (
                <div onClick={() => {this.changeChat(item)}} key={item.chat_id} className={this.state.currentChat == item.chat_id ? 'actP' : 'inactP'}>
                  <p>{item.chat_name}</p>
                  <button onClick={()=>{this.changeMode(this.mode.DELETE, item.chat_id)}}><RiIcons.RiDeleteBin6Fill /></ button>
                  <button onClick={()=>{this.changeMode(this.mode.EDIT, item.chat_id)}}><AiIcons.AiFillEdit /></ button>
                </div>
            )
          }
        })}
        {this.renderChat()}
        {this.renderPopupChatAdd()}
        {this.renderDeletePopup()}
        {this.renderEditChatPopup()}
      </div>
    )
  }
}

export default ChatList;
