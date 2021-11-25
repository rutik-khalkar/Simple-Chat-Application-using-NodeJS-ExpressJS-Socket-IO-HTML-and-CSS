const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');         
const userList = document.getElementById('users');

const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});


socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <div class="newMeta">
            <div class="userName"><b>${message.username}</b></div>
            <div class="text-time>
                <div class="text"> ${message.text}</div>
                <div class="time">${message.time}</div>
                <div class="date">${message.date}</div>
            </div>
        </div>
   
    `;
    document.querySelector('.chat-messages').appendChild(div);
}


function outputRoomName(room){
    roomName.innerHTML = room;
}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

    // <p class="msg_name">
    //     <b>${message.username}</b> </p>
    //     <b>
    //         <p class="text"> ${message.text}</p>
    //     </b>
    //     <p class="meta">
    //         <span>${message.time}</span><br>
    //         <span>${message.date}</span>
    //     </p>