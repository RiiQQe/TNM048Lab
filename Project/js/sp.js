var data;

function sp(){

	var self = this;

	var spDiv = $("#sp");

    spDiv.innerHTML = "HEJ";

	var margin = "";

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

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


    function draw(data){

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

        var i = 0;
        var vals = [];
        for(var key in data[1]){
            if(!isNaN(parseFloat(key))){
                vals[i].push(key);
                i++;
            }        
        }

        console.log(vals);

        i = 0;
    
   // function(d){ i++; return vals[i]; }
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){ console.log(" ")})
            .attr("cy", function(d){ return d.fo})
            .attr("r", 2.0);

        //xAxis
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Year");

        //yAxis
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", "2.0em")
            .attr("transform", "rotate(-90)")
            .text("Amount");
            
    }

    this.startSP = function(data){
        console.log(data);
        data.self = data;
        draw(data);
    }

    this.updateSP = function(data, val){
        handleData(data, val);
    }

    function handleData(data, val){
        console.log(pc1.data);

        var filterData = data.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            
            return noDigitsAndTrim == val;
        });

        console.log(filterData);

    }





}