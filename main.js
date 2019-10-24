/**
 * Shashank Rammoorthy's submission for the ClickTime Intern Challenge. I use the webStorage and geolocation APIs, 
 * and some hacky HTML Table tricks to render the stopwatch and history table. 
 */



var table = document.getElementById("history_table");

if (localStorage.getItem('table')){
    table.innerHTML = localStorage.getItem('table');
    console.log('found locally stored table!');
} else {
    reset();
}

var row;
var startTime = -1; 

var timer = document.getElementById("timer");
var cellCurrentLat, cellCurrentLong;


if (localStorage.getItem('startTime')){
    // set button to stop, set startTime to locally-stored startTime
    startTime = localStorage.getItem('startTime');
    timer.innerHTML = "Stop";
}

function getLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        cellCurrentLat.innerHTML = 'Your browser does not support geolocation!';
    }
}

function showPosition(position) {
    cellCurrentLat.innerHTML = (position.coords.latitude).toFixed(2); 
    cellCurrentLong.innerHTML = position.coords.longitude.toFixed(2); 
    // hacky way to 'store the table' offline - only saving HTML instead of a JSON array or whatever
    localStorage.setItem('table', table.innerHTML);
}

function reset(){
    // setting table to only its header
    table.innerHTML = `<tr><th>Start time</th>
    <th>Lat</th>
    <th>Long</th>
    <th>Stop time</th>
    <th>Lat </th>
    <th>Long </th>
    <th>Total time elapsed</th></tr>`; 
    localStorage.setItem('table', table.innerHTML); //deleting the table
    timer.innerHTML = "Start";

}

function formatTime(time){
    if (time < 10){
        return "0" + time;
    } 
    return time;
}

function dateString(currentDate){
    var hours = formatTime(currentDate.getHours());
    var minutes = formatTime(currentDate.getMinutes());
    var seconds = formatTime(currentDate.getSeconds());
    var datetime = hours + ":"  
        + minutes + ":" 
        + seconds + " ("
        + (currentDate.getMonth()+1)  + "/" 
        + currentDate.getDate() + "/"
        + currentDate.getFullYear() + ")"; // fix formatting so single digit-numbers show up as "0n"
    return datetime;
}

function displayTime(timeElapsed){
 

    timeElapsed /= 1000;
        
    var minutesStop = "00:"; // I love how JS doesn't care about types in declaration
    var hoursStop = "00:";
    var secondsStop = Math.round(timeElapsed);
    
    if (secondsStop > 60){
        // display minutes instead/as well
        minutesStop = Math.round(timeElapsed/60);
        console.log(minutesStop + " minutes")
        secondsStop -= 60*minutesStop;
    
        if (minutesStop > 59){
            hoursStop = Math.round(timeElapsed/3600) + ":"; // might introduce some error?
            minutesStop -= 60*hoursStop; 
            hoursStop += ":"
            console.log("hours set")
        }
    
        minutesStop += ":"

    }

    return (hoursStop) + (minutesStop) + formatTime(secondsStop); // find a way to format hours and minutes properly

}

function addEntry() {

    var state = timer.innerHTML;
    
    var currentDate = new Date(); 
    var datetime = dateString(currentDate);
    
    if (state == "Start"){
        
        row = table.insertRow(1); // just store the id of this row
        row.id = "myRow" + Math.random()*10;
        localStorage.setItem('rowID', row.id);
        var cellStartTime = row.insertCell(0);
        cellCurrentLat = row.insertCell(1);
        cellCurrentLong = row.insertCell(2);

        cellStartTime.innerHTML = datetime; 
        getLoc(); // calls the getLoc function to enable geolocation to be updated 
        timer.innerHTML = "Stop";
        startTime = currentDate;
        localStorage.setItem('startTime', currentDate.getTime());
        console.log("set local startTime as " + startTime)
    }
    if (state == "Stop"){
        console.log("trying to stop")
        rowID = localStorage.getItem('rowID');
        row = document.getElementById(rowID);
        var cellStopTime = row.insertCell(3);
        cellCurrentLat = row.insertCell(4);
        cellCurrentLong = row.insertCell(5);
        var totalTime = row.insertCell(6);
        cellStopTime.innerHTML = datetime; 
        getLoc() // same purpose as in the "Start" branch
        if(startTime == -1) startTime = new Date(localStorage.getItem('startTime'));

        console.log("got local startTime as " + startTime)
        console.log("currentDate is " + currentDate)
        var timeElapsed = currentDate - startTime;

        totalTime.innerHTML = displayTime(timeElapsed); 
        localStorage.removeItem('startTime');
        timer.innerHTML = "Start"; // keeps switching
    }
  
}