// eslint-disable-next-line

let roomNameOption = [];
let postMessage = {};
let message = document.querySelector("#message-input");
let user = document.querySelector("#input-username");
let room = document.querySelector("#input-room"); 
let submit = document.querySelector("#submit");

const app = {
  server: 'http://52.78.206.149:3000/messages',
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
  renderMessage : function({username,text,date,roomname}){
    ///</ , />/ 이건 정규표현식의 일종으로 태그로 인식되는 < 나 > 가 입력되는 경우에 
    //&lt; 나 &gt;로 변환해준다는 말
    const tmpl = `<div class="chat">
      <div class="username"> username: ${username
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</div>
      <div> text: ${text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</div>
      <div> date: ${date}</div>
      <div>roomname: ${roomname
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      }</div>
    </div>`;

    document.querySelector('#chats').innerHTML =
      tmpl + document.querySelector('#chats').innerHTML;
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

//autofetch 코드가 잘못된건지 eslint 에러에 자꾸 걸려서 코드를 비활성화 합니다
// function autoFetch(){
//   app.fetch();
//   if(true){
//     setTimeout(autoFetch, 5000);
//   }
// }

// autoFetch();









