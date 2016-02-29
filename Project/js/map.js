function map(){

    var newData = [];
    var municipalities;
    var year = "2011";

    var self = this; // for internal d3 functions

    var mapDiv = $("#map");

    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    //var mapDiv = $("#map");

    //console.log(mapDiv);

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

      
    //var width = 960,
      //  height = 1160;

    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    //initialize color scale
    //...
    var colorRangeTester = d3.scale.ordinal().range(["blue", "green", "red"]);

    colorRangeTester = d3.scale.ordinal()
        .range(colorbrewer.Reds[9]);

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([20, 65])
            .scale(1300);


    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);
    
    var csv = 'data/Swedish_Population_Statistics.csv';
    var municipalities, newData;

    //var year = "2011";  
        
    d3.csv(csv, function(data){
        sp1.data = data;
        self.data = data;
        makeCalcs(data);
    
    });

    var arrRep1 = ["Å", "Ä", "Ö", "å", "ä", "ö"];
    var arrRep2 = ["A", "A", "O", "a", "a", "ö"];

    d3.json("data/swe_mun.topojson", function(error, sweden){
        if(error) return console.error(error);
        
        municipalities = topojson.feature(sweden, sweden.objects.swe_mun).features;

        municipalities = replaceLetters(municipalities);

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
                    .style("fill", function(d){
                        var colo = undefined;
                        n.forEach(function(c){
                            if(d.properties.name == c.region) 
                                colo = colorRangeTester(c.total[year]);
                        });
                        return colo;
                     })
                    .on("click", function(d) { sp1.updateSP(self.data, d.properties.name); })
                    
                    //Tooltip functions
                    .on("mousemove", function(d){
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(d.properties.name)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d){
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
    }

    //  Creates a new Dataset that looks like this: 
    //  newData.region gives region
    //  newData.men/.women/.total gives array with years as attribute and with sum for each group ('singles, married etc..') as values
    function makeCalcs(data){
        sp1.startSP(data);

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

                    newData[counter]["total"][key] += parseFloat(d[key]);
                    newData[counter][keysVar][key] += parseFloat(d[key]);
                }
            }

        });
        
        recalculateRange(newData, "total");
        
    }

    function recalculateRange(n, val){
        var min, max,
            prevMax = 0,
            prevMin = Infinity;

        newData.forEach(function(nd){
            max = d3.max(nd[val]);
            min = d3.min(nd[val]);
            if(max > prevMax)
                prevMax = max;
            
            if(min < prevMin)
                prevMin = min;
            
        });
        

        //colorbrew.domain([prevMin, prevMax]);
        colorRangeTester.domain([prevMin, prevMax]);
    }

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    var radios = document.getElementsByName("myradio");

    document.getElementById("btn").addEventListener("click", function(){

        var sex = undefined;
        for(var i = 0; i < radios.length; i++){
            if(radios[i].checked) sex = radios[i].value;
        }
        var year = document.getElementById("year").value;
        if(!year || parseFloat(year) < 2000 || parseFloat(year) > 2012) alert("fill in year between 2000-2012");
        else{
            recalculateRange(newData, sex);

            toggleColor(year, sex, newData);

            console.log("working");
        }
    });

   function toggleColor(val, sex, n){
        
        d3.selectAll(".municipality")
            .style("fill", function(d){
                var colo = undefined;
                n.forEach(function(c){
                    if(d.properties.name == c.region) 
                        colo = colorRangeTester(c[sex][year]);
                });
              
                return colo;
            });
    
    }


}

