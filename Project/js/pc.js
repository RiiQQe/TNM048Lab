var color;
function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");
    
    var csv = 'data/Swedish_Population_Statistics.csv';
        
    d3.csv(csv, function(data){
        
        console.log(data);
        makeCalcs(data);

    });

    d3.json("data/swe_mun.topojson", function(error, sweden){
        //console.log(sweden);
    });

    function makeCalcs(data){

        var mens = {sex:"men"},
            womens = {sex:"women"};

        var newArr = [];

        var newVar;

        data.forEach(function(d){
            

            if(!newArr[d.sex]) newArr[d.sex] = [];

            if(!newArr[d.sex][d.region]) newArr[d.sex][d.region] = [];

            for(var keys in d){
                
                if(!isNaN(parseFloat(d[keys])) && !isNaN(parseFloat(keys))) {

                    if(!newArr[d.sex][d.region][keys]) newArr[d.sex][d.region][keys] = 0;
                    
                    newArr[d.sex][d.region][keys] += parseFloat(d[keys]);

                    //console.log(newArr[d.sex][keys]);

                }
            }            
        });
        console.log(newArr);

    }
  

}

