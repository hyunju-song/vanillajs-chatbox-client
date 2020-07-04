// eslint-disable-next-line

let roomNameOption = [];
let postMessage = {};
let dataIdArr = [];
let id = 0;
//지금시간 구하기
function newTime(){
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let nowTime = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds}`;
  return nowTime;
}
//지금의 날짜와 시간 구하기
function getToday(){
  let date = new Date();
  let nowDate = date.getFullYear()+"-"+(
      "0"+(date.getMonth()+1)).slice(-2)+"-"+(
      "0"+date.getDate()).slice(-2) + " " + newTime();
  return nowDate;
}
let message = document.querySelector("#message-input");
let user = document.querySelector("#input-username");
let room = document.querySelector("#input-room"); 
let submit = document.querySelector("#submit");

const app = {
  server: 'http://localhost:3000/messages',
  init : () => {
    fetch(app.server)
    .then((response) => response.json())
    .then(json => {
      app.roomnameIsNew(json);
    })
  },
  fetch : ()=>{
    window
      .fetch(app.server)
      .then(response => response.json())
      .then(data => 
        data.filter((elem)=>{
        if(elem.roomname === roomNameOption[document
          .querySelector('select').selectedIndex]){
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
  },
  clearMessages : function(){
    document.querySelector('#chats').innerHTML = '';
  },
  clearForm : function(){
    message.value = "";
    user.value = "";
    room.value = "";
  },
  renderMessage : function({username, text, roomname, date, id}){
    ///</ , />/ 이건 정규표현식의 일종으로 태그로 인식되는 < 나 > 가 입력되는 경우에 
    //&lt; 나 &gt;로 변환해준다는 말
    let tmpl = `<div class="dataId" data-id="${id}">
      <p class="username"> username: ${username
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</p>
      <p> text: ${text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</p>
      <p> date: ${date}</p>
      <p>roomname: ${roomname
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</p>
    </div>`;

    document.querySelector('#chats').innerHTML =
      tmpl + document.querySelector('#chats').innerHTML;
    
    let dataid = document.querySelector('#chats').firstChild.dataset.id;
    dataIdArr.push(dataid);
  },
  addRoomName : function(data){
    const optionTmpl = `<select>
      <option class="roomname-option"
      value = ${data}
      type = "button"> ${data} 
      </option>
      </select>`
    let select = document.querySelector('select');
    select.innerHTML = select.innerHTML + optionTmpl;
    select.onchange = function(){
      app.fetch();
    }
   },
   roomnameIsNew : res => {
     res.forEach((elem) =>{
       app.renderMessage(elem);
       if(!roomNameOption.includes(elem.roomname)){
         roomNameOption.push(elem.roomname);
         app.addRoomName(elem.roomname , ()=>{app.fetch()});
       }
     })
    return;
   },
  handleSubmit: e => {
    e.preventDefault();
    app.clearMessages();
    postMessage.username = user.value;
    postMessage.text = message.value;
    if(room.value){
      postMessage.roomname = room.value;
    } else {
      postMessage.roomname = roomNameOption[document
        .querySelector('select').selectedIndex];
    }
    postMessage.date = getToday();
    postMessage.id = id;
    id ++;
    if(!roomNameOption.includes(room.value)){
      roomNameOption.push(room.value);
      app.addRoomName(room.value , 
        ()=>{
          app.fetch();
          app.clearForm();
        });
    }
    app.send(postMessage ,
      ()=>{
        app.fetch();
        app.clearForm();
      }
    );
  }
};

submit.addEventListener('click', app.handleSubmit);
app.init();

// let data = document.querySelector('#chats').firstChild
// console.log(document.querySelector('#chats').firstChild)
// let dataId = data.dataset.id;

//autofetch 부분
let idHas = false;

function autoFetch(){
  fetch(app.server)
  .then(res => res.json())
  .then(json => {
    app.fetch();
    if(idHas){
      let jsonId = json[json.length-1]['id'];
      let dataLastId = dataIdArr[-1];
      if(jsonId === dataLastId){
        return;
      }
      setTimeout(autoFetch, 5000);
      idHas = true;
    }
  })
}

autoFetch();







