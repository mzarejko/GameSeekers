import {logout, refreshToken} from '../../actions/auth';

const commands = {
  UPDATE_MESSAGES: 'update_messages',
  FETCH_MESSAGES: 'fetch_messages',
}

class ChatWebSocket {


  constructor(){
    this.callbacks = {}
    this.socket = null
    
  }
  
  connect(path){
    try{
      this.socket = new WebSocket(path)
    }catch{
      return console.log('error chat connection')
    }

    this.socket.onopen = () => {
      console.log("chat websocket open")
    }

    this.socket.onmessage = (event) => {
      this.updateIncomingMessages(event.data) 
    }

    this.socket.onerror = (event)=> {
      refreshToken(()=>{this.socket = new WebSocket(path)}, logout)
      console.log(event)
    }

    this.socket.onclose = (event) => {
      console.log('chat websocket closed')
      this.connect();
    }
  }
  
  disconnect() {
    this.socket.close();
  }
  
  updateIncomingMessages(data){
    data = JSON.parse(data)
    const command = data.command;

    if (command === commands.UPDATE_MESSAGES){
      this.callbacks[command](data.message)
    }

    if (command === commands.FETCH_MESSAGES){
      console.log(data.messages)
      this.callbacks[command](data.messages)
    }

  }
  
  fetchMessages(chat_id){
    const data = {
      command: commands.FETCH_MESSAGES,
      chat_id: chat_id,
    };
    this.send(data)
  }

  sendMessage(message){
    const data = {
      command: commands.UPDATE_MESSAGES,
      message: message.content,
      chat_id: message.chat_id
    }
    this.send(data)
  }

  send(data){
    try{
      this.socket.send(JSON.stringify({...data}));
    }catch(error){
      console.log(error.message)
    }
  }

  addCallbacks(fetchMessagesCallback, updateMessagesCallback) {
    this.callbacks[commands.UPDATE_MESSAGES] = updateMessagesCallback;
    this.callbacks[commands.FETCH_MESSAGES] = fetchMessagesCallback;
  }

  status(){
    return this.socket.readyState
  }

}

const Socket = new ChatWebSocket()
export default Socket;
