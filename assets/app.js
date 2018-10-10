// Global Variables
// var trainName = "";
// var trainDestination = "";
// var trainTime = "";
// var trainFrequency = "";
// var nextArrival = "";
// var minutesAway = "";

// // jQuery global variables
// var elTrain = $("#train-name").text();
// var elTrainDestination = $("#train-destination").text();
// // form validation for Time using jQuery Mask plugin
// var elTrainTime = $("#train-time").mask("00:00");
// var elTimeFreq = $("#time-freq").mask("00");


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCsiX8JKnqEZ3VpCUgEwbZqIZcxG42f1OM",
    authDomain: "trainschedule-ff62e.firebaseapp.com",
    databaseURL: "https://trainschedule-ff62e.firebaseio.com",
    projectId: "trainschedule-ff62e",
    storageBucket: "",
    messagingSenderId: "614012313278"
  };
  firebase.initializeApp(config);


// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// Show current time
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


// Capture Button Click
$("#add-train").on("click", function() {

  // Grabbed values from text boxes
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#train-time").val().trim();
  frequency = $("#frequency").val().trim();
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  //console.log("Difference in time: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  //console.log(tRemainder);

  // Minute Until Train
  var minutesAway = frequency - tRemainder;
  //console.log("Minutes away: " + minutesAway);

  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes");
  //console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

  // Arrival time
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
  }

  // Code for handling the push
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

  // Empty text input
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
  
  // Don't refresh the page!
  return false; 
});

// Delete function
// $(document).on("click", ".delete", function(){
//   var confirmDelete = confirm("Are you sure you want to delete this entry?");
  
//    if (confirmDelete){
//     var entry = $(this).attr("data-index");
//     database.ref().child(trainIDs[entry]).remove();
//     location.reload();
//    } else{
//      return false;
//    }
  
// });

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("child_added")
// This will only show the 25 latest entries
  database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {


    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("==============================");


  // Change the HTML to reflect
  $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
   // "<td><button class='delete btn btn-default btn-sm' data-index='" + index + "'><span class='glyphicon glyphicon-trash'></span></button> " + 
   // "<button type='button' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-edit'></span></button>" +
    "</td></tr>");

  index++;

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  //Gets the train IDs in an Array
//   database.ref().once('value', function(dataSnapshot){ 
//     var trainIndex = 0;

//       dataSnapshot.forEach(
//           function(childSnapshot) {
//               trainIDs[trainIndex++] = childSnapshot.key();
//           }
//       );
//   });

  console.log(trainIDs);




// References:
// In class activites: 
// RecentUser_withAllUsers.html
// Train Example