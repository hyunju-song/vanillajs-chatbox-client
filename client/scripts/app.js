// eslint-disable-next-line

let roomNameOption = [];
let message = document.querySelector("#message");
// let roomName = document.querySelector("select") //수정
let submit = document.querySelector("#submit");


const app = {
  server: 'http://52.78.206.149:3000/messages',
  init : function(){
    fetch(this.server)
    .then((response) => response.json())
    .then(con => {
      for(let i=0;i<con.length;i++){
        this.renderMessage(con[i]);
        if(!roomNameOption.includes(con[i].roomname)){
          roomNameOption.push(con[i].roomname);
          this.addRoomName(con[i].roomname);
        }
      }
      return con;
    })
    .then(data => data.filter((input)=>{
      if(input.roomname === roomNameOption[document.querySelector('select').selectedIndex]){
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
    .then(con => {
      for(let i=0;i<con.length;i++){
        this.renderMessage(con[i]);        
        if(!roomNameOption.includes(con[i].roomname)){
          roomNameOption.push(con[i].roomname);
          this.addRoomName(con[i].roomname);
        }
      }
      return con;
    })
    .then(data => data.filter((input)=>{
      if(input.roomname === roomname){
        return true;
      }
    }))
    .then(con => {
      this.clearMessages();
      for(let i=0;i<con.length;i++){
        this.renderMessage(con[i]);
      }
    });
    
  },
  send : function(CSR){
    fetch(this.server,{
      method: 'POST',
      body: JSON.stringify(CSR),
      headers: {
        "Content-Type": "application/json",
      }
    })
    this.clearMessages();
    this.fetch(CSR.roomname);
    document.querySelector('input').value = "";
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
    let creatMessage = document.createElement('span');
    creatMessage.className = 'text';
    creatMessage.innerHTML = data.text;
    newChild.appendChild(username);
    // newChild.appendChild(document.createElement('br'));
    // newChild.appendChild(document.createElement('br'));
    newChild.appendChild(creatMessage);
    // newChild.appendChild(document.createElement('hr'));
    chats.appendChild(newChild);
  },
  addRoomName : function(data){
    let select = document.querySelector('select');
    let option = document.createElement('option');
    option.className = 'roomname';
    option.id = data;
    option.value = data;
    option.innerHTML = data;
    option.type = 'button';
    
    select.onchange = function(){
      postMessage.roomname = roomNameOption[document.querySelector('select').selectedIndex];
      app.fetch(roomNameOption[document.querySelector('select').selectedIndex]);
    }

    // select.addEventListener('change',this.fetch(roomNameOption[document.querySelector('select').selectedIndex]))

    select.appendChild(option)
  }
};

//입력한 메세지를 post로 서버에 저장. 
//서버에서 해당 메시지를 get으로 부른후에,
//DOM 조작해서 화면에 표시


app.init();

let postMessage = {
  username: 'hyunju',
  text: 'dasdf',
  roomname: 'asdf'
};

submit.onclick = function(){
  postMessage.text = message.value;
  postMessage.roomname = roomNameOption[document.querySelector('select').selectedIndex];
  app.send(postMessage);
}








