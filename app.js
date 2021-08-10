if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeaves
} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// I want to have this public folder as static folder
// so that we can access these HTML files and access our frontend

app.use(express.static(path.join(__dirname, 'public'))); //joining the current director to the public directory
//now public is our static folder

const botname = 'Chatbot';


//Run when client connnects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //this message will only be seen by client that connected
        //Welcome the current user
        socket.emit('message', formatMessage(botname, 'Welcome to ChatCord'));

        //Broadcast when a user connects
        //all the clients except the client thats connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat`));

        //send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for chatMessage
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id);

        //emitting the message to everybody after listening
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    //Runs when client disconnects
    //all clients in general -> io.emit()
    socket.on('disconnect', () => {

        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })


});





const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})