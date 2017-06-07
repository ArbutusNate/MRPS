// Variables
  var newplayer = ''
  var playerNum = 0
  var wins = 0
  var myChoice = ''
  var tempp1 = ''
  var tempp2 = ''
// Firebase Setup
  var fbconfig = {
    apiKey: 'AIzaSyA8w-lQipqm-Ccbu7OB6w10TSL0XuWl9os',
    authDomain: 'mrps-bf4df.firebaseapp.com',
    databaseURL: 'https://mrps-bf4df.firebaseio.com',
    storageBucket: 'mrps-bf4df.appspot.com'
  };
  firebase.initializeApp(fbconfig);
  var database = firebase.database();
// Functions
  function postCompareReset(){
    myChoice = ''
    database.ref('gameplay').set({
      picked: 0
     })
     database.ref('players/player1/choice').set(
      '...'
     )
     database.ref('players/player2/choice').set(
      '...'
     )
     myChoice = ''
     $('.bodyimg').hide()    
  }
  function p2Wins(){
    if(myChoice === tempp2){
      debugger;
      wins++
      database.ref('players/player2').set({
        name: newplayer,
        choice: '...',
        wins: wins
      })
      postCompareReset()
    }
    console.log('P2 wins.')
  }
  function p1Wins(){
    if(myChoice === tempp1){
      wins++
      database.ref('players/player1').set({
        name:newplayer,
        choice: '...',
        wins:wins
      })
      postCompareReset()
    }
    console.log('P1 wins.')
  }
// Listeners
  // Listen for disconnect
    database.ref('players/player' + playerNum).onDisconnect().remove()

  // Listen for new players
    var player1Check = database.ref('players/player1')
    player1Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        //do nothing
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead1').text(tempPlayerCheck.name)
      }
    })
    var player2Check = database.ref('players/player2')
    player2Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        //do nothing
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead2').text(tempPlayerCheck.name)
      }
    })

  // Listen for both choices
    var choiceCheck = database.ref('gameplay/picked')
    choiceCheck.on('value', function(snapshot){
      // When 1 is picked
        if(snapshot.val() === 1){
          debugger;
          if(playerNum === 1 && myChoice === ''){
            $('.waiting2').show()
          }
          if(playerNum === 1 && myChoice != ''){
            $('.waiting1').show()
          }
          if(playerNum === 2 && myChoice === ''){
            $('.waiting1').show()
          }
          if(playerNum === 2 && myChoice != ''){
            $('.waiting2').show()
          }
        }
      // When 2 are picked
        if(snapshot.val() === 2){
          $('.removeme').empty()
          database.ref('players/player1/choice').once('value').then(function(snapshot1){
            tempp1 = snapshot1.val()
            database.ref('players/player2/choice').once('value').then(function(snapshot2){
              tempp2 = snapshot2.val()
              if(tempp1 === tempp2){
                console.log("it's a tie")
                postCompareReset()
              }
              if(tempp1 === 'rock' && tempp2 === 'paper'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p2Wins()
              }
              if(tempp1 === 'rock' && tempp2 === 'scissors'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p1Wins()
              }
              if(tempp1 === 'paper' && tempp2 === 'rock'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p1Wins()
              }
              if(tempp1 === 'paper' && tempp2 === 'scissors'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p2Wins()
              }
              if(tempp1 === 'scissors' && tempp2 === 'rock'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p2Wins()
              }
              if(tempp1 === 'scissors' && tempp2 === 'paper'){
                console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
                p1Wins()
              }
            })
          })

        } else {
          //do nothing
        }
    })

