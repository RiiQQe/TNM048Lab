function map(){
    //testkommentar för git
    var nrOfColors = 9;

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

    var hej = ["#fff5f0", "#cb181d", "#67000d"];
    console.log(colorbrewer.Reds[nrOfColors]);
    console.log(hej);
    
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
            .center([28, 64])
            .scale(1000);


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

            

            realData.forEach(function(d){
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
        var counter = 0;

        municipality.enter().insert("path")
                    .attr("class", "municipality")
                    .attr("d", path)
                    .style('stroke-width', 1)
                    .style("stroke", "white")
                    .style("fill", function(d){
                        var colo = undefined;
                        realData.forEach(function(c){
                            if(d.properties.name == c.key){
                                colo = colorRangeTesters(c.values[0].values / c.tot);            //TODO: changes this [1] so it corresponds to "status"
                            }
                        });
                        return colo;
                     })
                    .on("click", function(d) { sp1.updateSP(d.properties.name); })
                    
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

                    //console.log(colorbrewer.Reds[9]);

        var legend = svgLegend.selectAll(".legend")
                .data(colorbrewer.Reds[9])
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(" + i * 35 + ", 0)"; });

        legend.append("rect")
            .attr("x", 30)
            .attr("y", 18)
            .attr("width", 35)
            .attr("height", 20)
            .style("fill", function(d, i) { return d; });

    
        svgLegend.append("text")
            .attr("class", "info")
            .attr("text-anchor", "end")
            .attr("x", legendWidth * 0.5 + 50)
            .attr("y", 12)
            .style("font-size", "15px")
            .text("[ Info text goes here ffs ]");

        console.log(svgLegend.select(".info").text());

    }

    function recalculateRange(status){
        var min, max;

        var temp = 0;
        if(status == "married") temp = 1;
        else if(status == "divorced") temp = 2;
        else if(status.toLowerCase() == "widow/widower") temp = 3;

        var vals = [];

        realData.forEach(function(d){

            vals.push(d.values[temp].values);

        });
        max = d3.max(vals);
        min = d3.min(vals);


        /*colorRangeTester
            .domain([parseFloat(min),, parseFloat(max)]);*/
        max = 1;
        min = 0;
        var temp = (max - min) / (nrOfColors - 1); 
        console.log("min: " + min);
        var ihatethis = [];
        
        for(var i = 0; i < nrOfColors; i++){
            var temp2 = min + temp * i;
            ihatethis.push(temp2);
        }
        console.log(ihatethis);
        
        colorRangeTesters.domain(ihatethis);

        console.log(colorbrewer.Reds[nrOfColors]);

        console.log(colorRangeTesters(min));

        console.log(colorRangeTesters(max));

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

    var temp = 0;
    if(val == "married") temp = 1;
    else if(val == "divorced") temp = 2;
    else if(val.toLowerCase() == "widow/widower") temp = 3;
     
    console.log(realData);
    
    d3.selectAll(".municipality")
        .style("fill", function(d){
            var colo = undefined;
            realData.forEach(function(c){
                if(d.properties.name == c.key){
                    colo = colorRangeTesters(c.values[temp].values / c.tot);            //TODO: changes this [1] so it corresponds to "status"
                }
            });
            return colo;    
        });

    }
}

function fun(val){
    map1.toggleColor(val);
}

