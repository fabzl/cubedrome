//var windowWidth = $(window).width(); //retrieve current window width
//var windowHeight = $(window).height(); //retrieve current window height
var documentWidth = $(document).width(); //retrieve current document width
var documentHeight = $(document).height(); //retrieve current document height
//var vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
//var hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position
alert("hola");

function onm_window_parameters(){ //called on viewer reload, screen resize or scroll

  //  windowWidth = $(window).width(); //retrieve current window width
   // windowHeight = $(window).height(); //retrieve current window height
    documentWidth = $(document).width(); //retrieve current document width
    documentHeight = $(document).height(); //retrieve current document height
  //  vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
  //  hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position
  alert(documentWidth);
  alert(documentHeight);

}; 


function getHeight(val){
 	
 	 documentWidth = $(document).width();
    return documentWidth;
}



function documentHeight(val){
   
    documentHeight = $(document).height();
    return documentHeight;
}

$(window).resize(function () {  alert('resize')/* do something */ });

