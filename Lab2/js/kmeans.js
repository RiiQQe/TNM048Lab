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
    		var ran = i * 100;

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

					if(d["clusterIndex"] = i){
						error += Math.pow(length(d, c), 2);
					}

				});
				
			});

			tries++;

			if(error < prevError || tries > 1000){
				thisIsTrue = false;
				console.info("done");
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

   	/*
    function kmeans(data, k) {

    	var sampleSize = data.length / k;

    	var thresholdW = 1,
    		change = 10,
    		counter = 0;
    	var prevError = 10000;

    	var notGoodEnough = true;
    	
    	while(notGoodEnough){
    		
	        //1. Randomly place K points into the space represented by the items that are being clustered. These
			//points represent the initial cluster centroids.
	        var centeroid = {};
	        var centeroids = [];

			//This could be done more random..
	        //Right now every 100th point is a centeroid
	        for(var i = 0; i < data.length; i = i + sampleSize){

	        	data[i].forEach(function(d){
	        		console.log(d);
	        	});

	    		centeroid = {x:data[i]["A"],y:data[i]["B"],z:data[i]["C"]};
	        	centeroids.push(centeroid);
	        }

			//2. Assign each item to the cluster that has the closest centroid. There are several ways of calculating
			//distances and in this lab we will use the Euclidean distance: (SEE SLIDES)
			var xDiff = 0, yDiff = 0, zDiff = 0, length = 0, minLength = 10000;
			var jTemp, cluster = [];
			var distances = [];

			for(var i = 0; i < data.length; i++){
				if(i % sampleSize != 0){
					for(var j = 0; j < centeroids.length; j++){
							xDiff = Math.pow(data[i]["A"] - centeroids[j]["x"], 2);
							yDiff = Math.pow(data[i]["B"] - centeroids[j]["y"], 2);
							zDiff = Math.pow(data[i]["C"] - centeroids[j]["z"], 2);

							length = Math.sqrt(xDiff + yDiff + zDiff);
							if(length < minLength) {
								jTemp = j;
								minLength = length;
							}
					}
					distances.push(minLength);
					minLength = 10000;
					cluster.push(jTemp);
				}else{
					distances.push(0);
					cluster.push(i / sampleSize);
				}	
			}
			//Now cluster contains the points index that it´s connected to.

	        //3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
			//centre of the cluster. This is achieved by calculating the average values in all dimensions.
			var nofBelonging = 0, xTot = 0, yTot = 0, zTot = 0;
			
			for(var i = 0; i < centeroids.length; i++){
				for(var j = 0; j < data.length; j++){
					if(cluster[j] == i && j != i * sampleSize){

						nofBelonging++;
						
						xTot = xTot + parseFloat(data[i * sampleSize]["A"]) - parseFloat(data[j]["A"]);
						yTot = yTot + parseFloat(data[i * sampleSize]["B"]) - parseFloat(data[j]["B"]);
						zTot = zTot + parseFloat(data[i * sampleSize]["C"]) - parseFloat(data[j]["C"]);
						
					}
				}
				
				if(nofBelonging != 0){

					//Take the average in every dirr
					xTot = xTot / nofBelonging;
					yTot = yTot / nofBelonging;
					zTot = zTot / nofBelonging;


					//Changing the pos
					//Something goes wrong here, or in the check the quality
					data[i * sampleSize]["A"] = parseFloat(data[i * sampleSize]["A"]) + parseFloat(xTot);
					data[i * sampleSize]["B"] = parseFloat(data[i * sampleSize]["B"]) + parseFloat(yTot);
					data[i * sampleSize]["C"] = parseFloat(data[i * sampleSize]["C"]) + parseFloat(zTot);
					centeroids[i]["x"] = parseFloat(data[i * sampleSize]["A"]);
					centeroids[i]["y"] = parseFloat(data[i * sampleSize]["B"]);
					centeroids[i]["z"] = parseFloat(data[i * sampleSize]["C"]);
				}

				xTot = 0;
				yTot = 0; 
				zTot = 0;
				nofBelonging = 0;
			}


			//Change should be a vector of these sums instead
			//TODO: 
			//Change this, I believe that the loops could still be as they are. But that we 

			var newError = 0;

			for(var i = 0; i < centeroids.length; i++){

				for(var j = 0; j < data.length; j++){
					if(cluster[j] == i && i * sampleSize != j){
						xDiff = Math.pow(data[j]["A"] - centeroids[i]["x"], 2);
						yDiff = Math.pow(data[j]["B"] - centeroids[i]["y"], 2);
						zDiff = Math.pow(data[j]["C"] - centeroids[i]["z"], 2);

						var length = Math.sqrt(xDiff + yDiff + zDiff); 

						newError += parseFloat(length);
					}
				}
			}

			console.log(newError);
			
			if(newError > prevError) notGoodEnough = false;
			else prevError = newError;


		}

		//Just a tester to see that nothing went wrong..
		//If something is printed from this, something
		//went wrong somewhere
		console.log("Belongs to cluster 0");
		console.log(cluster.length);
		var newData = [];
		for(var i = 0; i < cluster.length; i++){
			var temp = cluster[i];
			var newObj = {A:data[i]["A"],B:data[i]["B"],C:data[i]["C"], cluster:temp}
			newData.push(newObj);
		}



		return newData;		
    };
    
    */