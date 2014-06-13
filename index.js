//-----------------------------------------------------------------------------//
// EVENT CONSTANTS
//------------------

// Events we will emit with socket.io.
// These should also be defined on the client side for consistency.
var ServerEvent =
{
	DB_RESULT_SUCCESS :	"dbResultSuccess"
};


// Events we will listen for from socket.io.
var SocketEvent =
{
	IO_CONNECT				:	"connection",
	IO_DISCONNECT			:	"disconnect",
	REGISTER_USER			:	"registerUser",
	REGISTER_USER_ID		:	"registerUserID",
	POPULATE_LIST_HEADER	: 	"populateListHeader",
	USER_JOINED           :   "userJoined",
    USER_LEFT             :   "userLeft",
    USER_TYPING           :   "typing",
    USER_STOP_TYPING      :   "stopTyping"
};

//-----------------------------------------------------------------------------//
// required modules & important stuff
//-----------------------------------------------------------------------------//

var _mongodb							=	require ("mongodb"),
	express								=	require("express"),
	app									=	express(),
	port								=	3700,
	_path								=	require ("path"),
	_io									=	require('socket.io').listen(app.listen(port))


//-----------------------------------------------------------------------------//
// required dependecies
//-----------------------------------------------------------------------------//

var	UserSchema								=	require("./schema"),
	db										=	require('./db');



//-----------------------------------------------------------------------------//
// logic private vars
//-----------------------------------------------------------------------------//
var _userName							=	[],
	_mainUserDictionary					=	{},
	usersConnected						=	0;




function init()
{

	addSocketListeners();

	//db stuff
	//db.connect();
	//exports = module.exports;

	// sending the index.html
	console.log("Listening on port " + port);
	app.configure(expressConfiguration);
	app.use(express.static(__dirname + '/public'));

}


function addSocketListeners()
{
	// socket connection listeners
	_io.sockets.on (SocketEvent.IO_CONNECT, socketIOConnectionHandler);
	_io.sockets.on (SocketEvent.IO_DISCONNECT, socketIODisconnectHandler);

}


function expressConfiguration ()
{

	app.use(express.static (_path.join (__dirname, "public")));

	// respond to web GET requests with the index.html page:
	app.get ("/", routeRequestToindex);

}

function routeRequestToindex (req, res)
{
		res.sendfile (__dirname + "/index.html");
		console.log("IM RUNNNING");
}

_io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome to the chat' });
	socket.on('send', function (data) {
		console.log(data);
		_io.sockets.emit('message', data);
	});
});



  // Socket events

  // Whenever the server emits 'login', log the login message
  _io.sockets.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat &mdash; ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });



function socketIOConnectionHandler (socket)
{
	console.log ("Server:: [socketIOConnectionHandler]");

	usersConnected ++;

	socket.emit (SocketEvent.IO_CONNECT);
	socket.on (SocketEvent.REGISTER_USER, storeUser);
	socket.on (SocketEvent.IO_DISCONNECT, socketIODisconnectHandler);
	//socket.on (SocketEvent.USER_JOINED, userJoined);
	//socket.on (SocketEvent.USER_LEFT, userLeft);
	//socket.on (SocketEvent.USER_TYPING, userTyping);
	//socket.on (SocketEvent.USER_STOP_TYPING, userStopTyping);

	var user = {

		username 	: "",
		userID 		: socket.id,
		socket 		: socket,
		lat 		: undefined,
		lon 		: undefined,
		nearbyUsers : [],
		bannedUsers : [],

	}
	_mainUserDictionary[socket.id] = user;
    socket.emit(SocketEvent.REGISTER_USER_ID, { userID : socket.id });

}


function socketIODisconnectHandler (socket)
{
	console.log ("Server:: [socketIODisonnectHandler]");

	usersConnected --;
	if(_mainUserDictionary[socket.id]) {
		delete _mainUserDictionary[socket.id];
	//	updateUserInfo(_mainUserDictionarysocket.id);
		socket.broadcast.emit(SocketEvent.USER_LEFT);
	}

	// socket.emit (SocketEvent.IO_DISCONNECT);
}


function createUsersList(activeUser) {


	//console.log("createUsersList")
	var distanceArray = [];

	for (user in _mainUserDictionary) {

		//console.log(user);
		var distance = getDistanceFromLatLonInKm(	activeUser.lat,
													activeUser.lon,
													_mainUserDictionary[user].lat*Math.random(),
													_mainUserDictionary[user].lon*Math.random());

		//console.log("user: "+_mainUserDictionary[user].username);
		//	console.log("posi" ,activeUser.lat,activeUser.lon,_mainUserDictionary[user].lat,	_mainUserDictionary[user].lon);

		var userDetails = {

			userID 			: _mainUserDictionary[user].userID,
			username		: _mainUserDictionary[user].username,
			distanceArray	: distance
		}
		if ( activeUser.userID != userDetails.userID ) {
			distanceArray.push(userDetails);
		}
	}

	activeUser.nearbyUsers = distanceArray.sort(function(b, a) {

		return a.distance - b.distance;
	});

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



function storeUser(data) {

	var user = 	_mainUserDictionary[data.userID];
	user.username = data.username;
	user.lat = data.userlatitude;
	user.lon = data.userlongitude;



	updateUserInfo(user);


}


function updateUserInfo(user) {

	createUsersList(user);
	sendUserData(user);

}



function sendUserData (user) {

	//console.log("sendUserData");
	//console.log(user.socket);
	//console.log("______");


	//user.socket.broadcast.emit(SocketEvent.USER_JOINED, {



	//});

	// for(var i ; i < user.nearByUsers.length ; i ++  ) {

	// 	_mainUserDictionary(user.nearbyUsers[i].userID).socket.emit(SocketEvent.USER_JOINED,{

	// 		userID 		: user.userID,
	// 		username 	: user.username,
	// 		distance
	// 	})

	// }


	user.socket.emit(SocketEvent.POPULATE_LIST_HEADER, {


		username 		: user.username,
		userID 			: user.userID,
		usersConnected	: usersConnected,
		nearbyUsers 	: user.nearbyUsers,
	});
}




// this starts everything.
init();


