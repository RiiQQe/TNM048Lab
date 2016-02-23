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
    //console.log(data);
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
    
    var max = data.length;
    var min = 0;

    for(var i = 0; i < val; i++){
        var ran = i * 100;

        ran = Math.floor(Math.random() * (max - min)) + min;

        while(centeroids.indexOf(ran) != -1)
            ran = Math.floor(Math.random() * (max - min)) + min;

        centeroids.push(ran);
        clusters.push(_.clone(data[ran]));
    }

}
