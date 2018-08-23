var socket = io();

jQuery("#userForm").on('submit', function (e) {
    e.preventDefault();

    var userName = jQuery('[name=userName]').val();
    var userMessage = jQuery('[name=userMessage]').val();

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('newUserInfo', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            userName: userName,
            userMessage: userMessage
        }, function () {
            console.log('New users location succesfully sent!');
        });
    }, function () {
        alert('Unable to fetch location.')
    });
})

socket.on('locationsUpdate', function (locationsArray) {
    displayLocations(locationsArray);
});

socket.on('disconnect', function () {
    removeUser(userName);
    displayLocations(locationsArray);
});

function removeUser (userName) {
    locationsArray.forEach(element => {
        if (element.userName === userName) {
            locationsArray.latitude = undefined;
            locationsArray.longitude = undefined;
        }
    });
};

var mymap = L.map('mapid');

function displayLocations (locationsArray) {
    console.log('Displaying locations...');

    var minLat = Math.min.apply(Math, locationsArray.map(function (element) {return element.latitude}));
    var minLon = Math.min.apply(Math, locationsArray.map(function (element) {return element.longitude}));
    var maxLat = Math.max.apply(Math, locationsArray.map(function (element) {return element.latitude}));
    var maxLon = Math.max.apply(Math, locationsArray.map(function (element) {return element.longitude}));

    var corner1 = L.latLng(minLat, minLon),
    corner2 = L.latLng(maxLat, maxLon),
    bounds = L.latLngBounds(corner1, corner2);

    mymap.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
    ]);

    locationsArray.forEach(element => {
        var marker = L.marker([element.latitude, element.longitude]).addTo(mymap);
        marker.bindPopup(`<b>${element.userName}</b><br>${element.userMessage}`).openPopup();
    });
};

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZHVzYW5iZSIsImEiOiJjamw1ZGl5Y3EwZ2syM3Bxa2t3OW9nYTd1In0.I5S8R8DQ8XeLjWwyXkRTzA'
}).addTo(mymap);