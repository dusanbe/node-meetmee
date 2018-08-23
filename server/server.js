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

    socket.on('newUserLocation', (coords, callBack) => {
        callBack();

        locationsArray.push(coords);
        
        io.emit('locationsUpdate', locationsArray);
    });
});

// io.on('newUsersLocation', (socket) => {
//     socket.on('newUsersLocation', (coords, callBack) => {
//         console.log('location received!');

//         callBack();

//         locationsArray.push(coords);
        
//         socket.emit('locationsUpdate', {
//             locationsArray
//         });
//     });
// });

// function showPosition(position) {
//     var latlon = position.latitude + "," + position.longitude;

//     var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=+latlon+&zoom=14&size=400x300&sensor=false&key=YOUR_:KEY";

//     document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
// }

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});