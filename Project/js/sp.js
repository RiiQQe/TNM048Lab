function sp(){

    var vals = [];

	var self = this;

    var realData, reg = "Jarfalla";

    var dotsColor = ["red", "green", "brown", "orange"];
    var dotsColor2 = {single:"red", married:"green", divorced:"brown", "widow/widower":"orange"};

    var format = d3.time.format.utc("");//Complete the code

	var spDiv = $("#sp");

	var margin = "";

	//var margin = {top: 20, right: 20, bottom: 30, left: 40},
    var margin = {top: 20, right: 5, bottom: 30, left: 80},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

        //-120 to have space for municipality text and legend
    var x = d3.time.scale()
        .range([0, width - 120]);

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
            sp1.updateSP(reg);
        })
    });

    var statuses = {single:8, married:6, "widow/widower":4, divorced:2};

    var dots;

    function drawSetup(status){
        console.log(realData);
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

        var realDataFilt = realData.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == reg && status.indexOf(d["status"]) !== -1){
                    if(d["sex"] == "kvinnor" || d["sex"] == "women")
                        return d; 
                } 
        })

        dots = svg.selectAll(".dot")
            .data(realDataFilt)
            .enter();

        dots.append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){ return x(d.year); })
            .attr("cy", function(d){ return y(d.amount); })
            .attr("r", "0.4em")
            .style("fill", function(d){
                    return dotsColor2[d.status];
            })

            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 0.8);

                tooltip.html('Amount: ' + d.amount + "<br/> Sex: "  + d.sex + "<br/> Status: "  + d.status + "<br/> Year: "  + (d.year).getFullYear())  
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");

                setTimeout(removeTooltip, 3000);
            });

        dots.append("rect")
            .attr("class", "dot")
            .attr("x", function(d){ return x(d.year) - 4; })
            .attr("y", function(d){ return y(d.amount); })
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", function(d){

                return dotsColor2[d.status];

            })

            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 0.8);
                tooltip.html('Amount: ' + d.amount + "<br/> Sex: "  + d.sex + "<br/> Status: "  + d.status + "<br/> Year: "  + (d.year).getFullYear())  
                       .style("left", (d3.event.pageX) + "px")          
                       .style("top", (d3.event.pageY - 28) + "px");

                setTimeout(removeTooltip, 3000);
            });


        //xAxis
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 60)
            .attr("y", height + 6)
            .style("font-size", "13px")
            .text("Year");

        //yAxis
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", - 80)
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
            .text(reg);        


        var legendData = [];
        var statusAll = ["single", "married", "divorced", "widow/widower"];

            for(var i = 0; i < statusAll.length; i++){
                legendData.push({men:statusAll[i]});
                legendData.push({women:statusAll[i]});
            }

        var legend = svg.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect").filter(function(d) { return d.men; })
            .attr("class", "menRect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill",  function(d) { 
                return dotsColor2[d["men"]];
            });

        legend.append("circle").filter(function(d) { return d.women; })
            .attr("class", "womenRect")
            .attr("cx", width - 9 )
            .attr("cy", 8)
            .attr("r", "0.8em")
            .style("fill",  function(d) {
                return dotsColor2[d["women"]];
             });

        legend.append("text").filter(function(d){ return d.men })
            .attr("class", "menTxt")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d){ 
                if(d["men"] == "single") 
                    return "Single men";     
                if(d["men"] == "married") 
                    return "Married men";
                if(d["men"] == "divorced") 
                    return "Divorced men";
                if(d["men"] == "widow/widower") 
                    return "Widow men";
        });

        legend.append("text").filter(function(d){ return d.women })
            .attr("class", "womenTxt")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d){ 
                if(d["women"] == "single") 
                    return "Single women";     
                if(d["women"] == "married") 
                    return "Married women";
                if(d["women"] == "divorced") 
                    return "Divorced women";
                if(d["women"] == "widow/widower") 
                    return "Widow women"; 
            });

        editLegend(status);

    }

    function editLegend(status){
        var legend = svg.selectAll(".legend")
        var temp = legend.selectAll(".menTxt, .womenTxt, .womenRect, .menRect");

        console.log(temp);
        temp.style("display", function(d){
                    if(status.indexOf(d.men) !== -1 || status.indexOf(d.women) !== -1) return "";
                    return "none";
            });
        }

    function removeTooltip(){
        tooltip.transition()
                .duration(300)
                .style("opacity", 0);
    }

    function redo(status){
        svg.select(".region")
            .text(reg);
            
        var realDataFilt = realData.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
                if(noDigitsAndTrim == reg && status.indexOf(d["status"]) !== -1){
                    if(d["sex"] == "kvinnor" || d["sex"] == "women")
                        return d; 
                } 
        })

        svg.selectAll(".dot").remove();

        dots = svg.selectAll(".dot")
            .data(realDataFilt)
            .enter();

        dots.append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){ return x(d.year); })
            .attr("cy", function(d){ return y(d.amount); })
            .attr("r", "0.4em")
            .style("fill", function(d){
                    return dotsColor2[d.status];
            })

            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 0.8);

                tooltip.html('Amount: ' + d.amount + "<br/> Sex: "  + d.sex + "<br/> Status: "  + d.status + "<br/> Year: "  + (d.year).getFullYear())  
                .style("left", (d3.event.pageX) + "px")          
                .style("top", (d3.event.pageY - 28) + "px");

                setTimeout(removeTooltip, 3000);
            });

        dots.append("rect")
            .attr("class", "dot")
            .attr("x", function(d){ return x(d.year) - 4; })
            .attr("y", function(d){ return y(d.amount); })
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", function(d){

                return dotsColor2[d.status];

            })

            .on("mouseover", function(d){

                tooltip.transition()
                       .duration(300)
                       .style("opacity", 0.8);
                tooltip.html('Amount: ' + d.amount + "<br/> Sex: "  + d.sex + "<br/> Status: "  + d.status + "<br/> Year: "  + (d.year).getFullYear())  
                       .style("left", (d3.event.pageX) + "px")          
                       .style("top", (d3.event.pageY - 28) + "px");

                setTimeout(removeTooltip, 3000);
            });
        
      
        editLegend(status);
    }

    this.startSP = function(data){
        var status = ["single", "married", "divorced", "widow/widower"];
        realData = data;
        fixAxels(status);
        drawSetup(status);
    }

    this.updateSP = function(region){
        reg = region;

        var status = [];
        jQuery(function(){
            $('.mybox:checked').each(function(){
                status.push($(this).val());
            });            
        });
        
        if(!status)
            var status = ["single", "married"];

        fixAxels(status);

        redo(status);
    }

    function fixAxels(status){

        var vals = [];
        var vals2 = [];

        realData.forEach(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            if(noDigitsAndTrim == reg && status.indexOf(d["status"]) != -1){
                vals2.push(d.amount);
                vals.push(new Date(d.year));
            }
        });

        x.domain([new Date(d3.min(vals)), new Date(d3.max(vals))]);
        y.domain([0, d3.max(vals2)]);   
        
        svg.select("g .y.axis")
            .call(yAxis);
    }    
}

