

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyANLsaZF51MtrSJnXp_4awWK6T7y7Myk9s",
    authDomain: "rps-game-e20ff.firebaseapp.com",
    databaseURL: "https://rps-game-e20ff.firebaseio.com",
    projectId: "rps-game-e20ff",
    storageBucket: "rps-game-e20ff.appspot.com",
    messagingSenderId: "911721111513"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  let currentTime = moment();
    console.log(currentTime);

let destination = "";
let trainName = "";
let frequency = 0;
let firstArrival = "";
let rowNumber = 0;
  $("#submit").on("click", function(event){
    event.preventDefault();

    destination = $("#destination").val().trim();
    trainName =$("#trainName").val().trim();
    frequency = $("#frequency").val().trim();
    firstArrival = $("#firstArrival").val().trim();

    database.ref("Trains/").push({
        destination: destination,
        trainName: trainName,
        frequency: frequency,
        firstArrival: firstArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    })
    // removing values from the form after submit
    $("#destination").val("");
    $("#trainName").val("");
    $("#frequency").val("");
    $("#firstArrival").val("");
  });



// watches our database for updates
  database.ref("Trains/").on("child_added", function(childSnapshot){
    let newFirstTime = moment(childSnapshot.val().firstArrival, "HH:mm").subtract(1, "days");
    console.log(newFirstTime);
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    let diffTime = moment().diff(moment(newFirstTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    let tRemainder = diffTime % childSnapshot.val().frequency;
    console.log(tRemainder);
    rowNumber ++;
    console.log(rowNumber);
    let minutesTillTrain = childSnapshot.val().frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

    // Next Train
    let nextTrain = moment().add(minutesTillTrain, "minutes");
    let nextArrival =  moment(nextTrain).format("hh:mm");
     
    // Puts our train data on to our table
     
    $("#trainTable").append("<tr> <th scope='row'>" +rowNumber+ "</th><td> "+childSnapshot.val().destination +
    "</td><td>"+ childSnapshot.val().trainName + 
    "</td><td>"+ childSnapshot.val().frequency +
    "</td><td>" + nextArrival + 
    "</td><td>" + minutesTillTrain + "</td>")

  });


//  Changes our html to reflect when a train was added
// database.ref("Trains/").orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
 
//     $("#name-display").text(snapshot.val().name);
//     $("#email-display").text(snapshot.val().email);
//     $("#age-display").text(snapshot.val().age);
//     $("#comment-display").text(snapshot.val().comment);
//   });