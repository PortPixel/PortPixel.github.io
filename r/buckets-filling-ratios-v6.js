

/*


puzzle/challenge given by Mark Hogarth (hills L6 Maths teacher) in double maths lesson period 4 2019.07.09




balls added at randon
cant be added to bucket with ball, or bucket next to bucket w/ ball

find average fraction of buckets filled/unfilled


| x |   | x |   |   | x |   |   | x |   | x |   eg this is full

for large number of buckets fraction = f, f >= 1/3, f <= 1/2


*/

/*



to do



need to check splice() in addNewCheckAllOnceUsingRandomPicking is actually working deleting elements




⁠⁠Try generating list of all valid buckets at start of test, then removing from this when filling a bucket - then can pick randomly from this list when filling new buckets -> should be much faster I think





*/


/*global console*/ /* eslint no-console: "off" */
'use strict';

var buckets;


function genBuckets(num) {
    buckets = [];
    var i;
    
    for (i=0; i < num; i++) {
        buckets.push(false);
    }
}

function checkIfBucketValid (id) {
    if (buckets.length == 0 ) {
        return(!(buckets[0]));
    } else {
        if (id == 0) {
            //return(!(buckets[id] || buckets[id+1]));
            return(!(buckets[0] || buckets[1]));
        } else {
            if (id == buckets.length -1) {
                return(!(buckets[id] || buckets[id-1]));
            } else {
                return(!(buckets[id] || (buckets[id+1] || buckets[id-1])));
            }
        }
    }
    
}

function addNew () {
    var alreadyAdded = false;
    var alreadyCheckedArr = []
    var checkIts = 0;
    
    
    while (!alreadyAdded) {
        var tempFillId = Math.floor(Math.random()*buckets.length);
        
        checkIts++;
        
        if (checkIfBucketValid(tempFillId)) {
            
            //console.log('filled ' + tempFillId)
            buckets[tempFillId] = true;
            alreadyAdded = true;
            return({
                foundValidBucket: true,
                foundBucketID: tempFillId,
                checkIts: checkIts
            })
        } else {
            //console.log(tempFillId)
            //console.log(alreadyCheckedArr.length)
            //console.log(alreadyCheckedArr)
            if (!alreadyCheckedArr.includes(tempFillId)) {
                alreadyCheckedArr.push(tempFillId)
            }
        }
        
        if (alreadyCheckedArr.length === buckets.length) {
            //console.log('no more buckets fillable')
            return({
                foundValidBucket: false,
                checkIts: checkIts
            })
            //break;
        }
        
    }
    
}

function addNewCheckAllOnceUsingRandomPicking () {
    var alreadyAdded = false;
    //var alreadyCheckedArr = []
    var checkIts = 0;
    
    var toCheckArr = [];
    var i;
    for (i=0; i < buckets.length; i++) {
        toCheckArr.push(i);
    }
    
    
    while (!alreadyAdded) {
        //var tempFillId = Math.floor(Math.random()*buckets.length);
        
        var tempFillId = toCheckArr[Math.floor(Math.random()*toCheckArr.length)];
        
        checkIts++;
        
        if (checkIfBucketValid(tempFillId)) {
            
            //console.log('filled ' + tempFillId)
            buckets[tempFillId] = true;
            alreadyAdded = true;
            return({
                foundValidBucket: true,
                foundBucketID: tempFillId,
                checkIts: checkIts
            })
        } else {
            //console.log(tempFillId)
            //console.log(alreadyCheckedArr.length)
            //console.log(alreadyCheckedArr)
            //if (!alreadyCheckedArr.includes(tempFillId)) {
            //    alreadyCheckedArr.push(tempFillId)
            //}
            toCheckArr.splice(toCheckArr.indexOf(tempFillId),1)
            
            
            //need to check this is actually working deleting elements
        }
        
        if (toCheckArr.length === 0) {
            //console.log('no more buckets fillable')
            return({
                foundValidBucket: false,
                checkIts: checkIts
            })
        }
        
        //if (alreadyCheckedArr.length === buckets.length) {
        //    //console.log('no more buckets fillable')
        //    return({
        //        foundValidBucket: false,
        //        checkIts: checkIts
        //    })
        //    //break;
        //}
        
    }
    
}

//seehttps://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//*
//* Randomize array element order in-place.
//* Using Durstenfeld shuffle algorithm.
 
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}



