var request = require("request");
var config  = require('./../config');
var rp = require('request-promise');

/* This module will get the acutocomplete result from Google */

module.exports.getFuelPrice = function(req,res){

    if (req && req.body && req.body.city) {

      var city       = req.body.city;
      var FUEL_PRICE_API_URL = config.FUEL_PRICE_API_URL;

      var petrolPriceUrl  = FUEL_PRICE_API_URL.replace(/CITYNAME/g, city).replace(/FUELTYPE/g, config.FUEL_PRTROL);
      var dieselPriceUrl  = FUEL_PRICE_API_URL.replace(/CITYNAME/g, city).replace(/FUELTYPE/g, config.FUEL_DIESEL);
      var resultArr       = [];
      console.log(petrolPriceUrl);
      console.log(dieselPriceUrl);

      rp(petrolPriceUrl)
        .then(response => {
          // add stuff from url1 response to url2
          var fuelObj   = {};
          var response  = JSON.parse(response);
          fuelObj.type  = config.FUEL_PRTROL;
          console.log(response.petrol);
          console.log(typeof(response));
          
          fuelObj.price = response.petrol;
          resultArr.push(fuelObj);
          console.log(response);
          return rp(dieselPriceUrl);
        })
        .then(response => {
          // add stuff from url2 response to url3
          console.log(response);
          var response  = JSON.parse(response);
          var fuelObj   = {};
          fuelObj.type  = config.FUEL_DIESEL;
          
          console.log(response.diesel);
          fuelObj.price = response.diesel;
          resultArr.push(fuelObj);
        })
        .then(response => {
          // do stuff after all requests

          // If something went wrong

          res.json({
                    status:true,
                    data:resultArr,
                    message:'Retrieved autocomplete results for: '+city
                });

          // throw new Error('messed up')
        })
        .catch(err => console.log) // Don't forget to catch errors

    //     var city       = req.body.city;
    //     var fuel_type   = req.body.fuel_type;

    //     var FUEL_PRICE_API_URL = config.FUEL_PRICE_API_URL;
    //     FUEL_PRICE_API_URL     = FUEL_PRICE_API_URL.replace(/CITYNAME/g, city).replace(/FUELTYPE/g, fuel_type);
    //     console.log(FUEL_PRICE_API_URL);
    //     request(FUEL_PRICE_API_URL, function(error, response, body) {
    //         if (error) {
    //           res.json({
    //             status:false,
    //             message:'An error has occured'
    //             })
    //         }else{
    //             res.json({
    //                 status:true,
    //                 data:body,
    //                 message:'Retrieved autocomplete results for: '+city
    //             });
    //         }
    //     });
    // }else{
    //     res.json({
    //         status:false,
    //         message:'Request header is missing.'
    //         })   
    // }
  }
}

/* End of autoComplete module */

    
    