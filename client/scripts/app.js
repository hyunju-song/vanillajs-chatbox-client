// eslint-disable-next-line

let roomNameOption = [];
let message = document.querySelector("#message");
let user = document.querySelector("#input-username");
let room = document.querySelector("#input-room"); 
let submit = document.querySelector("#submit");

const app = {
  server: 'http://52.78.206.149:3000/messages',
  init : () => {
    fetch(app.server)
    .then((response) => response.json())
    .then(res => {
      for(let i=0;i<res.length;i++){
        app.renderMessage(res[i]);
        if(!roomNameOption.includes(res[i].roomname)){
          roomNameOption.push(res[i].roomname);
          app.addRoomName(res[i].roomname);
        }
      }
      return res;
    })
  },
  fetch : ()=>{
    window
      .fetch(app.server)
      .then(response => response.json())
      .then((data) => data.filter((elem)=>{
        if(elem.roomname === roomNameOption[document.querySelector('select').selectedIndex]){
          return true;
        }
      }))
      .then(con => {
        app.clearMessages();
        for(let i=0;i<con.length;i++){
          app.renderMessage(con[i]);
        }
      });
  },
  send : (postMessage, callback) => {
    window
      .fetch(app.server,{
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(res => res.json())
      .then(callback);
    app.clearMessages();
    message.value = "";
    user.value = "";
    room.value = "";
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
    let date = document.createElement('span');
    date.className = 'date';
    date.innerHTML = data.date;
    newChild.appendChild(username);
    newChild.appendChild(creatMessage);
    newChild.appendChild(date);
    chats.appendChild(newChild);
  },
  addRoomName : function(data){
    let select = document.querySelector('select');
    let option = document.createElement('option');
    option.className = 'roomname-option';
    option.value = data;
    option.innerHTML = data;
    option.type = 'button';
    select.appendChild(option)
    select.onchange = function(){
      app.fetch();
    }
   }
};

app.init();

var postMessage = {
};

submit.onclick = (e) => {
  postMessage.username = user.value;
  postMessage.text = message.value;
  if(room.value){
    postMessage.roomname = room.value;
  } else {
    postMessage.roomname = roomNameOption[document.querySelector('select').selectedIndex];
  }
  e.preventDefault();
  app.send(postMessage , ()=>{app.fetch()});
}








