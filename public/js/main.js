const socket = io()

const roomName = document.getElementById('roomName');
const usersList = document.getElementById('users');
const chatMessage = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    console.log(room, users);
    outputRoomName(room);
    outputUsersName(users);
});

socket.on('message', (message, sts) => {
    
    console.log(message);
    outputMessage(message, sts );
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on("welcome", (arg) => {
    console.log(arg)
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
 
function outputMessage(message, status) {
    if  ( status == undefined) {
         status = ''
    }
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`
        <div class="newMeta" id="meta" 
            <span class="userName"><b>${message.username}</b></span>
            <div class="text-time">
                <span class="text"> ${message.text}</span>
                <span class="time">${message.time}</span>
                <span class="date">${message.date}</span>
                <span class="tick" id='change'>${status}</span>
                
            </div>
        </div>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName (room) {
    roomName.innerHTML = room;
}

function outputUsersName (users) {
   usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
   `;
}