// Event Handlers

  // Join Game Click
    $(document).on('click', '.joingame', function(){

      // DOM controls
        $('.signin').hide()
        $('.gameon').show()

      // Set Variables
        newplayer = ($('#addname').val().trim())
        var p1joined = false
        var p2joined = false

      // Firebase Calls
      database.ref('players/player1').once('value').then(function(snapshot){
        var checkplayer = snapshot.val()
        if(checkplayer === null){
          database.ref('players/player1').set({
            name: newplayer,
            choice: '...',
            wins: 0
          })
          $('.phead1').text(newplayer)
          playerNum = 1
        } else {
          database.ref('players/player2').once('value').then(function(snapshot){
            var checkplayer2 = snapshot.val()
            if(checkplayer2 === null){
              database.ref('players/player2').set({
                name: newplayer,
                choice: '...',
                wins: 0
              })
              $('.phead2').text(newplayer)
              playerNum = 2
            } else{
              database.ref('observers').set({
                name: newplayer
              })
            }
          })
        }
      })

    });
  
  // Choice Click
    $('.choicebtn').on('click', function(){
      tempChoiceName = $(this).attr('data-name')
      myChoice = $(this).attr('data-name')
      database.ref('players/player' + playerNum + '/choice').once('value').then(function(snapshot){
        if(snapshot.val() == '...'){
          var tempChoiceCheck = snapshot.val()
          database.ref('players/player' + playerNum).set({
            name: newplayer,
            choice: tempChoiceName,
            wins: wins
          })
          // Increment picked
          database.ref('gameplay').once('value').then(function(snapshot){
            var tempNumber = snapshot.val().picked
            tempNumber++
            database.ref('gameplay').set({
              picked: tempNumber
            })
          })
        } else {
          console.log("You have already picked something.")
        }
      })
    })

        


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
// Old Code
  // var playerChange = database.ref('variables/playercount');
    // playerChange.on('value', function(snapshot) {
    //   playercountlocal = snapshot.val();
    //   console.log('New playerCount from firebase: ' + snapshot.val());
    //   database.ref('users/' + playercountlocal + '/username').once('value').then(function(snapshot){
    //     $('.phead' + playercountlocal).text(snapshot.val())
    //     });
    // });
  // OnDisconnect
  // database.ref('users').on('value', function(snapshot){
  //     debugger;
  //     function updateplayercount() {
  //     var newcount = Object.keys(snapshot.val()).length;
  //     // debugger;
  //     database.ref('variables/playercount').set({
  //       playercount: newcount
  //     });
  // }
  // });


    // database.ref('users/' + mydbindex).onDisconnect().remove().then(function(){
    //   debugger;
    //   if(playercountlocal > 0){
    //   playernum--;
    //   database.ref('variables/playercount').set(playernum);
    //   };
    // });
  // Functions
  // function writeUserData(playername) {
  //   debugger;
  //   console.log('New user data added.')
  //   database.ref('users/' + playernum).set({
  //     username: playername,
  //     wins: 0,
  //   });
    // database.ref('variables/totalplayercount').once('value').then(function(snapshot){
    //   var temptotalplayers = snapshot.val();
    //   temptotalplayers++;
    //   debugger;
    //   database.ref('/variables/totalplayercount').set({
    //     totalplayercount: temptotalplayers
    //   })
    // })
  // };
  // function getPlayerCount() {
  //   database.ref('variables').once('value').then(function(snapshot){
  //       playernum = snapshot.val().playercount;
  //       mydbindex = playernum
  //       playernum++;
  //       debugger;
  //       writeUserData(newplayer);
  //       setPlayerCount();
  //       $('.phead' + playernum).text(newplayer);
        // if (playernum === 1){
        //   console.log('First Player has joined the game. playernum = ' + playernum)
        //   database.ref('users/1').once('value').then(function(snapshot){
        //     var tempname = snapshot.val();
        //   });
        // }
        // if (playernum === 2){
        //   console.log('Second Player has joined the game. playernum = ' + playernum)
        //   database.ref('users/1/username').once('value').then(function(snapshot){
        //     var tempname = snapshot.val()
        //     $('.phead1').text(tempname);
        //   })
        // }
        // if (playernum >= 3){
        //   console.log('Observer has joined the game.')
        // }
    // });
  // };
  // function setPlayerCount() {
  //   database.ref('/variables').set({
  //   playercount: playernum
  //   });
  // };