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
        .range([0, width - 100]);

    var color = d3.scale.category10();

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

    var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


    jQuery(function(){
        $('input.mybox').click(function() {
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
        dots.append("circle")
            .filter(function(d) { 
                var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == region && status.indexOf(d["status"]) !== -1){
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

            })

            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 1);

                tooltip.html('amount: ' + d.amount + "<br/>"  + (d.year).getFullYear())  
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");

                setTimeout(removeTooltip, 3000);
            });



            


        //xAxis
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 100)
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

    function removeTooltip(){
        tooltip.transition()
                .duration(300)
                .style("opacity", 0);
    }

    function redo(data, region, status){

        svg.select(".region")
            .text(region);


        svg.selectAll(".dot").remove();
        dots.append("circle")
            .filter(function(d) { 
                var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == region && status.indexOf(d["status"]) !== -1){
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

            })
            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 1);

                tooltip.html('amount: ' + d.amount + "<br/>"  + (d.year).getFullYear())  
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");
            
                
                setTimeout(removeTooltip, 3000);
            });

        //Ta ej bort, ska användas till att skriva ut legend  
       /* var legend = svg.selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        console.log(width);
        console.log(height);

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill",  "#00ff00");  

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.status}); */

    }

    this.startSP = function(data){
        var status = ["single", "married"];
        data.self = recalcData(data);

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

        region = val;

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

        x.domain([new Date(d3.min(vals)), new Date(d3.max(vals))]);
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

    
}

