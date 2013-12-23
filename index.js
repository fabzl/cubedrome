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
	IO_CONNECT			:	"connection",
	IO_DISCONNECT		:	"disconnect",
	REQUEST_FORM_DATA	:	"requestFormData",
	SAVE_FORM_DATA		:	"saveFormData",
	REGISTER_USER		:	"registerUser"
};





//-----------------------------------------------------------------------------//
// private vars
//-----------------------------------------------------------------------------//


var _mongodb							=	require ("mongodb"),
	_mongoServer						=	null,
	_mongoClient						=	null,
	express								=	require("express"),
	app									=	express(),
	port								=	3700,
	_path								=	require ("path"),
	_io									=	require('socket.io').listen(app.listen(port)),
	_cirrusKey							=	"2bed2b368a970a3c0bdd7116-5d3d9fb4c37f",	
	_userIDArray 						= 	[],
	_nickNameArray						=	[],
	_firstNameArray 					=	[],
	_lastNameArray						=	[],
	countryArray						=	[],
	emailArray							=	[],
	cirruIDArray						=	[],
	sexArray							=	[],
	dateOfBirthArray					=	[],
	blackOrWhiteArray					=	[],
	confirmedUserArray					=	[],
	goldCubesArray						=	[],
	colorModeArray 						= 	[],
	scoreArray							=	[],
	countryFilterArray					= 	[],
	itemsArray							=	[],
	reportedArray						=	[],
	penaltyOn							=	[],
	usersConnected 						=	0,term
	schema								=	require("./schema"),
	db									= 	require('./db');
	



//console.log("Listening on port " + port);

db.connect ();
app.configure (expressConfiguration);
app.use(express.static(__dirname + '/public'));



function expressConfiguration ()
{
	app.use (express.static (_path.join (__dirname, "public")));
	
	// respond to web GET requests with the index.html page:
	app.get ("/", routeRequestToindex);
					 
	function routeRequestToindex (req, res)
	{
		res.sendfile (__dirname + "/index.html");
	}
}



_io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome to the chat' });
	socket.on('send', function (data) {
		console.log(data);
		_io.sockets.emit('message', data);
	});
});




// socket lconnection listeners 
_io.sockets.on (SocketEvent.IO_CONNECT, socketIOConnectionHandler);
_io.sockets.on (SocketEvent.IO_DISCONNECT, socketIODisonnectHandler);



// Connect to the db.
/*
_mongoClient = new _mongodb.MongoClient (_mongoServer);
_mongoClient.open (mongoClientConnectHandler);
*/

//console.log(schema);
//var record  = new schema(




function socketIOConnectionHandler (socket)
{
	console.log ("Server:: [socketIOConnectionHandler]");
	
	usersConnected ++;

	// socket.emit (SocketEvent.IO_CONNECT);
	socket.on (SocketEvent.REGISTER_USER, saveFormDataHandler);
	//socket.on (SocketEvent.REQUEST_FORM_DATA, requestFormDataHandler);
	//socket.on (SocketEvent.SAVE_FORM_DATA, saveFormDataHandler);
}

function socketIODisonnectHandler (socket)
{
	console.log ("Server:: [socketIODisonnectHandler]");


	usersConnected --;
	
	// socket.emit (SocketEvent.IO_DISCONNECT);
}

function requestFormDataHandler (formID, callback)
{
	console.log ("Server:: [requestFormDataHandler]");

	_formsCollection.find ({formID:id}).toArray (toArrayHandler);

	function toArrayHandler (err, arr)
	{
		callback (arr);
	}
}



function saveFormDataHandler (data)
{
	console.log ("Server:: [saveFormDataHandler]");
	
	var	formID = data.formID,
		callback = data.callback;
	
	checkIfFormDataExists (formID);
}

function checkIfFormDataExists (formID)
{
	console.log ("[checkIfFormDataExists]");
				 
	_formsCollection.find ({formID:formID}).toArray (formDataCollectionHandler);
	
	function formDataCollectionHandler (err, arr)
	{
		if (err)
		{
			// TODO : notify user and return;
			console.log ("[formDataCollectionHandler] error: " + err);
		}
		
		if (arr[0] === undefined)
		{
			console.log ("[formDataCollectionHandler] arr[0] is undefined, adding data to db...");
			addFormDataToDB (data);
		}
		else
		{
			// TODO: create the updateFormData method.
			// updateFormData (formID)
		}
	}
}

function addFormDataToDB (data)
{
	console.log ("[addPlayerToDB] writing name " + playerName + " to db...");
	
	var formDataStructureVO = _jsonStructureData.createFormDataStructureVO (data);
	_formsCollection.insert (formDataStructureVO, formDataInsertHandler);
}

function formDataInsertHandler (err, doc)
{
	if (!err)
	{
		console.log ("[formDataInsertHandler] document added to db:");
		console.dir (doc);
	}
}


/* for using jade


var io = require('socket.io').listen(app.listen(port));

console.log("Listening on port " + port);

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
	res.render("page",{});

});
*/


// expose app
exports = module.exports;
