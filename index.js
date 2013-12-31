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
// required modules & important stuff 
//-----------------------------------------------------------------------------//

var _mongodb							=	require ("mongodb"),
	express								=	require("express"),
	app									=	express(),
	port								=	3700,
	_path								=	require ("path"),
	_io									=	require('socket.io').listen(app.listen(port)),
	_cirrusKey							=	"2bed2b368a970a3c0bdd7116-5d3d9fb4c37f",
	_mongoServer						=	null,
	_mongoClient						=	null;


//-----------------------------------------------------------------------------//
// required dependecies
//-----------------------------------------------------------------------------//

var	schema								=	require("./schema"),
		db								=	require('./db');
	


//-----------------------------------------------------------------------------//
// logic private vars
//-----------------------------------------------------------------------------//
var _userIDArray						=	[],
	_nickNameArray						=	[],
	_firstNameArray						=	[],
	_lastNameArray						=	[],
	countryArray						=	[],
	emailArray							=	[],
	cirruIDArray						=	[],
	sexArray							=	[],
	dateOfBirthArray					=	[],
	blackOrWhiteArray					=	[],
	confirmedUserArray					=	[],
	goldCubesArray						=	[],
	colorModeArray						=	[],
	scoreArray							=	[],
	countryFilterArray					=	[],
	itemsArray							=	[],
	reportedArray						=	[],
	penaltyOn							=	[],
	usersConnected						=	0;



function init()
{

	addSocketListeners();

	//db stuff
	db.connect();
	exports = module.exports;

	// sending the index.html
	console.log("Listening on port " + port);
	app.configure (expressConfiguration);
	app.use(express.static(__dirname + '/public'));

}


function addSocketListeners()
{
	// socket connection listeners 
	_io.sockets.on (SocketEvent.IO_CONNECT, socketIOConnectionHandler);
	_io.sockets.on (SocketEvent.IO_DISCONNECT, socketIODisonnectHandler);
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
		console.log("IM RUNNNIF");

}


_io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome to the chat' });
	socket.on('send', function (data) {
		console.log(data);
		_io.sockets.emit('message', data);
	});
});






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



// this starts everything.
init();


