function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    
    //initialize color scale
    //...

    var colorrange = [];
    colorrange = ["#32ACAF", "#E36790", "#F3C3C3C" ];
    
    //initialize tooltip
    //...

    var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};

    var line = d3.svg.line();

    var axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");


    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

        self.data = data;

        // Extract the list of dimensions and create a scale for each.
        //...
        
        x.domain(dimensions = (_(d3.keys(data[0])).without("Country")).filter(function(d) {
                
                var vals = _(self.data).pluck(d).map(parseFloat);
                

                return [(y[d] = d3.scale.linear()
                .domain(d3.extent(vals))
                .range([height, 0]))];

        }));


        draw();
    });

    function draw(){

        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")

            .data(self.data)
            .enter().append("path")
            .attr("d", path)

            .style("stroke", "grey")

            .on("click",  function(d, i) {
                self.selectLine(d.Country);
                sp1.selectDot(d.Country);
            })

            .on("mousemove", function(d){
                
            })
            .on("mouseout", function(){
                
            });
            
        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            //...
            .data(self.data)
            .enter().append("path")

            .attr("d", path)
            .style("stroke", "light-blue")
            
            .on("click", function (d) {
                sp1.selectDot(d.Country);
                self.selectLine(d.Country);
            });
            if(useTooltip){
                
                foreground.on("mousemove", function(d){
                    tooltip.transition()        
                        .duration(200)      
                        .style("opacity", .9);      
                    tooltip.html("Country: " + d.Country + "<br/>Household income: " + d["Household income"] + "kr <br/>Employment rate: " + d["Employment rate"] + "%")  
                        .style("left", (d3.event.pageX) + "px")     
                        .style("top", (d3.event.pageY - 28) + "px");    
                })
                .on("mouseout", function(){
                     tooltip.transition()        
                        .duration(500)      
                        .style("opacity", 0);  
                });
            }
        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .each(function (d) { d3.select(this).call( axis.scale(y[d]) ); })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        
        var countriesInside = [];
        foreground.style("display", function(d) {
            var countriesIns = false;
            countriesIns = actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            });

            console.log(countriesIns);

            if(countriesIns){
                //console.log(d.Country);
                sp1.selectDot(d.Country);
                return null;
            }else{
                sp1.noSelectDot(d.Country);
                return "none";    
            }
            
        });
        
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){

        foreground.each(function (d, i){
            if(d.Country == value) {
                console.log(d.Country);
                var selectedPath = d3.select(this);
                selectedPath.style("stroke", "red");
            }
        });
    };
    


    //method for selecting features of other components
    function selFeature(value){
        //...
    };

}
