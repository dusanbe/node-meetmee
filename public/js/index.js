var socket = io();



function sendLocation () {
    console.log('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('newUserLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            console.log('New users location succesfully sent!');
        });
    }, function () {
        alert('Unable to fetch location.')
    });
};

socket.on('locationsUpdate', function (locationsArray) {
    displayLocations(locationsArray);
});

var mymap = L.map('mapid');

function displayLocations (locationsArray) {
    console.log('Displaying locations...');

    //modifyLocationsArray(locationsArray);

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
    });
};

// function modifyLocationsArray (locationsArray) {
//     locationsArray.forEach(element => {
//         element.latitude += Math.random();
//         element.longitude += Math.random();
//     })
// }

// function getViewCoord (locationsArray) {
//     var centerCoordLat = 0;
//     var centerCoordLon = 0;

//     locationsArray.forEach(function (element) {
//         centerCoordLat += element.latitude;
//         centerCoordLon += element.longitude;
//     })

//     return [centerCoordLat / locationsArray.length, centerCoordLon / locationsArray.length];
// };

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZHVzYW5iZSIsImEiOiJjamw1ZGl5Y3EwZ2syM3Bxa2t3OW9nYTd1In0.I5S8R8DQ8XeLjWwyXkRTzA'
}).addTo(mymap);

// var marker1 = L.marker([51.5, -0.09]).addTo(mymap);
// var marker2 = L.marker([51.51, -0.09]).addTo(mymap);

// marker1.bindPopup("<b>User1</b><br>I'm there in 5 min... Don't know whether you'll wait for me?").openPopup();