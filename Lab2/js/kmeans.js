    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

var centeroids = [],
    clusters = [];

var newError = Infinity;
var oldError = Infinity;
var ifTrue = true;

function kmeans(data, k){

    //1. Randomly place K points into the space represented by the items that are being clustered. These
    //points represent the initial cluster centroids.
    randomCentroids(data, k);

    while(ifTrue){
        console.info("going again");
        //2. Assign each item to the cluster that has the closest centroid. There are several ways of calculating
        //distances and in this lab we will use the Euclidean distance: (SEE SLIDES)
        assignToCluster(data);

        //data.forEach(function(d){
        //    if(d.clusterIndex != 0) console.log(d);
        //});

        //3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
        //centre of the cluster. This is achieved by calculating the average values in all dimensions.
        //TESTER
        //console.log(clusters);
        clusters = moveCenteroids(data);
        //TESTER
        //console.log("new");
        //console.log(clusters);

        //4. Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
        //measure of quality. The objective is to minimize the sum of squared errors within each cluster:
        ifTrue = checkQuality(data);
    }
    console.log(data);
    return data;

}

//Check the quality
function checkQuality(data){
    newError = oldError;
    var error = 0;

    clusters.forEach(function(c, i){
        
        data.forEach(function(d){

            if(d.clusterIndex == i){
                var arr = differenceBetweenTwoPoints(d, c);
                //console.log(arr);
                //console.log(i);
                for(var k = 0; k < arr.length - 1; k++){
                    error += parseFloat(arr[k]);
                }
            }
        });

    });
    oldError = error;
    return error < newError
}

//Moves the centeroids depending on the average value in each direction
function moveCenteroids(data){

    //Contains the values, not avg values
    
    clusters.forEach(function(c, i){
        
        var counterForAvg = 0;
        var dist = [],
            totDist = [];

        data.forEach(function(d){

            if(d.clusterIndex == i){
                counterForAvg++;
                dist = differenceBetweenTwoPoints(c, d);

                for(var k = 0; k < dist.length; k++){
                    if(totDist[k] == undefined) totDist[k] = 0;
                    
                    totDist[k] += dist[k];
                }
            }

        });
        
        //Did all these steps just to be sure
        var cVals = [];
        for(var key in c)
            cVals.push(c[key]);
        
        for(var k = 0; k < totDist.length; k++)
            totDist[k] = totDist[k] / counterForAvg;

        for(var k = 0; k < cVals.length; k++)
            cVals[k] = parseFloat(cVals[k]) + totDist[k];
        
        //TESTER
        //console.log("this is how the old looked like ");
        //console.log(c);

        var cCounter = 0;
        for(var key in c){
            c[key] = cVals[cCounter];
            cCounter++;
        }
        //TESTER
        //console.log("aslong as the newest looks like this im good... ");
        //console.log(c);
    });

    return clusters;
}

function assignToCluster(data){
    
    data.forEach(function(d, i){
        
        var newIndex = -1;
        var newDist = Infinity;

        clusters.forEach(function(c, j){
            var arr = differenceBetweenTwoPoints(c, d);
            var dist = 0;

            for(var k = 0; k < arr.length; k++)
                dist += arr[k];
            
            dist = Math.sqrt(dist);
 
            if(dist < newDist){
                newIndex = j;
                newDist = dist;
            }
        });
        
        d["clusterIndex"] = newIndex;

    });

    //Not sure if this is needed really
    //But cannot bother to check..
    return data;
}

//Returns the (sum) (x0 - x1)^2 + (y0 - y2)^2 + (z0 - z1)^2
function differenceBetweenTwoPoints(clusterPoint, dataPoint){

    var dataVals = [],
        clusterVals = [],
        tot = [];

    for(var key in dataPoint)
        dataVals.push(dataPoint[key]);

    for(var key in clusterPoint)
        clusterVals.push(clusterPoint[key]);

    var max = dataVals.length < clusterVals.length ? clusterVals.length : dataVals.length;
    
    for(var i = 0; i < max; i++){

        var x = clusterVals[i] !== undefined ? parseFloat(clusterVals[i]) : 0;
        var y = dataVals[i] !== undefined ? parseFloat(dataVals[i]) : 0;
        
        var temp = x - y;
        tot.push(Math.pow(temp, 2));
    }

    return tot;
}

function randomCentroids(data, val){
    
    for(var i = 0; i < val; i++){
        var ran = i * 100; 
        centeroids.push(ran);
        clusters.push(_.clone(data[ran]));
    }

}












