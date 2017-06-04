  // Set the configuration for your app
  var fbconfig = {
    apiKey: "AIzaSyA8w-lQipqm-Ccbu7OB6w10TSL0XuWl9os",
    authDomain: "mrps-bf4df.firebaseapp.com",
    databaseURL: "https://MRPS.firebaseio.com",
    storageBucket: "mrps-bf4df.appspot.com"
  };
  firebase.initializeApp(fbconfig);

  // Get a reference to the database service
  var database = firebase.database();