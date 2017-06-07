// Variables
  var playernum = 0;
  var mydbindex = 0;
  var playercountlocal = 0;
  var newplayer = "";
// Firebase Setup
  var fbconfig = {
    apiKey: "AIzaSyA8w-lQipqm-Ccbu7OB6w10TSL0XuWl9os",
    authDomain: "mrps-bf4df.firebaseapp.com",
    databaseURL: "https://mrps-bf4df.firebaseio.com",
    storageBucket: "mrps-bf4df.appspot.com"
  };
  firebase.initializeApp(fbconfig);
  var database = firebase.database();
// Listeners
  // Listen for changes in playercount
    var playerChange = database.ref('variables/playercount');
    playerChange.on('value', function(snapshot) {
      playercountlocal = snapshot.val();
      console.log("New playerCount from firebase: " + snapshot.val());
      database.ref('users/' + playercountlocal + '/username').once('value').then(function(snapshot){
        $('.phead' + playercountlocal).text(snapshot.val())
        });
      // $(".phead" + playercountlocal).text();
    });
  // OnDisconnect
    database.ref('users/' + mydbindex).onDisconnect().remove().then(function(){
      debugger;
      if(playercountlocal > 0){
      playernum--;
      database.ref('variables/playercount').set(playernum);
      };
    });

// Functions
  function writeUserData(playername) {
    console.log("New user data added.")
    database.ref('users/' + playernum).set({
      username: playername,
      wins: 0,
    });
  };
  function getPlayerCount() {
    database.ref('variables').once('value').then(function(snapshot){
        playernum = snapshot.val().playercount;
        mydbindex = playernum
        playernum++;
        writeUserData(newplayer);
        setPlayerCount();
        $(".phead" + playernum).text(newplayer);
        if (playernum === 1){
          console.log("First Player has joined the game. playernum = " + playernum)
          database.ref('users/1').once('value').then(function(snapshot){
            var tempname = snapshot.val();
          });
        }
        if (playernum === 2){
          console.log("Second Player has joined the game. playernum = " + playernum)
          database.ref('users/1/username').once('value').then(function(snapshot){
            var tempname = snapshot.val()
            $('.phead1').text(tempname);
          })
        }
        if (playernum >= 3){
          console.log("Observer has joined the game.")
        }
    });
    // console.log("playernum via getPlayerCount is" + playernum)
  };
  function setPlayerCount() {
    database.ref('/variables').set({
    playercount: playernum
    });
  };
// Event Handlers
  // Join Game Click
    $(document).on("click", ".joingame", function(){
      // Set Variables
        newplayer = ($("#addname").val().trim());
      // Firebase Calls
        getPlayerCount();
        // DOM controls
        $(".signin").hide();
        $(".gameon").show();
    });







// Listener Example
  // var playerChange = database.ref('variables/playercount');
  // playerChange.on('value', function(snapshot) {
  //   playercount = snapshot.val();
  //   console.log(snapshot.val());
  // });

// Retrieve data example
  // var starCountRef = database.ref('posts/' + postId + '/starCount');
  // starCountRef.on('value', function(snapshot) {
  //   updateStarCount(postElement, snapshot.val());
  // });

// Write data example
  // function writeUserData(userId, name, email, imageUrl) {
  //   database.ref('users/' + userId).set({
  //     username: name,
  //     email: email,
  //     profile_picture : imageUrl
  //   });
  // }