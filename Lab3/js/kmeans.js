    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    var counter = [];

	function kmeans(data, k) {
    	
    	var centeroids = [],
    		clusters = [],
    		oldClusters =[];

    	var prevError = 0;

    	var tries = 0;

		//1. Randomly place K points into the space represented by the items that are being clustered. These
		//points represent the initial cluster centroids.

		/*The not so random way*/
    	for(var i = 0; i < k; i++){
    		var ran = i * 2000;

            //ran = Math.floor((Math.random() * data.length) + 1); //A bit missleading, range is [1, data.length]
    		
            centeroids.push(ran);
    		
    		clusters.push(data[ran]);
    	}
    	
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
				dist[i] = i;

			var newCluster = [];

			clusters.forEach(function(c, i){
				counter[i] = 0;

				dist[i] = call(c, i, data);
				dist[i] = parseFloat(dist[i]) / parseFloat(counter[i]);
				
				var pointVals = [];

	    		for(var keys in c)
	    			pointVals.push(c[keys]);

				var newObj = {};
				for(var k = 0; k < Object.keys(c).length - 1; k++){
					newObj[k] = dist[k] + parseFloat(pointVals[k]);
				}
				newObj[Object.keys(c).length] = i;
				newCluster.push(newObj);	


			});

			

			//Move the cluster centeroids
			oldClusters = clusters;
			clusters = newCluster;


			//4. Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
			//measure of quality. The objective is to minimize the sum of squared errors within each cluster:
			var error = 0;
			clusters.forEach(function(c, i){

				data.forEach(function(d){

					if(d["clusterIndex"] == i){
						error += Math.pow(length(d, c), 2);
					}

				});

			});

			tries++;

			if(error < prevError || tries > 2){
				thisIsTrue = false;
			
			}else{
				prevError = error;
			}
			
		}

		return data;

    };

    function call(centeroid, index, data){
    	var arr = [];
    	var newArr = [];

    	for(var i = 0; i < Object.keys(centeroid).length - 1; i++)
			newArr[i] = 0;    		

    	data.forEach(function(d){
    		if(d["clusterIndex"] == index){
    			if(counter[index] == undefined) counter[index] = 1;
    			else counter[index]++;
    			arr = avgLength(d, centeroid);
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

   	