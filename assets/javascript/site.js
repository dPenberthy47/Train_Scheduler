 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCcp8t0p8vrhK0OutWZSBlG0E6C0S749Uc",
    authDomain: "trainscheduler-d275e.firebaseapp.com",
    databaseURL: "https://trainscheduler-d275e.firebaseio.com",
    projectId: "trainscheduler-d275e",
    storageBucket: "trainscheduler-d275e.appspot.com",
    messagingSenderId: "352325091240"
};
firebase.initializeApp(config);

var database = firebase.database();

    var train = {
      name: "",
      destination: "",
      frequency: 0,
      firstTrain: 0,
      nextArrivalTime: 0,
      minutesAway: "",
    }

    $(document).ready(function() {

        $("#submit").on("click", function(event) {
            event.preventDefault();
   
            train.name = $("#trainName").val().trim();
            train.destination = $("#destination").val().trim();
            train.frequency = $("#frequency").val().trim();
            train.firstTrain = $("#firstTrain").val().trim();

            var times = getTimes(train.firstTrain, train.frequency);

            train.nextArrivalTime = times[0];
            train.minutesAway = times[1];

            database.ref().push({
                name: train.name,
                destination: train.destination,
                frequency: train.frequency,
                firstTrain: train.firstTrain,
                nextArrivalTime: train.nextArrivalTime,
                minutesAway: train.minutesAway,
            });

            $("#trainName").val("");
            $("#destination").val("");
            $("#frequency").val("");
            $("#firstTrain").val("");
        });

        database.ref().on("child_added", function(snapshot) {  
        //Create table row
            var data = snapshot.val();

            $(tableBody).append(
                "<tr class='tableRow'>" +
                "<td class='tableCell'>" + data.name + "</td>" +
                "<td class='tableCell'>" + data.destination + "</td>" +
                "<td class='tableCell'>" + data.frequency + "</td>" +
                "<td class='tableCell'>" + data.nextArrivalTime + "</td>" +
                "<td class='tableCell'>" + data.minutesAway + "</td>" +
                "</tr>"
            );
        });
    });

    function getTimes(firstTrain, frequency) {
        var times = []; //create an array to hold the times

        //stuff
        var firstTime = moment(firstTrain, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTime), "minutes");
        var Remainder = diffTime % frequency;
        var minutesAway = frequency - Remainder;
        var nextTrain = moment().add(minutesAway, "minutes");

        //populate array
        times.push(moment(nextTrain).format("hh:mm")); //index 0
        times.push(minutesAway); // index 1

        return times //return the array with next train and minutes untill
    };