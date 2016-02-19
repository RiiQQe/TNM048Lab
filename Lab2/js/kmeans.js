    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

   	
    function kmeans(data, k) {

        //1. Randomly place K points into the space represented by the items that are being clustered. These
		//points represent the initial cluster centroids.
        var point = {};
        var points = [];
        
        //This could be done more random..
        for(var i = 0; i < data.length/2; i=i+10){
    		point = {x:data[i]["A"],y:data[i]["B"],z:data[i]["C"]};
        	points.push(point);
        }

		//2. Assign each item to the cluster that has the closest centroid. There are several ways of calculating
		//distances and in this lab we will use the Euclidean distance: (SEE SLIDES)
		var xDiff, yDiff, zDiff, length, minLength = 10000;
		var jTemp, cluster = [];
		for(var i = 0; i < data.length; i++){
			if(i % 10 != 0){
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
				clusterPoint = {clusi:jTemp, index:i}; //Index could be unneccassary
				cluster.push(clusterPoint);
			}else{
				clusterPoint = {clusi:i, index:i};
				cluster.push(clusterPoint);
			}	
		}
		//Now cluster contains the points index that it´s connected to.

        //3. When all objects have been assigned, recalculate the positions of the K centroids to be in the
		//centre of the cluster. This is achieved by calculating the average values in all dimensions.
		
		/*
		float nofBelonging = 0, xTot = 0, yTot = 0, zTot = 0;
		float tester = 0;
		console.log( "BEFORE: ( " +  data[0]["A"] + ", " + data[0]["B"] + ", " + data[0]["C"] + " )");
		for(var i = 0; i < 1; i++){
			for(var j = 0; j < data.length; j++){
				if(cluster[j]["clusi"] == i && j != i){

					nofBelonging++;
					console.log(data[i]["B"]);
					console.log(data[j]["B"]);

					temp = data[i]["A"];
					temp2 = data[j]["A"];

					xTot = xTot + temp - temp2;
					yTot = yTot + data[i]["B"] - data[j]["B"];
					zTot = zTot + data[i]["C"] - data[j]["C"];
					console.log(yTot);
					tester++;
				}
			}
			
			if(nofBelonging != 0){
				xTot = xTot / nofBelonging;
				yTot = yTot / nofBelonging;
				zTot = zTot / nofBelonging;
				console.log("before: " + data[i]["B"]);
				data[i]["A"] = data[i]["A"] + xTot;
				data[i]["B"] = data[i]["B"] + yTot;
				data[i]["C"] = data[i]["C"] + zTot;
				console.log("after: " + data[i]["B"]);
			}

			xTot = 0;
			yTot = 0; 
			zTot = 0;
			nofBelonging = 0;
		}

		console.log( "AFTER: ( " +  data[0]["A"] + ", " + data[0]["B"] + ", " + data[0]["C"] + " )");

		
		*/

		//4. Check the quality of the cluster. Use the sum of the squared distances within each cluster as your
		//measure of quality. The objective is to minimize the sum of squared errors within each cluster:
			


    };
    
    