/*
    var counter = [];

    //var notSoRandom = [{0:"75"} , {1:"235"}, {2:"271"}, {3:"355"}];
    var notSoRandom = [{0:"159"} , {1:"66"}];

	function kmeans(data, k) {
    	
    	var centeroids = [],
    		clusters = [],
    		oldClusters =[];

    	var prevError = 0;

    	var tries = 0;

        var max = data.length;
        var min = 0;

		//1. Randomly place K points into the space represented by the items that are being clustered. These
		//points represent the initial cluster centroids.

		//The not so random way
    	for(var i = 0; i < k; i++){
    		var ran = i * 100;

            ran = Math.floor(Math.random() * (max - min)) + min;
            //ran = parseFloat(notSoRandom[i][i]);

            while(centeroids.indexOf(ran) != -1)
                ran = Math.floor(Math.random() * (max - min)) + min;


    		centeroids.push(ran);
    		
    		clusters.push(data[ran]);
    	}
    	console.log(centeroids);
    	var thisIsTrue = true;
    	while(thisIsTrue){
			//2. Assign each item to the cluster that has the closest centroid. There are several ways of calculating
			//distances and in this lab we will use the Euclidean distance: (SEE SLIDES)
			data.forEach(function(d){
				
				var newIndex = -1;
				var newDist = Infinity;
				
				clusters.forEach(function(c, j){

					var dist = Math.sqrt(length(d, c));
                 
					if(dist < newDist){
						newDist = dist;
						newIndex = j;
					}

				});

				d["clusterIndex"] = newIndex;
		
			});

			//3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
			//centre of the cluster. This is achieved by calculating the average values in all dimensions.
			var dist = [];

			for(var i = 0; i < clusters.length; i++)
				dist[i] = 0;

			var newCluster = [];
            
			clusters.forEach(function(c, i){
				counter[i] = 0;
                
                var newObj = {};

                var pointVals = [];

                for(var keys in c)
                    pointVals.push(c[keys]);

				dist[i] = calcDist(c, i, data);
              

                for(var k = 0; k < Object.keys(c).length - 1; k++){
                    
                    if(parseFloat(counter[i]) != 0)
                        dist[i][k] = parseFloat(dist[i][k]) / parseFloat(counter[i]);
                    else dist[i][k] = 0;
                    
                    newObj[k] = parseFloat(dist[i][k]) + parseFloat(pointVals[k]);
                }
				
				newObj[Object.keys(c).length] = i;
                
				newCluster.push(newObj);	
			});


			//Move the cluster centeroids
			oldClusters = clusters;
			clusters = newCluster;
            
			var error = 0;
			clusters.forEach(function(c, i){

				data.forEach(function(d){

					if(d["clusterIndex"] == i){
						error += Math.pow(length(d, c), 2);
					}

				});

			});

			tries++;

			if(error < prevError * 1.9) thisIsTrue = false;
			else prevError = error;
			
			console.info("working.. ");
		}
        console.log(clusters);
        print("after");
		return data;

    };
    function print(val){
        console.log(val);
    }
    function calcDist(centeroid, index, data){
    	var arr = [];
    	var newArr = [];

    	for(var i = 0; i < Object.keys(centeroid).length - 1; i++)
			newArr[i] = 0;    		

    	data.forEach(function(d){
    		if(d["clusterIndex"] == index){
    			if(counter[index] == undefined) counter[index] = 1;
    			else counter[index]++;

    			arr = length(d, centeroid);
    			for(var k = 0; k < arr.length; k++)
    				newArr[k] += arr[k];

    		}
    	});

    	return newArr;

    }

    function avgLength(point, centeroid){
    	var pointVals = [],
    		centeroidVals = [];

    	for(var keys in point)
    		pointVals.push(point[keys]);

    	for(var keys in centeroid)
    		centeroidVals.push(centeroid[keys]);

    	//This is just to skip the cluster value
    	var max = centeroidVals.length;
    	var tot = [];

    	for(var i = 0; i < max; i++){

    		//Just to be on the safe side..
    		var x = pointVals[i] !== undefined ? parseFloat(pointVals[i]) : 0;
    		var y = centeroidVals[i] !== undefined ? parseFloat(centeroidVals[i]) : 0;

    		tot.push(Math.pow(x - y, 2));
    	}

    	return tot;
    }
    
    function length(point, centeroid){
        
    	var pointVals = [],
    		centeroidVals = [];
    	for(var keys in point) 
    		pointVals.push(point[keys]);
	
		for(var keys in centeroid) 
    		centeroidVals.push(centeroid[keys]);
        

    	var max = pointVals.length > centeroidVals.length ? pointVals.length : centeroidVals.length;
    	var tot = 0;

    	for(var i = 0; i < max; i++){

    		var x = pointVals[i] !== undefined ? parseFloat(pointVals[i]) : 0;
    		var y = centeroidVals[i] !== undefined ? parseFloat(centeroidVals[i]) : 0;
 
    		tot += Math.pow(x - y, 2);
    	}
    	
    	return tot;  
    };
*/
   	