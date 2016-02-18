function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;
    

    //initialize color scale
    //...
    var colorrange = [];
    colorrange = ["#32ACAF", "#E36790", "#F3C3C3C" ];
    
    //initialize tooltip
    //...
    var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/se.topojson", function(error, world) {
        console.log(world);
        
        var countries = topojson.feature(world, world.objects.countries).features;
        
        
        draw(countries);
        
    });

    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);
        //initialize a color country object 
        //...
        //cc contains the array of Objects with color and name props
        /*This is useless right now..*/
        var cc = [];
        var newObj = {};
        countries.forEach(function(d){
            newObj = {name:d["properties"]["name"], color:d["properties"]["color"]};
            
            cc.push(newObj);
        });
        
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            //...

            .style("fill", function (d) { return d.properties.color })

            //selection
            .on("click",  function(d) {
                console.log("clicked");
                sp1.selectDot(d.properties.name);
                pc1.selectLine(d.properties.name);
            });

            if(useTooltip){
                //tooltip
                country.on("mousemove", function(d) {
                    tooltip.transition()        
                        .duration(200)      
                        .style("opacity", .9);      
                    tooltip.html("Country: " + d.properties.name)  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");    
                })
                .on("mouseout",  function(d) {
                      tooltip.transition()        
                        .duration(500)      
                        .style("opacity", 0);  
                });
            }


    }
    
    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }
}

