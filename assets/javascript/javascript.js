// Variables
  var newplayer = ''
  var playerNum = 0
  var mywins = 0
  var theirwins =0
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
    // database.ref('gameplay/picked').once('value', function(snapshot){
    //   if(snapshot.val() )
    // })
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
     $('.choicebtn').attr('disabled', false)
  }

  function winner(z){
    debugger;
    database.ref('players/player' + z).once('value').then(function(snapshot){
      var tempWinner = snapshot.val().wins
      console.log('player ' + z + 'wins. Previous wincount = ' + tempWinner)
      tempWinner++
      console.log('new score for player' + z)
      $('#player' + z + 'score').text(tempWinner)
      if(playerNum === z){
        database.ref('players/player' + z).update({
          wins: tempWinner
        })
      }
      postCompareReset()    
    })
  }

  function comparer(){
    database.ref('players/player1/choice').once('value').then(function(snap1){
      tempp1 = snap1.val()
      database.ref('players/player2/choice').once('value').then(function(snap2){
        tempp2 = snap2.val()
        if(tempp1 === tempp2){
          console.log("tempp1: " + tempp1 + ". Tempp2: " + tempp2 + ". It's a tie")
          postCompareReset()
        }
        if((tempp1 === 'rock' && tempp2 === 'paper') || (tempp1 === 'paper' && tempp2 === 'scissors') || (tempp1 === 'scissors' && tempp2 === 'rock')){
          console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
          // p2Wins()
          // pZWins()
          winner(2)
        }
        if((tempp1 === 'rock' && tempp2 === 'scissors') || (tempp1 === 'paper' && tempp2 === 'rock') || (tempp1 === 'scissors' && tempp2 === 'paper')){
          console.log('Player 1 chooses: ' + tempp1 + '. Player 2 chooses: ' + tempp2 + '.')
          // p1Wins()
          winner(1)
        }
        })
      })
    }

  function playerStart(x){
    $('#p' + x + 'box').addClass('active')
    database.ref('players/player' + x).set({
      name: newplayer,
      choice: '...',
      wins: 0
    })
      $('.phead' + x).text(newplayer)
      database.ref('gameplay').set({
        picked: 0
      })
      var ref = database.ref('players/player' + x)
      ref.onDisconnect().remove()
  }

  function newPlayerListener(y){
    $('.phead' + y)
      .text('Click to Join')
      .addClass('joingame')
    $('#player' + y + 'score').text('0')
  }

// Listeners
  // Listen for new players
    var player1Check = database.ref('players/player1')
    player1Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        var temp = 1
        newPlayerListener(temp);
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead1')
            .text(tempPlayerCheck.name)
        // $('#player1score')
        //     .text(tempPlayerCheck.wins)

            // .addClass('joingame')
      }
    })

    var player2Check = database.ref('players/player2')
    player2Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        var temp = 2
        newPlayerListener(temp)
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead2')
            .text(tempPlayerCheck.name)
        // $('#player2score')
        //     .text(tempPlayerCheck.wins)
            // .addClass('joingame')
        // $('#player2score').text('0')
      }
    })

  // Listen for both choices
    var choiceCheck = database.ref('gameplay/picked')
    choiceCheck.on('value', function(snapshot1){

      // When 1 is picked
        if(snapshot1.val() <= 2 && snapshot1.val() != 0){
          var choiceCheck2 = database.ref('players/player1')
          choiceCheck2.once('value', function(snapshot2){
            var choiceCheckp1 = snapshot2.val().choice
            var choiceCheck3 = database.ref('players/player2')
            choiceCheck3.once('value', function(snapshot3){
              var choiceCheckp2 = snapshot3.val().choice
                if(choiceCheckp1 != '...'){
                  $('.waiting1').show()
                } else {
                  $('.waiting1').hide()
                }
                if(choiceCheckp2 != '...')
                  $('.waiting2').show()
            })
          })
        }

      // When 2 are picked - Do all the logic
        if(snapshot1.val() === 2){
          setTimeout(comparer, 2000)
        } else {
          //do nothing
        }
    })

    var scoreCheck = database.ref('players')
    scoreCheck.on('value', function(snapshot){

    })

// Event Handlers

  // Join Game Click
    $(document).on('click', '.joingame', function(event){
      if(playerNum != 1 && playerNum != 2){
        event.preventDefault()

        // DOM controls
          $('.signin').hide()
          $('.gameon').show()

        // Set Variables
          newplayer = ($('#addname').val().trim())

        // Firebase Calls
        database.ref('players/player1').once('value').then(function(snapshot){
          var checkplayer = snapshot.val()
          if(checkplayer === null){
            playerNum = 1
            playerStart(playerNum)
          } else {
            database.ref('players/player2').once('value').then(function(snapshot){
              var checkplayer2 = snapshot.val()
              if(checkplayer2 === null){
                playerNum = 2
                playerStart(playerNum)
              } else{
                // Observers
                playerNum = 3
                var observerRef = database.ref('observers/' + newplayer)
                observerRef.set({
                  name: newplayer
                })
                observerRef.onDisconnect().remove()
              }
            })
          }
        })
      }

    });

  // Choice Click
    $('.choicebtn').on('click', function(event){
      event.preventDefault()
      myChoice = $(this).attr('data-name')
      $('.choicebtn').attr('disabled', true)
      database.ref('players/player' + playerNum + '/choice').once('value').then(function(snapshot){
        if(snapshot.val() == '...'){
          var tempChoiceCheck = snapshot.val()
          database.ref('players/player' + playerNum ).update({
            choice: myChoice
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


// Examples
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
