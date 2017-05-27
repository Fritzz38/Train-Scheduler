 var config = {
    apiKey: "AIzaSyBgCNF4D1gArVAFH6_UMKKvcXxJqS_nK7U",
    authDomain: "train-info-d7f7c.firebaseapp.com",
    databaseURL: "https://train-info-d7f7c.firebaseio.com",
    //projectId: "train-info-d7f7c",
    storageBucket: "train-info-d7f7c.appspot.com",
    //messagingSenderId: "496562431109"
  };

   firebase.initializeApp(config);
    
   var database = firebase.database();

   database.ref().on("child_added", function(snapshot) {
  
   var name = snapshot.val().trainName;
   var dest = snapshot.val().destination;
   var first = snapshot.val().firstTrainTime;
   var freq = snapshot.val().frequency;

   // First Time (pushed back 1 year to make sure it comes before current time)
   var firstTimeConverted = moment(first, "hh:mm").subtract(1, "years");
   console.log(firstTimeConverted);

   // Current Time
   var currentTime = moment();
   console.log("Current Time: " + moment(currentTime).format("hh:mm"));

   // Difference between the times
   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
   console.log("Difference In Time: " + diffTime);

   // Time apart (remainder)
   var remainder = diffTime % freq;
   console.log(remainder);

   // Minute Until Train
   var minAway = freq - remainder;
   console.log("Minutes Away: " + minAway);

   // Next Train
   var nextTrain = moment().add(minAway, "minutes");
   console.log("Next Arrival: " + moment(nextTrain).format("hh:mm"));

   $("#trainTable > tbody").prepend("<tr><td>" + name + "</td><td>" + dest  + 
        "</td><td>" + freq + "</td><td>" + moment(nextTrain).format("hh:mm A") + "</td><td>" + minAway + 
        "</td>");

      // If any errors are experienced, log them to console.
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });




    // Click Button changes what is stored in firebase
    $("#submit").on("click", function(event) {
      // Prevent the page from refreshing
      event.preventDefault();

      // Get inputs
      name = $("#train-name-input").val().trim();
      dest = $("#destination-input").val().trim();
      first = $("#firstTrain-time-input").val().trim();
      freq = $("#frequency-input").val().trim();

      console.log(name);
      console.log(dest);
      console.log(first);
      console.log(freq);

      // Change what is saved in firebase
      database.ref().push({
        trainName: name,
        destination: dest,
        firstTrainTime: first,
        frequency: freq
      });

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-time-input").val("");
    $("#frequency-input").val("");

      //return false;
    });
