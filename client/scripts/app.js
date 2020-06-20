// eslint-disable-next-line
const app = {
  server: 'http://52.78.206.149:3000/messages',
  init : function(){
    fetch(this.server)
    .then((response) => response.json())
    .then(data => data.filter((input)=>{
      if(input.roomname === 'lobby'){
        return true;
      }
    }))
    .then(con => {
      for(let i=0;i<con.length;i++){
        this.renderMessage(con[i]);
      }
    });
  },
  fetch : function(roomname){
    fetch(this.server)
    .then((response) => response.json())
    .then(data => data.filter((input)=>{
      if(input.roomname === roomname){
        return true;
      }
    }))
    .then(con => {
      for(let i=0;i<con.length;i++){
        this.renderMessage(con[i]);
      }
    });
  },
  send : function(message){
    this.clearMessages();
    fetch(this.server,{
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      }
    })
    this.fetch(message.roomname);
  },
  clearMessages : function(){
    let chats = document.querySelector("#chats")
    while(chats.firstChild){
      chats.firstChild.remove();
    }
  },
  renderMessage : function(data){
    let chats = document.querySelector("#chats")
    let newChild = document.createElement('p')
    let username = document.createElement('span');
    username.className = 'username';
    username.innerHTML = data.username;
    let message = document.createElement('span');
    message.className = 'text';
    message.innerHTML = data.text;
    newChild.appendChild(username);
    newChild.appendChild(document.createElement('br'));
    newChild.appendChild(document.createElement('br'));
    newChild.appendChild(message);
    newChild.appendChild(document.createElement('hr'));
    chats.appendChild(newChild);
  }
};

//입력한 메세지를 post로 서버에 저장. 
//서버에서 해당 메시지를 get으로 부른후에,
//DOM 조작해서 화면에 표시

let message = document.querySelector("#message");
let roomName = document.querySelector(".roomname") //수정
let submit = document.querySelector("#submit");

app.init();

let postMessage = {
  username: 'hyunju',
  text: 'dasdf',
  roomname: 'asdf'
};

submit.onclick = function(){
  postMessage.text = message.value;
  postMessage.roomname = roomName.value;
  app.send(postMessage);
}








