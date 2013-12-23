window.onload = function() {
 

    var messages = [],
    socket = io.connect('http://localhost:3700'),
    field = document.getElementById("field"),
    sendButton = document.getElementById("sendButton"),
    content = document.getElementById("content"),
    name = document.getElementById("name"),
    sendRegister = document.getElementById("sendRegister"),

    _userIDField                        =   document.getElementById("_userIDField"),
    _nickNameField                       =   document.getElementById("_nickNameField"),
    _firstNameField                      =   document.getElementById("_firstNameField"),
    _lastNameField                       =   document.getElementById("_lastNameField"),
    countryField                         =   document.getElementById("countryField"),
    emailField                           =   document.getElementById("emailField"),
    cirruIDField                         =   document.getElementById("cirruIDField "),
    sexField                             =   document.getElementById("sexField"),
    dateOfBirthField                     =   document.getElementById("dateOfBirthField"),
    blackOrWhiteField                    =   document.getElementById("blackOrWhiteField"),
    confirmedUserField                   =   document.getElementById("confirmedUserField"),
    goldCubesField                       =   document.getElementById("goldCubesField"),
    colorModeField                       =   document.getElementById("colorModeField"),
    scoreField                           =   document.getElementById("scoreField"),
    countryFilterField                   =   document.getElementById("countryFilterField"),
    itemsField                           =   document.getElementById("itemsField"),
    reportedField                        =   document.getElementById("reportedField"),
    penaltyOnField                       =   document.getElementById("penaltyOnField"),
    registerUserField                    =   "registerUser";

 
    socket.on('message', function (data) {


        console.log(data.message);    
        
        if(data.message) {
            messages.push(data);
            var html = '';

            for(var i=0; i<messages.length; i++) {

                console.log(messages[i].message);    
            //    console.log(messages[i].username);

                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 

    sendButton.onclick = function() {

        console.log("namevalue");
        console.log(name.value);


        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });

        }
    }; 

    sendRegister.onClick  = function() { 
        console.log("register");

        var userData = {


            _userID            :   dataExists(_userIDField),                 
            _nickName          :   dataExists(_nickNameField),          
            _firstName         :   dataExists(_firstNameField),                 
            _lastName          :   dataExists(_lastNameField),                    
            country            :   dataExists(countryField),                
            email             :   dataExists(emailField),                       
            cirruID           :   dataExists(cirruIDField),   


          //  sex               :                      
            dateOfBirth       :   dataExists(dateOfBirthField),               
            blackOrWhite      :   dataExists(blackOrWhiteField),              
            confirmedUser     :   dataExists(confirmedUserField),              
            goldCubes         :   dataExists(goldCubesField),               
            colorMode         :   dataExists(colorModeField),               
            score             :   dataExists(scoreField),              
            countryFilter     :   dataExists(countryFilterField),               
            items             :   dataExists(itemsField),               
            reported          :   dataExists(reportedField),           
            penaltyOn         :   dataExists(penaltyOnField)            


        }
        socket.emit(registerUser,userData);

    }

    function dataExists (field) {


     if(field.value == "") {
            field.value = "please fill"
            return false
        } else {
           return field.value;

        }
    }




}