window.onload = function() {


    var SocketEvent =
    {
        REGISTER_USER_ID      :   "registerUserID",
        POPULATE_LIST_HEADER  :   "populateListHeader",
        USER_JOINED           :   "userJoined",
        USER_LEFT             :   "userLeft",
        USER_TYPING           :   "typing",
        USER_STOP_TYPING      :   "stopTyping"

    };

    var messages = [],
    socket = io.connect('http://localhost:3700'),
    field = document.getElementById("field"),
    sendButton = document.getElementById("sendButton"),
    talkButton = document.getElementById("talkButton"),
    content = document.getElementById("content"),
    name = document.getElementById("name"),
    usernameDisplay= document.querySelector(".usernameDisplay"),
    usersConnectedDisplay = document.querySelector(".usersConnectedDisplay"),
    usersList = document.querySelector(".users-list"),
    userlat,
    userlong,
    userName,
    ID;

    //listeners
    socket.on(SocketEvent.REGISTER_USER_ID, getUserID);
    socket.on(SocketEvent.POPULATE_LIST_HEADER, getUserData);
    socket.on('message', function (data) {

    // to send message

    //    console.log(data.message);

        if(data.message) {
            messages.push(data);
            var html = '';

            for(var i=0; i<messages.length; i++) {

            //    console.log(messages[i].message);
            //    console.log(messages[i].username);

                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    // Whenever the server emits 'user joined', log it in the chat body
      socket.on('userJoined', function (data) {
          console.log("user joined : "+data);
            //    addParticipantsMessage(data);
      });

      // Whenever the server emits 'user left', log it in the chat body
      socket.on('userLeft', function (data) {
        console.log("stop typing : "+data);
        //  addParticipantsMessage(data);
        //removeChatTyping(data);
      });

      // Whenever the server emits 'typing', show the typing message
    //  socket.on('typing', function (data) {
       // addChatTyping(data);
   //      console.log("typing : "+data);

 //    });

      // Whenever the server emits 'stop typing', kill the typing message
 //     socket.on('stopTyping', function (data) {
        //removeChatTyping(data);
   //     console.log("stop typing : "+data);
  //    });



    sendButton.onclick = function() {


       console.log("1click");


        if(name.value  === "")
        {
            alert("Please insert your a nickname!");
        } else {

            userName = name.value;
            getLocation();

        }
    };

    function dataExists (field) {

        if(field.value == "") {
            field.value = "please fill"
            return false
        } else {
            return field.value;

        }
    }

    function getLocation() {
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(showPosition);
           } else {
               console.log( "Geolocation is not supported by this browser.");
               userlat =  undefined;
               userlong = undefined;
           }
    }

    function showPosition(position) {

            userlat =  position.coords.latitude;
            userlong = position.coords.longitude;
           // console.log("Geolocation tracked, lat : "+userlat +"lon : "+userlong);
            sendUserDetails();
        }


    function sendUserDetails() {


         socket.emit('registerUser', {  userID: ID,
                                        username: userName,
                                        userlatitude: userlat,
                                        userlongitude: userlong });


    }


    function getUserID (id) {

    //   console.log("ID : "+id.userID);
       ID = id.userID;

    }


    function getUserData(userData) {

        console.dir(userData.nearbyUsers);
        usernameDisplay.innerHTML = userData.username;
        usersConnectedDisplay.innerHTML = "users: "+userData.usersConnected;

       if(userData.nearbyUsers.length != 0 )  {

            for(var i=0 ; i < userData.nearbyUsers.length ; i ++ ) {

                var nearbyUser= document.createElement('li');
                var nearbyUserText = userData.nearbyUsers[i].username;
                console.log("NEARBYYYYYY USERNAME "+nearbyUserText);
                console.log(nearbyUser);
                nearbyUser.appendChild(nearbyUserText);

               //     usersList.appendChild(nearbyUser);
               // usersList.innerHTML=nearbyUser;
            }
        }else {
           console.log("no nearby users");
        }
    }

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on(SocketEvent.USER_JOINED, function (data) {

    console.log(data + ' joined');
  //  userJoined(data);

  });


  // Whenever the server emits 'user left', log it in the chat body
  socket.on(SocketEvent.USER_LEFT, function (data) {
    console.log(data.userID + ' left');
  //  userLeft(data);
   // removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  //socket.on(SocketEvent.USER_TYPING  , function (data) {
    //addChatTyping(data);
 //  console.log();
//  });

  // Whenever the server emits 'stop typing', kill the typing message
 // socket.on(SocketEvent.USER_STOP_TYPING, function (data) {
  // removeChatTyping(data);
  //});




function userJoined (data) {

        console.log("userJoined"+data);


    }
function userLeft(data) {

        console.log("userLeft"+data);

    }



}