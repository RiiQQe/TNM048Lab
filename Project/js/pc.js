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
    //width = mapDiv.width() - margin.right - margin.left,
      //      height = mapDiv.height() - margin.top - margin.bottom;
    var width = 960,
        height = 1160;

    
    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height);
            //.call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([20, 70])
            .scale(1300);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);
    //var csv = 'data/taxi_sthlm_march_2013.csv';
        
   /* d3.csv(csv, function(data){
            
        //console.log(data);
        makeCalcs(data);

    });*/

    d3.json("data/swe_mun.topojson", function(error, sweden){
        if(error) return console.error(error);
        var municipalities = topojson.feature(sweden, sweden.objects.swe_mun).features;
        
        /*svg.append("path")
            .datum(municipalities)
            .attr("class", "municipality")
            .attr("d", path)*/

        /*g.selectAll(".municipality")
            .data(municipalities)
            .enter().append("path")
            .attr("class", function(d){console.log(d.properties.name); return "municipality " + d.municipality;})
            .attr("d", path);*/

        draw(municipalities);

    });

    function draw(municipalities){
        //console.log(municipalities);
        var municipality = g.selectAll(".municipality").data(municipalities);
        console.log(municipality);
        municipality.enter().insert("path")
                    .attr("class", function(d){ return "municipality " + d.properties.name; })
                    .attr("d", path);
                    
        //console.log(municipality);
    }

    function makeCalcs(data){
        
    }
  

}

