    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

   	
    function kmeans(data, k) {

    	var thresholdW = 1,
    		change = 10,
    		counter = 0;
    	var prevChange = 0;
    		
    	while(Math.abs(change - prevChange) > thresholdW /*&& counter < 3*/){
    		prevChange = change;
    		change = 0;
    		counter++;
	        //1. Randomly place K points into the space represented by the items that are being clustered. These
			//points represent the initial cluster centroids.
	        var point = {};
	        var points = [];
	        
	        //This could be done more random..
	        //Right now every 20th point is a centeroid
	        for(var i = 0; i < data.length; i=i+20){
	    		point = {x:data[i]["A"],y:data[i]["B"],z:data[i]["C"]};
	        	points.push(point);
	        }

			//2. Assign each item to the cluster that has the closest centroid. There are several ways of calculating
			//distances and in this lab we will use the Euclidean distance: (SEE SLIDES)
			var xDiff, yDiff, zDiff, length, minLength = 10000;
			var jTemp, cluster = [];

			for(var i = 0; i < data.length; i++){
				if(i % 20 != 0){
					for(var j = 0; j < points.length; j++){
							xDiff = Math.pow(data[i]["A"] - points[j]["x"], 2);
							yDiff = Math.pow(data[i]["B"] - points[j]["y"], 2);
							zDiff = Math.pow(data[i]["C"] - points[j]["z"], 2);

							length = Math.sqrt(xDiff + yDiff + zDiff);
							if(length < minLength) {
								jTemp = j;
								minLength = length;
							}
					}
					minLength = 10000;
					cluster.push(jTemp);
				}else{
					cluster.push(i / 20);
				}	
			}
			//Now cluster contains the points index that it´s connected to.

	        //3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
			//centre of the cluster. This is achieved by calculating the average values in all dimensions.
			var nofBelonging = 0, xTot = 0, yTot = 0, zTot = 0;
			
			for(var i = 0; i < 20; i++){
				for(var j = 0; j < data.length; j++){
					if(cluster[j] == i && j != i){

						nofBelonging++;
						
						xTot = xTot + parseFloat(data[i * 20]["A"]) - parseFloat(data[j]["A"]);
						yTot = yTot + parseFloat(data[i * 20]["B"]) - parseFloat(data[j]["B"]);
						zTot = zTot + parseFloat(data[i * 20]["C"]) - parseFloat(data[j]["C"]);
						
					}
				}
				
				if(nofBelonging != 0){
					xTot = xTot / nofBelonging;
					yTot = yTot / nofBelonging;
					zTot = zTot / nofBelonging;

					data[i * 20]["A"] = parseFloat(data[i * 20]["A"]) + parseFloat(xTot);
					data[i * 20]["B"] = parseFloat(data[i * 20]["B"]) + parseFloat(yTot);
					data[i * 20]["C"] = parseFloat(data[i * 20]["C"]) + parseFloat(zTot);
					points[i]["x"] = parseFloat(data[i * 20]["A"]);
					points[i]["y"] = parseFloat(data[i * 20]["B"]);
					points[i]["z"] = parseFloat(data[i * 20]["C"]);
				}

				xTot = 0;
				yTot = 0; 
				zTot = 0;
				nofBelonging = 0;
			}

			//4. Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
			//measure of quality. The objective is to minimize the sum of squared errors within each cluster:

			//Change should be a vector of these sums instead
			for(var i = 0; i < 20; i++){
				for(var j = 0; j < data.length; j++){
					if(cluster[j] == i && i * 20 != j){
						xDiff = Math.pow(data[j]["A"] - points[i]["x"], 2);
						yDiff = Math.pow(data[j]["B"] - points[i]["y"], 2);
						zDiff = Math.pow(data[j]["C"] - points[i]["z"], 2);

						change += Math.sqrt(xDiff + yDiff + zDiff);
					}
				}
			}	
		}

		//Just a tester to see that nothing went wrong..
		//If something is printed from this, something
		//went wrong somewhere
		for(var i = 0; i < cluster.length; i++){
			if(cluster[i] > 20){
				console.log(i)
			}
		}
		console.log(cluster);

		return cluster;		
    };
    
    