function addNewCheckAllOnceUsingListShuffle () {
    var alreadyAdded = false;
    //var alreadyCheckedArr = []
    var checkIts = 0;
    
    var toCheckArr = [];
    var i;
    for (i=0; i < buckets.length; i++) {
        toCheckArr.push(i);
    }
    
    
    
    
    //console.log(toCheckArr)
    shuffleArray(toCheckArr)
    
    
    //console.log(toCheckArr)
    var toCheckArri = 0;
    
    while (!alreadyAdded) {
        //var tempFillId = Math.floor(Math.random()*buckets.length);
        
        //var tempFillId = toCheckArr[Math.floor(Math.random()*toCheckArr.length)];
        var tempFillId = toCheckArr[toCheckArri]
        
        //console.log(toCheckArri)
        
        
        toCheckArri++;
        
        checkIts++;
        
        if (checkIfBucketValid(tempFillId)) {
            
            //console.log('filled ' + tempFillId)
            buckets[tempFillId] = true;
            alreadyAdded = true;
            return({
                foundValidBucket: true,
                foundBucketID: tempFillId,
                checkIts: checkIts
            })
        } else {
            //console.log(tempFillId)
            //console.log(alreadyCheckedArr.length)
            //console.log(alreadyCheckedArr)
            //if (!alreadyCheckedArr.includes(tempFillId)) {
            //    alreadyCheckedArr.push(tempFillId)
            //}
            //toCheckArr.splice(toCheckArr.indexOf(tempFillId),1)
            
        }
        
        if (toCheckArri === toCheckArr.length) {
            //console.log('no more buckets fillable')
            return({
                foundValidBucket: false,
                checkIts: checkIts
            })
        }
        
        //if (alreadyCheckedArr.length === buckets.length) {
        //    //console.log('no more buckets fillable')
        //    return({
        //        foundValidBucket: false,
        //        checkIts: checkIts
        //    })
        //    //break;
        //}
        
    }
    
}


//then try shuffling once at start to see if this is faster could use https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    
    
    
    
    
    
    

function getFractionOfBucketsFilled () {
    var i;
    var numBucketsFilled = 0;
    
    for (i=0; i < buckets.length; i++) {
        numBucketsFilled += buckets[i]; //b[i] will be true/false, but +=true -> +=1, += false -> +=0 so still works
    }
    
    return(numBucketsFilled/buckets.length);
}




function runTest (numBuckets, returnAndLogPath) {
    genBuckets(numBuckets);
    
    var bucketsArrFull = false;
    var addNewIts = 0;
    var totalCheckIts = 0;
    
    
    if (returnAndLogPath) {
        var path = [];
    }
    
    while (!bucketsArrFull) {
        var addNewReturn = addNewCheckAllOnceUsingListShuffle(returnAndLogPath)//addNew();//addNewCheckAllOnceUsingRandomPicking();//addNew();
        
        totalCheckIts += addNewReturn.checkIts;
        
        if (addNewReturn.foundValidBucket) {
            //log path?
            
            if (returnAndLogPath) {
                path.push(addNewReturn.foundBucketID);
            }
    
            
            addNewIts++;
            
            if (addNewIts % 1000 === 0) {
                console.log(addNewIts)
            }
            
        } else {
            bucketsArrFull = true;
        }
    } 
    
    
    return({
        fraction: getFractionOfBucketsFilled(),
        addNewIts: addNewIts,
        totalCheckIts: totalCheckIts,
        path: path
    })
}









function runMultipleTests (numBuckets, interationsToDo) {
    var startTime = Date.now()
    var i;
    
    var totalFraction = 0;
    var addNewIts = 0;
    var totalCheckIts = 0;
    var testReturn;
    
    for (i=0; i < interationsToDo; i++) {
        testReturn = runTest(numBuckets, false)
        
        totalFraction += testReturn.fraction;
        addNewIts += testReturn.addNewIts;
        totalCheckIts += testReturn.totalCheckIts;
    }
    
    
    console.log('Mean fraction: ' + totalFraction/interationsToDo);
    console.log('Total addNew its: ' + addNewIts)
    console.log('Total check its: ' + totalCheckIts)
    
    console.log('Total time: ' + ((Date.now() - startTime) * 1000) + 'µs')
    console.log('Time per iteration: ' + (((Date.now() - startTime) / interationsToDo) * 1000) + 'µs')
}




function speedTester (functionToTest, interationsToDo) {
    var startTime = Date.now()
    var i;
    
    for (i=0; i < interationsToDo; i++) {
        functionToTest()
    }
    
    console.log('Total time: ' + ((Date.now() - startTime) * 1000) + 'µs')
    console.log('Time per iteration: ' + (((Date.now() - startTime) / interationsToDo) * 1000) + 'µs')
}














//maths work checking



function genSpaces(length) {
    var i;
    var tempStr = '';
    for (i=0; i < length; i++) {
        tempStr += '*'
    }
    return(tempStr);
}

