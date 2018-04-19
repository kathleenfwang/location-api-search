function loadData(){
// set  up the js variables for the html elements you are going to manipulate 

var $body = $("body"); 
var $wikiElem = $("#wikilinks"); 
var $nytHeader = $("#nytimesheader"); 
var $nytElem = $("#nyarticlelist"); 
var $header = $("#header"); 

//clearing out old data before new request
$wikiElem.text(""); 
$nytElem.text(""); 

var $street = $("#street").val();
var $city = $("#city").val(); 
var address = $street + ', ' + $city ; 

$header.text('So you want to live at ' + address + '?'); 

// time to get google map image! 

var streetviewaddress = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' +address; 
// only need this search api that generates the google image street view. 

$body.append(`<img src ='${streetviewaddress}' id ="bgimg">`); 
// time to add the NY times .. 

//what do you plan on doing: 
//$nytElem (ul links). append ('<li> <a href="' + nytimesaddress + '"> + nytimessnippet + '</a></li>') 

var nyURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + $city +'&sort=newest&api-key=8184ef266eb241cda5e0792276a6bee6'

$.getJSON( nyURL, function(data) {

	$nytHeader.text('NY Times articles for ' + $city) 
	var nyarticlearr = data.response.docs 
	for (var i=0;i<nyarticlearr.length;i++) {
		var nyurl = nyarticlearr[i].web_url 
		var nysnippet = nyarticlearr[i].snippet 
		var nyheadline = nyarticlearr[i].headline.main 
	$nytElem.append('<li> <a href ="' + nyurl + 'target ="_blank" class ="links">' + nyheadline + '</a> <p>' + nysnippet + '</p></li>')


	}
}).fail( function(error){
	$nytHeader.text("Articles could not be loaded at this time.")
})
// time for WIKIPEDIA LINKS: 
//need ajax request since wiki uses some security stuff. 
var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+ $city + '&limit=100&namespace=0&format=json'

$.ajax(wikiurl, {
	dataType : "jsonp",
	jsonp : "callback",
	success: function (response) {
		var articleList = response[1]; 
		
		for (var i=0;i<articleList.length;i++)
		{ var wikilinkurl = 'https://en.wikipedia.org/' + articleList[i]
			$wikiElem.append('<li> <a href ="' + wikilinkurl +'">' + articleList[i] + '</a></li>')
		}
	}
})



  return false; // so ajax will be able to submit without reloading the page// without it, the stuff you put will be quickly over-written .by the previous values.   
}; 

$('#form-container').submit(loadData)