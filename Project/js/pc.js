var color;
function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");
    
    var csv = 'data/taxi_sthlm_march_2013.csv';
        
    d3.csv(csv, function(data){
            
        //console.log(data);
        makeCalcs(data);

    });

    d3.json("data/swe_mun.topojson", function(error, sweden){
        console.log(sweden);
    });

    function makeCalcs(data){
        
    }
  

}

