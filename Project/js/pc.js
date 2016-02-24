var newData = [];

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

            draw(municipalities, newData);    
    
    });

    function draw(municipalities, n){
        var municipality = g.selectAll(".municipality").data(municipalities);
        
        municipality.enter().insert("path")
                    .attr("class", function(d){ return "municipality " + d.properties.name; })
                    .attr("d", path);   

        /*circles = g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("class", "quakes")
            .attr("d", path);*/
    }


    //  Creates a new Dataset that looks like this: 
    //  newData.sex.place.year 


    function makeCalcs(data){

        data.forEach(function(d){

            var withNoDigits = d.region.replace(/[0-9]/g, '');

            //Just because the data is screwing us over..
            //With both "kvinnor" and "women" as keyvalues..
            if(d.sex == "kvinnor") keysVar = "women";
            else keysVar = d.sex;
            var counter = 0;
            var alreadyExists = false;
            newData.forEach(function(nd){
                if(nd.region == withNoDigits) alreadyExists = true;
                else if(!alreadyExists) counter++;
            });

            if(!alreadyExists) {
                newData.push({region:withNoDigits});
                counter = newData.length - 1;
            }

            
            if(!newData[counter][keysVar]) newData[counter][keysVar] = []; 
            if(!newData[counter]["total"]) newData[counter]["total"] = []; 

            for(var key in d){
                if(!isNaN(parseFloat(d[key])) && !isNaN(parseFloat(key))) {
                    
                    if(!newData[counter]["total"][key]) 
                        newData[counter]["total"][key] = 0;
                           
                    if(!newData[counter][keysVar][key])
                        newData[counter][keysVar][key] = 0;

                    //console.log(newData[counter]["total"][key]);
                    newData[counter]["total"][key] += parseFloat(d[key]);
                    newData[counter][keysVar][key] += parseFloat(d[key]);
                }
            }

        });
        console.log(newData);
    }
}

