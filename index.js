var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectedUsers = [];
var connectedUser;
var roomName;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('connectedUser', (user) => { //Receive data from event 'connectedUser' emitted in chatCrtl.js
        console.log('a user ' + user + ' connected');
        connectedUser = user;
        connectedUsers.push(connectedUser);
        io.emit('connectedUser', connectedUsers); //emit event "connectedUser" and its data to all
    });
    socket.on('onlineUserList', () => {
        io.emit("onlineUserList", connectedUsers);
    });

    socket.on('chat message', (msg) => { // receive data from event 'chat message' emitted in chatCtrl.js
        console.log('message: ' + msg);
        io.emit('public message', msg); //emit event "chat message" and its data to all
    });

    socket.on('disconnect', (user) => {
        connectedUsers.pop(user);
        io.emit('connectedUser', connectedUsers); //emit new connected user List
        console.log('user disconnected');
    });

    socket.on('join private room', (room) => {
        console.log('join private room');
        roomName = room;
        socket.join(room);
    });

    socket.on('private message', (msg) => { // receive data from event 'chat message' emitted in chatCtrl.js
        console.log('message: ' + msg);
        io.sockets.in(roomName).emit('private message', msg); //emit event "chat message" and its data to all
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});