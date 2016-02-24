var newData = [];

function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    //console.log(mapDiv);

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;
      
    //var width = 960,
      //  height = 1160;

    //initialize color scale
    //...
    var colorrange = [];
    colorrange = ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238" ];

    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

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

        draw(municipalities, newData);

     });

    function replaceLetters(municipalities){

        municipalities.forEach(function(d){ d.properties.name = d.properties.name.replace(/Å/g, "A")
                                            d.properties.name = d.properties.name.replace(/Ä/g, "A")
                                            d.properties.name = d.properties.name.replace(/Ö/g, "O")
                                            d.properties.name = d.properties.name.replace(/å/g, "a")
                                            d.properties.name = d.properties.name.replace(/ä/g, "a")
                                            d.properties.name = d.properties.name.replace(/oe/g, "o")
                                            d.properties.name = d.properties.name.replace(/Malung/g, "Malung-Salen")
                                            d.properties.name = d.properties.name.replace(/Upplands-Vasby/g, "Upplands Vasby")
                                            d.properties.name = d.properties.name.replace(/ö/g, "o")});
        return municipalities;
    }

    function draw(municipalities, n){
        var municipality = g.selectAll(".municipality").data(municipalities);

        municipality.enter().insert("path")
                    .attr("class", "municipality")
                    .attr("d", path)
                    .style('stroke-width', 1)
                    .style("stroke", "white")
                    .style("fill", function(d){ return d.properties.color; });

    }

    function setColor(municipalities){
        
        municipalities.forEach(function(d){ d.properties.color = colorrange[Math.floor((Math.random() * 10) + 0)]});
        
        return municipalities; 

    }


    //  Creates a new Dataset that looks like this: 
    //  newData.region gives region
    //  newData.men/.women/.total gives array with years as attribute and with sum for each group ('singles, married etc..') as values
    function makeCalcs(data){

        data.forEach(function(d){

            var withNoDigitsAndTrim = d.region.replace(/[0-9]/g, '').trim();

            //Just because the data is screwing us over..
            //With both "kvinnor" and "women" as keyvalues..
            if(d.sex == "kvinnor") keysVar = "women";
            else keysVar = d.sex;
            var counter = 0;
            var alreadyExists = false;
            newData.forEach(function(nd){
                if(nd.region == withNoDigitsAndTrim) alreadyExists = true;
                else if(!alreadyExists) counter++;
            });

            if(!alreadyExists) {
                newData.push({region:withNoDigitsAndTrim});
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

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
}

