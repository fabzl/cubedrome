/*
var _mongoose	=	require('mongoose');


// connect to mongoose . 
//_mongoose.connect('mongodb://cubemaster:Orinal33@ds061188.mongolab.com:61188/cubedromedb');

_mongoose.connect('mongodb://cubemaster:Orinal33@ds061188.mongolab.com:61188/cubedromedb');


module.exports = _mongoose.connection;



*/


/**
 * Handles the db setup - adds the questions to the database if not there already
 * and handles the db connection
 */

var express = require('express'),
    mongoose = require('mongoose'),
    pkg = require('./package.json'),
    db;

console.log("im here!!");



module.exports = function () {

		console.log("im trying!!");
        mongoose.connect('mongodb://localhost/cubedromedb');

        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', function callback (db) {
                // yay!
                console.log('Connnected to DB\n');

                //creates our questions in the db (if we haven't already)
                //then check if a state has been initialised for each question for today
                //and then after all that we open our twitter stream
               // page.createQuestions(twitter, page.createStates);

        });

        return db;

}