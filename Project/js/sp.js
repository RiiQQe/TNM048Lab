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


    jQuery(function(){
        $('input.mybox').click(function() {
            $('.mybox:checked').each(function(){
                console.log($(this).val());
            });
        })
    });

    var statuses = {single:8, married:6, widower:4, divorced:2};



    function drawSetup(data){
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
            .attr("cx", function(d){ return x(d.year); })
            .attr("cy", function(d){ return y(d.amount); })
            .attr("r", function(d){
                return statuses[d.status];
            })
            .style("fill", function(d){

                if(d.sex == "men") return "blue";
                else return "red";

            });

        //xAxis
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .style("font-size", "13px")
            .text("Year");

        //yAxis
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 4)
            .attr("dy", "2.0em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "13px")
            .text("Amount");


        svg.append("text")
            .attr("class", "region")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", 0)
            .style("font-size", "20px")
            .text(data[0].region);        
    }

    function redo(data){

        svg.select(".region")
            .text(data[0].region);


        svg.selectAll(".dot")
            .data(data)
            .attr("cx", function(d) { return x(d.year); })
            .attr("cy", function(d) { return y(d.amount); })
            .style("fill", function(d){
                if(d.sex == "men") return "blue";
                else return "red"
            });

    }

    this.startSP = function(data){
        var status = ["single", "married"];
        data.self = recalcData(data);
        var kalle = handleData(data.self, "Jarfalla", status);
        drawSetup(kalle);
    }



    this.updateSP = function(data, val){
        
        var status = ["single", "married"];
        var kalle = handleData(data.self, val, status);

        redo(kalle)
    }

    function recalcData(data){
        var mapped = [];
        for(var key in data[0]){
            if(!isNaN(parseFloat(key))){
                mapped.push(data.map(function(d){
                    var tempObj = {amount:parseFloat(d[key]), region:d["region"], "status":d["marital status"], year:new Date(key), sex:d["sex"]};
                    return tempObj;
                }));                
            }
        }

        var newMapped = [];

        mapped.forEach(function(d){
            d.forEach(function(f){
                newMapped.push(f);
            });
        });

        //console.log(newMapped);

        return newMapped;
    }

    function fixAxels(data){

        //console.log(data);

        vals = [];
        for(var key in data[0])
            if(!isNaN(parseFloat(key)))
                vals.push(new Date(key));

        var vals2 = [];

        data.forEach(function(d){
            vals2.push(d.amount);
            vals.push(new Date(d.year));
        });
        
        x.domain([d3.min(vals), d3.max(vals)]);
        y.domain([0, d3.max(vals2)]);

        svg.select("g .y.axis")
            .call(yAxis);
    }

    function handleData(data, val, status){
        var filterDataR = data.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            if(noDigitsAndTrim == val && status.indexOf(d["status"]) != -1){
                d["region"] = noDigitsAndTrim;
                return d; 
            }
        });

        fixAxels(filterDataR);

        return filterDataR;
    }

    function selectDots(){
        console.log("clicked");

    }
    
}

