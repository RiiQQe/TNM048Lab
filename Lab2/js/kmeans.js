    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

   	
    function kmeans(data, k) {

    	var sampleSize = data.length / k;

    	var thresholdW = 1,
    		change = 10,
    		counter = 0;
    	var prevChange = 0;
    		
    	//while(Math.abs(change - prevChange) > thresholdW && counter < 70){
    		
    		prevChange = change;
    		change = 0;
    		counter++;
	        //1. Randomly place K points into the space represented by the items that are being clustered. These
			//points represent the initial cluster centroids.
	        var centeroid = {};
	        var centeroids = [];
	        
	        //This could be done more random..
	        //Right now every 100th point is a centeroid
	        for(var i = 0; i < data.length; i = i + sampleSize){
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

			//4. Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
			//measure of quality. The objective is to minimize the sum of squared errors within each cluster:

			//Change should be a vector of these sums instead
			for(var i = 0; i < centeroids.length; i++){
				for(var j = 0; j < data.length; j++){
					if(cluster[j] == i && i * sampleSize != j){
						xDiff = Math.pow(data[j]["A"] - centeroids[i]["x"], 2);
						yDiff = Math.pow(data[j]["B"] - centeroids[i]["y"], 2);
						zDiff = Math.pow(data[j]["C"] - centeroids[i]["z"], 2);

						change += Math.sqrt(xDiff + yDiff + zDiff);
					}
				}
			}	
		//}

		//Just a tester to see that nothing went wrong..
		//If something is printed from this, something
		//went wrong somewhere
		console.log("Belongs to cluster 0");
		console.log(cluster.length);
		for(var i = 0; i < cluster.length; i++){
			if(data[i]["A"] < 0 || data[i]["B"] < 0 || data[i]["C"] < 0){
				console.log(i)
				console.log( "( " + data[i]["A"] + ", " + data[i]["B"] +  ", " + data[i]["C"] +  " )");
			}
		}



		return cluster;		
    };
    
    