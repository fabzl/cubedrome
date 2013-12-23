var mongoose = require('mongoose');


module.exports = mongoose.model('Flight',{

	userID: Number,						
 	nickName: String,			
 	firstName: String,				
 	lastName:String,						
 	country:String,					
 	email:String,								
 	cirruID:String,					
 	sex:String,			
 	dateOfBirth:String,		
 	blackOrWhite: String,			
 	confirmedUser: String,				
 	goldCubes: String,			
 	score: Number,						
 	countryFilter:String,					
 	items:String,			
 	reported:String,					
 	penaltyOn:String,				
 	usersConnected:Number

});