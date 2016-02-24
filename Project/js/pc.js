var color;
function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8]);
            //.on("zoom", move);

    var mapDiv = $("#map");

    //console.log(mapDiv);

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
      
    var width = 960,
        height = 1160;

    //initialize color scale
    //...
    var colorrange = [];
    colorrange = ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238" ];

    var colors = colorbrewer.Set3[10];

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

    var arrRep1 = ["Å", "Ä", "Ö", "å", "ä", "ö"];
    var arrRep2 = ["A", "A", "O", "a", "a", "ö"];

    d3.json("data/swe_mun.topojson", function(error, sweden){
        if(error) return console.error(error);
        var municipalities = topojson.feature(sweden, sweden.objects.swe_mun).features;

        municipalities = replaceLetters(municipalities);

        municipalities = setColor(municipalities);

        draw(municipalities);

     });

    function draw(municipalities){
        var municipality = g.selectAll(".municipality").data(municipalities);

        municipality.enter().insert("path")
                    .attr("class", "municipality")
                    .attr("d", path)
                    .style('stroke-width', 1)
                    .style("stroke", "white")
                    .style("fill", function(d){ return d.properties.color; });

    }

    function replaceLetters(municipalities){

        municipalities.forEach(function(d){ d.properties.name = d.properties.name.replace("Å", "A")
                                            d.properties.name = d.properties.name.replace("Ä", "A")
                                            d.properties.name = d.properties.name.replace("Ö", "O")
                                            d.properties.name = d.properties.name.replace("å", "a")
                                            d.properties.name = d.properties.name.replace("ä", "a")
                                            d.properties.name = d.properties.name.replace("ö", "o")});
        return municipalities;
    }

    function setColor(municipalities){
        var o = d3.scale.ordinal()
                .range(colorbrewer.RdBu[9]);
        
        municipalities.forEach(function(d){ d.properties.color = colorrange[Math.floor((Math.random() * 10) + 0)]});
        
        return municipalities; 
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

