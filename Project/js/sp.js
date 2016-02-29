var data, region = "Jarfalla";

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
            var vals = [];
            $('.mybox:checked').each(function(){
                //console.log($(this).val());
                vals.push($(this).val());
            });

            sp1.updateSP(self.data, region, vals);
        })
    });

    var statuses = {single:8, married:6, "widow/widower":4, divorced:2};

    var dots;

    function drawSetup(data, status){
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

        dots = svg.selectAll(".dot")
            .data(data)
            .enter();
        var counter = 0;
        dots.append("circle")
            .filter(function(d) { 
                var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == region && status.indexOf(d["status"]) !== -1){
                    counter++;
                    d["region"] = noDigitsAndTrim;
                    return d; 
                } 
            })
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
        console.log("here: " + counter);

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
            .text(region);        
    }

    function redo(data, region, status){

        svg.select(".region")
            .text(region);


        svg.selectAll(".dot").remove();
        var counter = 0;
        dots.append("circle")
            .filter(function(d) { 
                var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == region && status.indexOf(d["status"]) !== -1){
                    counter++;
                    console.log(d["status"]);
                    return d; 
                } 
            })
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
            console.log("here2: " + counter);
    }

    this.startSP = function(data){
        var status = ["single", "married"];
        data.self = recalcData(data);

        //var kalle = handleData(data.self, region, status);

        fixAxels(data.self, region, status);
        drawSetup(data.self, status);
    }



    this.updateSP = function(data, val, status){

        var status = [];
        jQuery(function(){
            $('.mybox:checked').each(function(){
                status.push($(this).val());
            });            
        });
        
        if(!status)
            var status = ["single", "married"];
        else alert("not undefined" + status);

        //console.log(status);
        region = val;

        console.log(data);

        fixAxels(data.self, region, status);

        redo(data.self, region, status);
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

        console.log(newMapped);

        return newMapped;
    }

    function fixAxels(data, region, status){

        var vals = [];
        var vals2 = [];
        console.log(region);
        data.forEach(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            if(noDigitsAndTrim == region && status.indexOf(d["status"]) != -1){
                vals2.push(d.amount);
                vals.push(new Date(d.year));
            }
        });

        console.log(vals);
        
        x.domain([new Date(d3.min(vals)), new Date(d3.max(vals))]);
        y.domain([0, d3.max(vals2)]);   
        //y.domain([0, 90000]);

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

