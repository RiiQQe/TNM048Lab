var regions = [];

function map(){
    //testkommentar för git
    var nrOfColors = 9;

    var min, max;

    var legend;

    var newData = [];
    var municipalities;
    var year = "2011";

    var self = this; // for internal d3 functions

    var realData, status = "single";

    var mapDiv = $("#map");
    var legendDiv = $("#mapLegend");

    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    //var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var margin = {top: 0, right: 0, bottom: 0, left: 0};
    var width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    var legendWidth = legendDiv.width(),
        legendHeight = legendDiv.height();

    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    var colorRangeTester = d3.scale.linear()
        .range(colorbrewer.Reds[nrOfColors]);

  
    var colorRangeTesters = d3.scale.linear().range(colorbrewer.Reds[nrOfColors]);

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    var svgLegend = d3.select("#mapLegend").append("svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight);

    var gLegend = svgLegend.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([25, 65])
            .scale(1200);


    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);
    
    var csv = 'data/Swedish_Population_Statistics.csv';
    var municipalities, newData;

    this.startFun = function(data){
        d3.json("data/swe_mun.topojson", function(error, sweden){
            realData = data;


            if(error) return console.error(error);
            
            municipalities = topojson.feature(sweden, sweden.objects.swe_mun).features;

            municipalities = replaceLetters(municipalities);

            //Used to normalize
            realData.forEach(function(d){
                regions.push(d.key.toLowerCase());
                var sum = 0;    
                d.values.forEach(function(e){
                    sum += e.values;
                });
                d.tot = sum;
            });


            draw(municipalities);

         });
    }


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

    function draw(municipalities){
        var status = 'single';
        recalculateRange(status);

        var municipality = g.selectAll(".municipality").data(municipalities);


        municipality.enter().insert("path")
                    .attr("class", "municipality")
                    .attr("d", path)
                    .style('stroke-width', 0.5)
                    .style("stroke", "white")
                    .style("fill", function(d){
                        var colo = undefined;
                        realData.forEach(function(c){
                            if(d.properties.name == c.key){
                                d.percentage = c.values[0].values / c.tot;
                                colo = colorRangeTesters(d.percentage);            //TODO: changes this [1] so it corresponds to "status"
                            }
                        });
                        return colo;
                     })
                    .on("click", function(d) { sp1.updateSP(d.properties.name); })
                    
                    //Tooltip functions
                    .on("mousemove", function(d){

                        tooltip.transition()
                            .duration(0)
                            .style("opacity", 1);
                        tooltip.html("Region: " + d.properties.name + "<br> Percentage " +(100 * d.percentage).toPrecision(3) + "%")
                            .style("left", (d3.event.pageX + 28) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        d3.select(this.parentNode.appendChild(this)).transition().duration(150)
                          .style("stroke", "black");

                    })
                    .on("mouseout", function(d){
                        tooltip.transition()
                            .duration(700)
                            .style("opacity", 0);
                        d3.select(this).transition().duration(150).style("stroke", "white");
                    });



        legend = svgLegend.selectAll(".legend2")
                .style("border", "thick solid #0000FF")
                .data(colorbrewer.Reds[9])
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(" + i * (width / 18) + ", 0)"; });

        legend.append("rect")
            .attr("x", width / 4)
            .attr("y", 18)
            .attr("width", (width / 20))
            .attr("height", 20)
            .style("fill", function(d, i) { return d; });

    
        svgLegend.append("text")
            .attr("class", "info")
            .attr("text-anchor", "end")
            .attr("x", legendWidth * 0.5 + 70)
            .attr("y", 12)
            .style("font-size", "12px")
            .text("Darker color equals more persons");
        /*
        legend.append("text")
            .attr("class", "from")
            .attr("x", width / 5)
            .attr("y", 18)
            .style("font-size", "12px")
            .text("from");
        */

        legend.append("text")
            .filter(function(d, i){ if(i == 0 || i == 8) return d; })
            .attr("class", "fromto")
            .attr("x", width / 4)
            .attr("y", 50)
            .style("font-size", "12px")
            .text(function(d, i){
                if(i == 0) return  (100 * min).toPrecision(3) + " %";
                else return (max * 100).toPrecision(3) + " %";
            });


        console.log(svgLegend.select(".info").text());

    }

    function recalculateRange(status){
        
        var temp = 0;
        if(status == "married") temp = 1;
        else if(status == "divorced") temp = 2;
        else if(status.toLowerCase() == "widow/widower") temp = 3;

        var vals = [];

        realData.forEach(function(d){
            vals.push(d.values[temp].values / d.tot);
        });
        max = d3.max(vals);
        min = d3.min(vals);

        var temp = (max - min) / (nrOfColors - 1); 
        
        var newPercantage = [];

        for(var i = 0; i < nrOfColors; i++){
            var temp2 = min + temp * i;
            newPercantage.push(temp2);
        }
        colorRangeTesters.domain(newPercantage);

    }
    function updateMaxMin(a, i){
        var legendText = d3.selectAll(".fromto");

        legendText.transition()
            .duration(1000)
            .style("opacity", 0)
            .transition().duration(500)
            .style("opacity", 1)
            .text(function(d, k){
                    if(k == 0){
                        var val2 = 3;
                        if(i * 100 < 10) val2 = 2;
                        var min2 = (i * 100).toPrecision(val2); 
                        return  min2 + " %";
                    }
                    else 
                        return (a * 100).toPrecision(3) + " %";
                    
            });
    }

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        
        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    this.toggleColor = function(val){
    recalculateRange(val);
    updateMaxMin(max, min);

    var temp = 0;
    if(val == "married") temp = 1;
    else if(val == "divorced") temp = 2;
    else if(val.toLowerCase() == "widow/widower") temp = 3;
    
    d3.selectAll(".municipality")
        .on("mousemove", function(d){

                tooltip.transition()
                        .duration(0)
                        .style("opacity", 1);
                tooltip.html("Region: " + d.properties.name + "<br> Percentage " + (100 * d.percentage).toPrecision(3) + "%")
                    .style("left", (d3.event.pageX + 28) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                d3.select(this.parentNode.appendChild(this)).transition().duration(150)
                  .style("stroke", "black");


        })
        .on("mouseout", function(d){
                        tooltip.transition()
                            .duration(700)
                            .style("opacity", 0);
                        d3.select(this).transition().duration(150).style("stroke", "white");
        })
        .transition().duration(1500).ease("in-in-out")
        .style("fill", function(d){
            var colo = undefined;
            realData.forEach(function(c){
                if(d.properties.name == c.key){
                    d.percentage = c.values[temp].values / c.tot;
                    colo = colorRangeTesters(d.percentage);            //TODO: changes this [1] so it corresponds to "status"
                }
            });
            return colo;    
        });

    }

    this.toggleStroke = function(val){
        
        var colo = "black";

        d3.selectAll('.municipality')
            .filter(function(d){ return (d.properties.name).toLowerCase() == val.toLowerCase() })
            .transition().duration(1000)
            .style("fill", "blue")
            .transition().duration(1000)
            .style("fill", function(d){
                colo = colorRangeTesters(d.percentage);
                return colo
            })
            .transition().duration(1000)
            .style("fill", "blue")
            .transition().duration(1000)
            .style("fill", colo);

    }
}

function fun(val){
    map1.toggleColor(val);
}

function fun2(e){
    if (e.keyCode == 13) {
        var tb = document.getElementById("search");
        fun3(tb.value);
        return false;
    }
}
function fun3(val){
    if(regions.indexOf(val.toLowerCase().trim()) === -1) alert(val + " doesn't exists, only english alphabet");
    else{
        val = val.trim().toLowerCase();
         sp1.updateSP(val.charAt(0).toUpperCase()  + val.slice(1));
         map1.toggleStroke(val);
    }   
     


}

