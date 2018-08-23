const path = require('path');
const http = require('http');
const openurl = require('openurl');
const express = require('express');
const socketIO  = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

var locationsArray = [];

io.on('connection', (socket) => {
    console.log('new user connected!');

    socket.on('newUserInfo', (coords, callBack) => {
        callBack();

        locationsArray.push(coords);
        
        io.emit('locationsUpdate', locationsArray);
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});