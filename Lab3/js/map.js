var points;
var circles;
function map(data) {

    
    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterdData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    circle = d3.geo.circle();

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};
    
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
        var newObj = {};
        array.map(function (d, i) {
            //Complete the code
            newObj = {type:"Feature", geometry: {type: "Point", coordinates: [d.lon, d.lat]}};

            data.push(newObj);
        });
        

        return data;
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");


        //draw point        
        //Complete the code
        circles = g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("class", "quakes")
            .attr("d", path);
        
    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        //Complete the code
        
        var filter = [];
        data.forEach(function(d){
            if(parseFloat(  d["mag"]) > value) filter.push(true);
            else filter.push(false);
        });

        var quakes = g.selectAll(".quakes");

        quakes.style("display", function(d, i){
            if(filter[i]) return "";
            else return "none";
        });
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {

        var filter = [];
        //Complete the code
        data.forEach(function(d){
            if((format.parse(d.time) > value[0] && format.parse(d.time) < value[1]))
                filter.push(true);
            else if((format.parse(d.time) > value[1] && format.parse(d.time) < value[0]))
                filter.push(true);

            else filter.push(false);
        });

        var quakes = g.selectAll(".quakes");
        
        //This is done very simple right now, might not be the correct way...
        quakes.style("display", function(d, i){
                if(filter[i]) {
                    d['displayed'] = filter[i];
                    return "";
                }
                d['displayed'] = false;
                return "none";
             });

        map1.cluster();
        
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        console.log("inside");
        var k = 4;
        var reducedData = [];
        var newObj = {};


        data.forEach(function(d, i){
            var kT;
            
                if(d.clusterIndex !== undefined){
                    kT = d.clusterIndex;
                }else kT = -1;

                newObj = {1:d["lat"], 2:d["lon"], clusterIndex:kT};
                
                reducedData.push(newObj);
            
        });

        
        console.log(reducedData);

        //kMeansRes is screwing with us somehow now..
        var kMeansRes = kmeans(reducedData, k);

        data.forEach(function(d, i){

            d['clusterIndex'] = kMeansRes[i]['clusterIndex'];

        });

        (geoData.features).forEach(function(d, i){
            if(d.displayed == true)
                d['clusterIndex'] = kMeansRes[i]['clusterIndex'];
        });
        
        //console.log(geoData.features.length);

        //console.log(geoData.features);
        
        //console.log(kMeansRes);

        //var prev, temp;
        //(geoData.features).forEach(function(d, index){
            
        //    console.log(d['clusterIndex']);

        //});

        color = d3.scale.category20().domain(0, k);

        var quakes = g.selectAll(".quakes");
        
        quakes.attr("stroke", function(d, i) { 
        
            //console.log(color(d["clusterIndex"])); 

            //if(d["clusterIndex"] == 1) return "red";
            //if(d["clusterIndex"] == 2) return "green";
            //if(d["clusterIndex"] == 3) return "black";
            //if(d["clusterIndex"] == 0) return "yellow";
            return color(d["clusterIndex"]); 

        });
           

        console.log("done");
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