function getNumPermsForLength(s, depth) {//doesn't work
    
    //depth var is just used for visuals/indentation in logging
    
    //NOTE: 's:' and 'p return' error text are likely not actually an error, just used to make it easier to see
    
    console.error(genSpaces(depth) + 's: ' + s)/
    console.log(genSpaces(depth) + 'depth:' + depth)
    
    switch (s) {
        case -1:
            //console.log('p return:' + '0')
            //return(0)
            
            
            //return p(0) for p(-1)
            console.warn(genSpaces(depth) + 'p return:' + '1')
            return(1)
        
        case 0:
            //console.log('p return:' + '0')
            //return(0)
            console.warn(genSpaces(depth) + 'p return:' + '1')
            return(1)
        
        case 1:
            console.warn(genSpaces(depth) + 'p return:' + '1')
            return(1)
        
        case 2:
            console.warn(genSpaces(depth) + 'p return:' + '2')
            return(2)
        
        default:
            var r;
            var perms = 0;

            for (r=1; r < s+1; r++) {
                //perms *= (1 + getNumPermsForLength(r-2) *  getNumPermsForLength(s-r-1))
                console.log(genSpaces(depth) + 'r: '+ r)
                
                console.log(genSpaces(depth) + 'r-2: '+ (r-2))
                console.log(genSpaces(depth) + 's-r-1: '+ (s-r-1))
                
                perms += 1 * getNumPermsForLength(r-2, depth+1) *  getNumPermsForLength(s-r-1, depth+1);
                
                console.log(genSpaces(depth) + 'perms so far: ' + perms)

            }
            console.warn(genSpaces(depth) + 'p return:' + perms)
            return(perms)
    }
}

var p = getNumPermsForLength;



function convertBucketsWithFillPathIdsToStr (bucketsWithFillPathIds) {//so can add to array and then check for whether it is already in arr (as just using []1.include([]b)) compares references, not values
    
    var tempStr = ''
    var i;
    for (i=0; i < bucketsWithFillPathIds.length; i++) {
        if (bucketsWithFillPathIds[i] === false) { //triple = requires as 0==false -> true, while 0 === false -> false
            
            tempStr += 'false'
            
        } else {
            tempStr += '' + bucketsWithFillPathIds[i];//'' + may not be required?
        }
    }
    return(tempStr)
}

function genBucketsWithIDsFromFillPath (numOfBuckets, path) {
    var i;
    var bucketsWithFillPathIds = []
    for (i=0; i < numOfBuckets; i++) {
        bucketsWithFillPathIds.push(false);
    }
    
    for (i=0; i < path.length; i++) {
        bucketsWithFillPathIds[path[i]] = i;
    }
    return(bucketsWithFillPathIds)
}



function tryToFindNumberOfPermuations(numBuckets, numIterations) {
    //<somevar> = runTest(numBuckets, true)
    
    var foundPerms = [];
    var i;
    var runTestReturn, bucketsWithPathAsStr;
    
    for (i=0; i < numIterations; i++) {
        runTestReturn = runTest(numBuckets, true);
        //console.log(runTestReturn)
        
        bucketsWithPathAsStr = convertBucketsWithFillPathIdsToStr(genBucketsWithIDsFromFillPath(numBuckets, runTestReturn.path));
        
        if (foundPerms.includes(bucketsWithPathAsStr)) {
            //console.log('already found')
        } else {
            foundPerms.push(bucketsWithPathAsStr)
        }
        
    }
    console.log(foundPerms)
    
    var numFirstBucketIsFilledPerms = 0;
    for (i=0; i < foundPerms.length; i++) {
        if (!(foundPerms[i][0] === 'f')) { //f for false
            numFirstBucketIsFilledPerms += 1;
        }
    }
    
    
    
    console.log('return value is only an estimate, actual may be higher (but not lower if this works correctly)')
    return({
        numFoundPerms: foundPerms.length,
        numFirstBucketIsFilledPerms: numFirstBucketIsFilledPerms,
        ratio: numFirstBucketIsFilledPerms/foundPerms.length,
    })
}



function convertBucketsToStr (buckets) {//so can add to array and then check for whether it is already in arr (as just using []1.include([]b)) compares references, not values
    
    var tempStr = ''
    var i;
    for (i=0; i < buckets.length; i++) {
        if (buckets[i] === false) { //triple = requires as 0==false -> true, while 0 === false -> false
            
            tempStr += '0';
            
        } else {
            tempStr += '1';
        }
    }
    return(tempStr)
}

function factorial (x) {//must be whole number
    if (x === 1) {
        return(1);
    } else {
        return(x*factorial(x-1))
    }
}

function getNumberOf1sInStr (str) {
    var i;
    var numOf1s = 0;
    for (i=0; i < str.length; i++) {
        if (str[i] === '1') {
            numOf1s += 1;
        }
    }
    return(numOf1s)
}

