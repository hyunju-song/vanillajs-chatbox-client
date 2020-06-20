// eslint-disable-next-line
const app = {
  server: 'http://52.78.206.149:3000/messages',
  init : function(){
  },
  fetch : function(){
    fetch(this.server)
    .then((response) => response.json())
  },
  send : function(message){    
  fetch(this.server,{      
    method: 'POST',      
    body: JSON.stringify(message),      
    headers: {"Content-Type": "application/json",}    
    })    
    .then(response=>response.json())  
  },
  clearMessages : function(){
    let chats = document.querySelector("#chats")
    while(chats.firstChild){
      chats.firstChild.remove();
    }
  },
  renderMessage : function(){
    let chats = document.querySelector("#chats")
    let newChild = document.createElement('p')
    chats.appendChild(newChild)
  }
};

//입력한 메세지를 post로 서버에 저장. 
//서버에서 해당 메시지를 get으로 부른후에,
//DOM 조작해서 화면에 표시

let message = document.querySelector("#message").value;
let roomName = document.querySelector(".roomname").value; //수정
let submit = document.querySelector("#submit");

var postMessage = {
  username: 'hyunju',
  text: message,
  roomname: roomName
};

submit.onclick = function(){
  postMessage.text = message;
  postMessage.roomname = roomName;
  app.send(postMessage);
}
  // .then((response) => {
  //   return response.json()
  // }).then(json => {
  //   console.log(json);
  // })


// postMessage.text = message;
// postMessage.roomname = roomName;









