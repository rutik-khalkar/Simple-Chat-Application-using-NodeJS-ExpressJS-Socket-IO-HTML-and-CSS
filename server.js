const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const bodyParser = require("body-parser");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('mySecretKey');
const cors = require('cors');

const socketio = require('socket.io');
const io = socketio(server);

require('./config/database').connect();  //import database file 

const PORT = 5000 || process.env.PORT;

const { 
        userJoin, getRoomUsers, 
        userLeave, getCurrentUser,
        getStatus, getMessage, } = require('./utils/users');

const  formatMessage = require('./utils/messages');
const registerRoute = require('./registers');
const validateRoute = require('./validate');
const Messages = require('./models/messages');


//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({origin: '*'}))

app.use('/register', registerRoute);
app.use('/validate', validateRoute);
const joinName = 'Admin'


// Client Connection
io.on('connection', socket => {
    console.log('A user connceted!');

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        console.log(socket.id)
        // Join the room
        socket.join(user.room)
        
        socket.emit("message", 
            formatMessage(joinName, 
               (`${user.username} Welcome To ${room} Chat Room!`)
            )
        )

        socket.broadcast
            .to(user.room)
            .emit('message', 
                formatMessage(joinName,
                    (`${user.username} has joined the ${user.room} Chat Room!`)
                )
            );

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        });

        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            const status = getStatus(room)
            const m = getMessage(msg, username, room)
            io.to(user.room).emit('message', formatMessage(user.username, msg), status);
           
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnect!')
        
        const user = userLeave(socket.id);
        
        if(user) {
            io.to(user.room)
            .emit('message',
            formatMessage(joinName, (`${user.username} has left the ${user.room} chat room!`))); 

            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUsers(user.room)
            })  
        }
    })
});

app.get('/dbMessage', async (req, res) => {
    io.on('connection', socket => {
        socket.on('joinRoom', async ({  room }) => {
            Messages.find({room}).then(chat => {
                res.json(chat);
            });            
        });
    });
});



// app.get("/decrypt", async (req, res) => {
//     message = req.query.message;
//     decrypted = cryptr.decrypt(message);
//     await res.json(decrypted);
//   });

// app.get('/encrypt', async (req, res) => {
//     message = req.query.message;
//     encrypted = cryptr.encrypt(message);
//     await res.json(encrypted);
// });


server.listen(PORT, () => console.log(`Server running on port : ${PORT}...`))