function tryToFindNumberOfPermuationsV2(numBuckets, numIterations) {
    //<somevar> = runTest(numBuckets, true)
    
    var foundPerms = [];
    var foundPermsFrequency = [];
    var i;
    var runTestReturn;
    var bucketsWithPathAsStr;
    
    for (i=0; i < numIterations; i++) {
        runTestReturn = runTest(numBuckets, true);
        //console.log(runTestReturn)
        
        bucketsWithPathAsStr = convertBucketsToStr(buckets);
        
        if (foundPerms.includes(bucketsWithPathAsStr)) {
            //console.log('already found')
            foundPermsFrequency[foundPerms.indexOf(bucketsWithPathAsStr)] += 1;
        } else {
            foundPerms.push(bucketsWithPathAsStr)
            foundPermsFrequency.push(1)
        }
        
    }
    
    var totalResultingPerms = []//ie counting 1/-/2/-/3 as different to 1/-/3/-/2 and 3/-/2/-/1
    
    var numFirstBucketIsFilledPerms = 0;
    
    var totalResultingPermsCount = 0;
    
    for (i=0; i < foundPerms.length; i++) {
        totalResultingPerms.push({
            basePerm: foundPerms[i],
            numberOfBucketsFilled: getNumberOf1sInStr(foundPerms[i]),
            totalPerms: factorial(getNumberOf1sInStr(foundPerms[i])),
            frequency: foundPermsFrequency[i],
        })
        totalResultingPermsCount += factorial(getNumberOf1sInStr(foundPerms[i]))
        if (foundPerms[i][0] === '1') {
            numFirstBucketIsFilledPerms += 1 * factorial(getNumberOf1sInStr(foundPerms[i]));
        }
    }
    
    
    //var numFirstBucketIsFilledPerms = 0;
    //for (i=0; i < foundPerms.length; i++) {
    //    if (!(foundPerms[i][0] === '0')) { //0 for empty
    //        numFirstBucketIsFilledPerms += 1;
    //    }
    //}
    
    console.log(totalResultingPermsCount)
    console.log(foundPerms)
    console.log(foundPermsFrequency)
    console.log(totalResultingPerms)
    
    console.log('return value is only an estimate, actual may be higher (but not lower if this works correctly)')
    return({
        numFoundBasePerms: foundPerms.length,
        numFirstBucketIsFilledPerms: numFirstBucketIsFilledPerms,
        ratio: numFirstBucketIsFilledPerms/totalResultingPermsCount,
        totalFoundPermsCount: totalResultingPermsCount,
        totalResultingPerms: totalResultingPerms,
    })
}


function genExcelCopyableDataFromTotalResultingPerms (totalResultingPerms) {
    var i;
    var resultStr = ['','','',''];
    
    for (i=0; i < totalResultingPerms.length; i++) {
        resultStr[0] +=  totalResultingPerms[i].basePerm + '\n'
        resultStr[1] +=  totalResultingPerms[i].numberOfBucketsFilled + '\n'
        resultStr[2] +=  totalResultingPerms[i].totalPerms + '\n'
        resultStr[3] +=  totalResultingPerms[i].frequency + '\n'
    }
    return(resultStr)
}





var ratioData = [];
//ratioData.push(['ratio','numFirstBucketIsFilledPerms','numFoundBasePerms','totalFoundPermsCount',])

function genRatioData (numItsPerLength, startLength, endLength) {
    var i;
    var tryToFindPermsReturn;
    
    for (i=startLength; i < endLength+1; i++) {
        console.warn('currently on length: ' + i)
        tryToFindPermsReturn = tryToFindNumberOfPermuationsV2(i,numItsPerLength);
        
        ratioData.push([
            i,
            tryToFindPermsReturn.ratio,
            tryToFindPermsReturn.numFirstBucketIsFilledPerms,
            tryToFindPermsReturn.numFoundBasePerms,
            tryToFindPermsReturn.totalFoundPermsCount,
        ])

        
    }
}


function convertRatioDataToCSV () {
    var i,i2;
    
    var csvStr = '';
    
    for (i=0; i < ratioData.length; i++) {
        for (i2=0; i2 < ratioData[i].length; i2++) {
            if (i2 + 1 === ratioData[i].length) {
                csvStr += ratioData[i][i2];
            } else {
                csvStr += ratioData[i][i2] + ',';
            }
        }
        csvStr += '\n'
    }
    return(csvStr);
}


/* test results 




0.43248   <- runMultipleTests(10000,10)  698700 = 0.6987 sec/test
0.432425  <- runMultipleTests(30000,20)  10103350 = 10.10335 sec/test
0.43228666666666665 <- runMultipleTests(50000,3)  29330667 = 29.3 sec/test
0.4328193333333366 <- runMultipleTests(500,3000) 1853 = 0.001853 sec/test
0.4323519999999999 <- runMultipleTests(5000,100) 184190 = 0.18419 sec/test
0.43286 <- runMultipleTests(50000,1) 31427000 = 31.427 sec/test

0.43209 <- runMultipleTests(100000,1) 133602000 = 133 sec/test









*/




