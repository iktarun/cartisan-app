var request = require("request");
var config  = require('./../config');

/* This module will get the acutocomplete result from Google */

module.exports.getPlaceDetails = function(req,res){

    if (req && req.body && req.body.place_id) {

      // Get details of place_id and store in DB
      var query = req.body.place_id;                    
      var PLACE_DETAILS_API_URL = config.PLACE_DETAILS_API_URL;
      PLACE_DETAILS_API_URL     = PLACE_DETAILS_API_URL.replace(/USER_QUERY/g, query).replace(/GOOGLE_API_KEY/g, config.GOOGLE_API_KEY);
      
      request(PLACE_DETAILS_API_URL, function(error, response, body) {
        if(error) {
          res.json({
              status:false,
              message:'An error has occured'
            })
        }else{
    
            if(body){
                
                // body = JSON.parse(body);

                // if(body.status && body.status.toLowerCase() == 'ok'){

                //     var lat = '';
                //     var lng = '';

                //     if(body.result.geometry){
                //        var geo = body.result.geometry;
                //       for (x in geo) {
                //         if(x == 'location'){
                //           lat = geo[x].lat;
                //           lng = geo[x].lng; 
                //         }
                //       }
                //     }

                //     var userSearchObj = {
                //           uid:uid,
                //           search_string:body.result.name,
                //           name:body.result.name,
                //           formatted_address:body.result.formatted_address,
                //           place_id:body.result.place_id,
                //           utc_offset:body.result.utc_offset,
                //           latitude:lat,
                //           longitude:lng,
                //           created_date:curTimeStamp

                //     }
                // }
                 res.json({
                    status:true,
                    data:body,
                    message:'Retrieved autocomplete results for: '+query
                });
            }else{
               res.json({
                    status:false,
                    message:'Retrieved autocomplete results for: '+query
                });
            }
          }
      });
      //End of getting data from google api, and save data in db
    }
}

/* End of autoComplete module */

    
    