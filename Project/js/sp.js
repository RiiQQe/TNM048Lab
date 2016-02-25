var data;

function sp(){

    var vals = [];

	var self = this;

    var format = d3.time.format.utc("");//Complete the code

	var spDiv = $("#sp");

	var margin = "";

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    //x = d3.time.scale();

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


    function drawSetup(data, val){
        //These 4 can be done before
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

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){ })
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
        //console.log(data);
        data.self = data;
        //fixAxels(data);
        handleData(data, "Jarfalla");
        val = ["single", "married"];
        var newData = recalcData(data);
        drawSetup(data, val);
    }



    this.updateSP = function(data, val){
        handleData(data, val);
    }

    function recalcData(data){
        var mapped = [];
        for(var key in data[0]){
            if(!isNaN(parseFloat(key))){
                var newObj = {};

                //newObj.year = key;

                //newObj["k"];
                mapped = data.map(function(d){
                    var newObj2 = {amount:parseFloat(d[key]), region:d["region"], "status":d["marital status"], year:new Date(key)};
                    return newObj2;
                });

                mapped.push(newObj);
                
            }
        }


        console.log(mapped);

        
        return mapped;
    }

    function fixAxels(data){

        vals = [];
        for(var key in data[0])
            if(!isNaN(parseFloat(key)))
                vals.push(new Date(key));

        var vals2 = [];

        data.forEach(function(d){

            for(var key in d)
                if(!isNaN(parseFloat(key)))
                    vals2.push(parseFloat(d[key]));

        });
        
        x.domain([d3.min(vals), d3.max(vals)]);
        y.domain([d3.min(vals2), d3.max(vals2)]);

        svg.selectAll("g .y.axis")
            .call(yAxis);
        //drawSetup(data);

    }

    function handleData(data, val){


        var filterDataR = data.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            if(noDigitsAndTrim == val){
                d["region"] = noDigitsAndTrim;
                return d; 
            }
        });



        fixAxels(filterDataR);

    }
}