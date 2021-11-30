const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');

const socketio = require('socket.io');
const io = socketio(server);

const PORT = 5000 || process.env.PORT;

const { 
        userJoin, getRoomUsers, 
        userLeave, getCurrentUser,
        getStatus } = require('./utils/users');

const  formatMessage = require('./utils/messages');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const joinName = 'Admin'

// Client Connection
io.on('connection', socket => {
    console.log('A user connceted!');

    socket.on('joinRoom', ({ username, room }) => {
       
        const user = userJoin(socket.id, username, room);

        // Join the room
        socket.join(user.room)

        socket.emit("message", 
            formatMessage(joinName, 
                `${user.username} Welcome To ${room} Chat Room!`
            )
        )

        socket.broadcast
            .to(user.room)
            .emit('message', 
                formatMessage(joinName,
                    `${user.username} has joined the ${user.room} Chat Room!`
                )
            );
        
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        });

        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            const status = getStatus(room)
        
            io.to(user.room).emit('message', formatMessage(user.username, msg), status);
           
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnect!')
        
        const user = userLeave(socket.id);
        
        if(user) {
            io.to(user.room)
            .emit('message',
            formatMessage(joinName, `${user.username} has left the ${user.room} chat room!`)); 

            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUsers(user.room)
            })  
        }
    })
});

server.listen(PORT, () => console.log(`Server running on port : ${PORT}...`))