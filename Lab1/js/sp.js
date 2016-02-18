function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...

    var colorrange = [];
    colorrange = ["#32ACAF", "#E36790", "#F3C3C3C" ];

    //initialize tooltip
    //...

    var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //...
        
        var maxArrX = [];
        var maxArrY = [];
        
        //Can be used to extract info you want
        self.data.forEach(function (d){
            maxArrX.push(d["Household income"]);
            maxArrY.push(d["Employment rate"]);
        });

        var maxOfX = d3.max(maxArrX);
        var maxOfY = d3.max(maxArrY);


        //Min makes it little bit harder to see
        //Used to make it more even
        var minOfX = d3.min(maxArrX);
        var minOfY = d3.min(maxArrY);
        
        
        x.domain([minOfX,maxOfX]);
        y.domain([minOfY,maxOfY]);


        
        draw();

    });

    function draw()
    {
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6);
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
            .attr("cx", function(d) { return x(d["Household income"]); })
            .attr("cy", function(d) { return y(d["Employment rate"]); })
            .attr("r", 2.0)

            .on("click",  function(d) {
                self.selectDot(d.Country);
                pc1.selectLine(d.Country);
            });

            

            if(useTooltip){
                //tooltip
            svg.selectAll(".dot")
                .on("mousemove", function(d) {

                tooltip.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                tooltip.html("Country: " + d.Country + "<br/>Household income: " + d["Household income"] + "kr <br/>Employment rate: " + d["Employment rate"] + "%")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    
                })   
                
                .on("mouseout", function(d) {
                    //d3.select(this).attr("r", 2.0).style("fill", "black");
                    tooltip.transition()        
                        .duration(500)      
                        .style("opacity", 0);  
                });
            }else alert("not using tooltip");


        //xAxis
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Household income");

        //yAxis
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", "2.0em")
            .attr("transform", "rotate(-90)")
            .text("Employment rate");
        
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
         svg.selectAll('.dot').each(function (d, i) {
            if(d.Country == value){
                var dot = d3.select(this);
                dot.attr("r", 5.0).style("fill", "red");
            }
        });
        
    };
    
    this.noSelectDot = function(value){
         svg.selectAll('.dot').each(function (d, i) {
            if(d.Country == value){
                var dot = d3.select(this);
                dot.attr("r", 2.0).style("fill", "black");
            }
        });
        
    };


    //method for selecting features of other components
    function selFeature(value){
        
    }
}




