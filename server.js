const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server)
const PORT = 3000 || process.env.PORT;
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const joinName = 'Admin'

io.on('connection', socket => {
    console.log('A user connected...');

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        
        socket.emit('message', formatMessage(joinName, 'Welcome To Riser Techub Chat'))

        socket.broadcast
            .to(user.room)
            .emit('message', 
            formatMessage(joinName, 
                `${user.username} has joined the chat`
            ));

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room)
        .emit('message', 
        formatMessage(user.username,msg))
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room)
            .emit('message', 
            formatMessage(joinName,`${user.username} has left the chat!`));

            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUsers(user.room)
            });
        }
    });

});



server.listen(PORT, () => console.log(`Server running on port : ${PORT}`))