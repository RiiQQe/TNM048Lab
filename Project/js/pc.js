var color;
function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8]);
            //.on("zoom", move);

    var mapDiv = $("#map");

    //console.log(mapDiv);

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
      
    var width = 960,
        height = 1160;

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([20, 70])
            .scale(1300);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);
    
    var csv = 'data/Swedish_Population_Statistics.csv';
        
    d3.csv(csv, function(data){
        
        makeCalcs(data);

    });

    d3.json("data/swe_mun.topojson", function(error, sweden){
        if(error) return console.error(error);
        var municipalities = topojson.feature(sweden, sweden.objects.swe_mun).features;

     });

    function draw(municipalities){
        var municipality = g.selectAll(".municipality").data(municipalities);
        
        municipality.enter().insert("path")
                    .attr("class", function(d){ return "municipality " + d.properties.name; })
                    .attr("d", path);            
    }

    function makeCalcs(data){

        var newArr = [];


        data.forEach(function(d){
            

            if(!newArr[d.sex]) newArr[d.sex] = [];

            if(!newArr[d.sex][d.region]) newArr[d.sex][d.region] = [];

            for(var keys in d){
                
                if(!isNaN(parseFloat(d[keys])) && !isNaN(parseFloat(keys))) {

                    if(!newArr[d.sex][d.region][keys]) newArr[d.sex][d.region][keys] = 0;
                    
                    newArr[d.sex][d.region][keys] += parseFloat(d[keys]);
                }
            }            
        });
        console.log(newArr);

    }
  

}

