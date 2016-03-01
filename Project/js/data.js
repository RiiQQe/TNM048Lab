
function data(){

	var self = this;

	var csv = 'data/Swedish_Population_Statistics.csv';

	d3.csv(csv, function(data){
        sp1.data = data;
        self.data = data;
        var newData = createData(data);
        var newDataMap = createDataMap(newData);

        map1.startFun(newDataMap);
        sp1.startSP(newData);
    });

    function createData(data){

    	var mapped = [];
        for(var key in data[0]){
            if(!isNaN(parseFloat(key))){
                mapped.push(data.map(function(d){
                    var tempObj = {amount:parseFloat(d[key]), region:d.region.replace(/[0-9]/g, "").trim(), "status":d["marital status"], year:new Date(key), sex:d["sex"]};
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

    function createDataMap(data){

    	var nested = d3.nest()
    					.key(function(d){ return d.region; })
    					.key(function(d){ return d.status; })
    					.rollup(function(v) { return d3.sum(v, function(d) { return d.amount; }); })
    					.entries(data);

    	return nested;
    }
}