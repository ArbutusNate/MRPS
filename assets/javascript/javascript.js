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
      wins++
      $('#player2score').text(wins)
      database.ref('players/player2').set({
        name: newplayer,
        choice: '...',
        wins: wins
      })
    }
    postCompareReset()
    console.log('P2 wins.')
    database.ref('players/player2').get(function(snapshot){
      var winUpdate = snapshot.wins
      $('#player2score').text(winUpdate)
    })
    $('.choicebtn').attr('disabled', false)
  }

  function p1Wins(){
    if(myChoice === tempp1){
      wins++
      database.ref('players/player1').set({
        name:newplayer,
        choice: '...',
        wins: wins
      })
    }
    postCompareReset()
    database.ref('players/player1').get(function(snapshot){
      var winUpdate = snapshot.wins
      $('#player1score').text(winUpdate)
    })
    console.log('P1 wins.')
    $('.choicebtn').attr('disabled', false)
  }

  function comparer(){
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

// Listeners
  // Listen for new players
    var player1Check = database.ref('players/player1')
    player1Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        $('.phead1')
          .text('Click to Join')
          .addClass('joingame')
        $('#player1score').text('0')
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead1').text(tempPlayerCheck.name)
      }
    })

    var player2Check = database.ref('players/player2')
    player2Check.on('value', function(snapshot){
      if(snapshot.exists() === false){
        $('.phead2').text('Click to Join')
      } else {
        var tempPlayerCheck = snapshot.val()
        $('.phead2')
            .text(tempPlayerCheck.name)
            .addClass('joingame')
        $('#player2score').text('0')
      }
    })

  // Listen for both choices
    var choiceCheck = database.ref('gameplay/picked')
    choiceCheck.on('value', function(snapshot){

      // When 1 is picked
        if(snapshot.val() === 1){
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

      // When 2 are picked - Do all the logic
        if(snapshot.val() === 2){
          setTimeout(comparer, 2000)
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

    });
  
  // Choice Click
    $('.choicebtn').on('click', function(){
      tempChoiceName = $(this).attr('data-name')
      myChoice = $(this).attr('data-name')
      $('.choicebtn').attr('disabled', true)
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