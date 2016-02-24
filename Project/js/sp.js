function sp(){

	var self = this;

	var spDiv = $("#sp");

    spDiv.innerHTML = "HEJ";

	var margin = "";

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;


    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    this.updateSP = function(data, val){
        handleData(data, val);
    }

    function handleData(data, val){

        var filterData = data.filter(function(d){
            var noDigitsAndTrim = d.region.replace(/[0-9]/g, "").trim();
            
            return noDigitsAndTrim == val;
        });

    }





}