var config = {
    apiKey: "AIzaSyCsiX8JKnqEZ3VpCUgEwbZqIZcxG42f1OM",
    authDomain: "trainschedule-ff62e.firebaseapp.com",
    databaseURL: "https://trainschedule-ff62e.firebaseio.com",
    projectId: "trainschedule-ff62e",
    storageBucket: "",
    messagingSenderId: "614012313278"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});


$("#add-train").on("click", function() {

  
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#train-time").val().trim();
  frequency = $("#frequency").val().trim();
  
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  
  var tRemainder = diffTime % frequency;
 
  var minutesAway = frequency - tRemainder;

  var nextTrain = moment().add(minutesAway, "minutes");
 
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
  }

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  alert("Form submitted!");

  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
  
  return false; 
});


  database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {


    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("==============================");


  
  $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
    "</td></tr>");

  index++;


  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

 

  console.log(trainIDs);

