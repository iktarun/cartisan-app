/**
 * @ Author: Tarun Kumar
 * Desc: Applicaton Root File
 */


/* PROJECT DEPENDENCY CONFIG FILES INCLUDED HERE*/

var express 		= require('express');
var app 				= express();
var bodyParser 	= require('body-parser');
var path    		= require("path");
var config 			= require('./config'); // get our config file

/* Include all the controllers that are used in this application */ 

var fuelPriceController 		= require('./controllers/get-fuel-price-controller');
var placeDetailsController 	= require('./controllers/place-details-controller');

var assetsPath 				= path.join('../css');
app.use(express.static(assetsPath));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



/*
**************************
UI ROUTES IS WRITTEN OVER HERE
****************************
*/

var asset = path.join(__dirname,'./views');
app.use(express.static(asset));
app.get('/', function(req, res){
   res.sendFile("index.html",{root: asset})
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.sendFile("404.html",{root: asset})
});


/*
***********************************************
	API's routes 
***********************************************

*/

app.post('/api/get-fuel-price',fuelPriceController.getFuelPrice);
app.post('/api/get-place-details',placeDetailsController.getPlaceDetails);

app.listen(config.port);//Listen on server port 3000
