var levelDisplayNames;
function addLevels() {
  addLevelToPlayingOrder("training1");
  addLevelToPlayingOrder("training2");
  addLevelToPlayingOrder("training3");
  addLevelToPlayingOrder("training4");
  addLevelToPlayingOrder("training5");
  addLevelToPlayingOrder("training6");
  addLevelToPlayingOrder("stage1level1");
  addLevelToPlayingOrder("stage1level2a");
  addLevelToPlayingOrder("stage1level2b");
  addLevelToPlayingOrder("stage1level2c");
  addLevelToPlayingOrder("stage1level3a");
  addLevelToPlayingOrder("stage1level3b");
  addLevelToPlayingOrder("stage1level3c");
  addLevelToPlayingOrder("stage1level4a");
  addLevelToPlayingOrder("stage1level4b");
  addLevelToPlayingOrder("stage1level5");
  addLevelToPlayingOrder("stage1level6");
  addLevelToPlayingOrder("stage1level7");
  addLevelToPlayingOrder("stage1level8a");
  addLevelToPlayingOrder("stage1level8b");
  addLevelToPlayingOrder("stage1level9a");
  addLevelToPlayingOrder("stage1level9b");
  addLevelToPlayingOrder("stage1level9c");
  addLevelToPlayingOrder("stage1level9d");
  levelDisplayNames = {"test1":"test group - 1", "test2":"test group - 2", "test3":"test group - 3", "test4":"test group - 4", "training1":"Cut!", "training2":"Double", "training3":"Bounce!", "training4":"Speed!", "training5":"Spinning!", "training6":"Training", "stage1level1":"1/18 stage 1", "stage1level2a":"2/18 stage 1", "stage1level2b":"3/18 stage 1", "stage1level2c":"4/18 stage 1", "stage1level3a":"5/18 stage 1", "stage1level3b":"6/18 stage 1", "stage1level3c":"7/18 stage 1", "stage1level4a":"8/18 stage 1", 
  "stage1level4b":"9/18 stage 1", "stage1level5":"10/18 stage 1", "stage1level6":"11/18 stage 1", "stage1level7":"12/18 stage 1", "stage1level8a":"13/18 stage 1", "stage1level8b":"14/18 stage 1", "stage1level9a":"15/18 stage 1", "stage1level9b":"16/18 stage 1", "stage1level9c":"17/18 stage 1", "stage1level9d":"18/18 stage 1"};
  var i;
  var nameBase = "infiniteLevel";
  var nameTemp;
  for (i = 0; i < 50; i++) {
    nameTemp = nameBase + String(i + 1);
    addLevelToPlayingOrder(nameTemp);
    levelDisplayNames[nameTemp] = String(i + 1) + " stage 2";
  }
  levelIDsInPlayingOrder[0].data.unlocked = true;
}
var SeedAbleRandom = function(seed) {
  this.seed = seed;
};
SeedAbleRandom.prototype.getRand = function() {
  var x = Math.sin(this.seed++) * 10000;
  return x - Math.floor(x);
};
function getMapForLevelID(levelID, addCells, includeInitialCellPositions) {
  var dirTemp, speedTemp;
  var tempMap = createNewMap(null, null);
  if (includeInitialCellPositions) {
    tempMap.initialCellPositions = [];
  }
  var addCellToMapWrapper = function(x, y, size, xv, yv) {
    if (includeInitialCellPositions) {
      tempMap.initialCellPositions.push({x:x, y:y, size:size, xv:xv, yv:yv, speedBoostedFramesLeft:0, boostedSpeedLeftToRemove:0, color:"#FF0000", huePartOfHSLColour:"0"});
    }
    if (addCells) {
      createNewCell(x, y, size, xv, yv);
    }
  };
  if (levelID === "training1") {
    tempMap.descTexts = ["Swipe to cut", "Reduce the area below 10% to pass"];
    tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
    dirTemp = Math.PI * 2 * 0.8979;
    speedTemp = 1;
    addCellToMapWrapper(0, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
  } else {
    if (levelID === "training2") {
      tempMap.descTexts = ["Cells die if you cut them off the map", "Keep all cells alive to pass"];
      tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
      dirTemp = Math.PI * 2 * 0.8979;
      speedTemp = 1;
      addCellToMapWrapper(0, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
      dirTemp = Math.PI * 2 * 0.123;
      speedTemp = 1;
      addCellToMapWrapper(50, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
    } else {
      if (levelID === "training3") {
        tempMap.descTexts = ["Cells bounce off each other and the walls"];
        tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
        dirTemp = Math.PI * 2 * 0.8979;
        speedTemp = 1;
        addCellToMapWrapper(45, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
        dirTemp = Math.PI * 2 * 0.623;
        speedTemp = 1;
        addCellToMapWrapper(50, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
      } else {
        if (levelID === "training4") {
          tempMap.descTexts = ["Cells are temporarily sped up by boosts"];
          tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
          dirTemp = Math.PI * 2 * 0.4379;
          speedTemp = 1;
          addCellToMapWrapper(-30, 80, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
          dirTemp = Math.PI * 2 * 0.653;
          speedTemp = 1;
          addCellToMapWrapper(30, -40, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
          addAllDirectionalBooster(tempMap, 0, 0, 10, 120);
        } else {
          if (levelID === "training5") {
            tempMap.descTexts = ["Cells also bounce off other objects"];
            tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
            dirTemp = Math.PI * 2 * 0.1;
            speedTemp = 1;
            addCellToMapWrapper(-70, -60, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
            dirTemp = Math.PI * 2;
            speedTemp = 1;
            addCellToMapWrapper(50, -60, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
            addRotatingArm(tempMap, -50, 0, 30, 1, Math.PI * 2 * -.1, 0.07, 1);
            addRotatingArm(tempMap, 40, -10, 40, 1, Math.PI * 2 * 0.180, 0, 1);
          } else {
            if (levelID === "training6") {
              tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
              addAllDirectionalBooster(tempMap, -50, 0, 10, 120);
              dirTemp = Math.PI * 2 * 0.7734;
              speedTemp = 1;
              addCellToMapWrapper(0, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
              dirTemp = Math.PI * 2 * 0.52346;
              speedTemp = 1;
              addCellToMapWrapper(0, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
              addRotatingArm(tempMap, 50, -50, 30, 1, Math.PI * 2, 0.07, 1);
              addRotatingArm(tempMap, 20, 56, 30, 1, Math.PI * 2 * 0.34, -.01, 1);
            } else {
              if (levelID === "stage1level1") {
                tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                dirTemp = Math.PI * 2 * 0.7734;
                speedTemp = 1;
                addCellToMapWrapper(0, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                dirTemp = Math.PI * 2 * 0.52346;
                speedTemp = 1;
                addCellToMapWrapper(0, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                dirTemp = Math.PI * 2 * 0.22346;
                speedTemp = 1;
                addCellToMapWrapper(40, 30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
              } else {
                if (levelID.startsWith("stage1level2")) {
                  tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                  addAllDirectionalBooster(tempMap, 0, 0, 10, 120);
                  addAllDirectionalBooster(tempMap, 50, 50, 10, 120);
                  addAllDirectionalBooster(tempMap, 50, -50, 10, 120);
                  addAllDirectionalBooster(tempMap, -50, 50, 10, 120);
                  addAllDirectionalBooster(tempMap, -50, -50, 10, 120);
                  switch(levelID) {
                    case "stage1level2a":
                      dirTemp = Math.PI * 2 * 0.2;
                      speedTemp = 1;
                      addCellToMapWrapper(40, -70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.5;
                      speedTemp = 1;
                      addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      break;
                    case "stage1level2b":
                      dirTemp = Math.PI * 2 * 0.2;
                      speedTemp = 1;
                      addCellToMapWrapper(40, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.5;
                      speedTemp = 1;
                      addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.8;
                      speedTemp = 1;
                      addCellToMapWrapper(20, 50, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      break;
                    case "stage1level2c":
                      dirTemp = Math.PI * 2 * 0.2;
                      speedTemp = 1;
                      addCellToMapWrapper(40, -80, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.5;
                      speedTemp = 1;
                      addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.8;
                      speedTemp = 1;
                      addCellToMapWrapper(20, 50, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      dirTemp = Math.PI * 2 * 0.8;
                      speedTemp = 1;
                      addCellToMapWrapper(-70, 10, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      break;
                    default:
                      console.error("levelID ending not known, levelID:" + levelID);
                  }
                } else {
                  if (levelID.startsWith("stage1level3")) {
                    tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                    addRotatingArm(tempMap, 30 / Math.SQRT2, 30 / Math.SQRT2, 30, 1, Math.PI * 1.25, -.01, 0);
                    addRotatingArm(tempMap, 30 / Math.SQRT2, -30 / Math.SQRT2, 30, 1, Math.PI * -.25, -.01, 0);
                    addRotatingArm(tempMap, -30 / Math.SQRT2, 30 / Math.SQRT2, 30, 1, Math.PI * 0.75, -.01, 0);
                    addRotatingArm(tempMap, -30 / Math.SQRT2, -30 / Math.SQRT2, 30, 1, Math.PI * 0.25, -.01, 0);
                    addAllDirectionalBooster(tempMap, 50, 0, 10, 120);
                    addAllDirectionalBooster(tempMap, -50, 0, 10, 120);
                    addAllDirectionalBooster(tempMap, 0, 50, 10, 120);
                    addAllDirectionalBooster(tempMap, 0, -50, 10, 120);
                    switch(levelID) {
                      case "stage1level3a":
                        dirTemp = Math.PI * 2 * 0.9;
                        speedTemp = 1;
                        addCellToMapWrapper(-40, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.5;
                        speedTemp = 1;
                        addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        break;
                      case "stage1level3b":
                        dirTemp = Math.PI * 2 * 0.2;
                        speedTemp = 1;
                        addCellToMapWrapper(40, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.5;
                        speedTemp = 1;
                        addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.8;
                        speedTemp = 1;
                        addCellToMapWrapper(20, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        break;
                      case "stage1level3c":
                        dirTemp = Math.PI * 2 * 0.2;
                        speedTemp = 1;
                        addCellToMapWrapper(40, -30, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.5;
                        speedTemp = 1;
                        addCellToMapWrapper(70, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.8;
                        speedTemp = 1;
                        addCellToMapWrapper(20, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        dirTemp = Math.PI * 2 * 0.1;
                        speedTemp = 1;
                        addCellToMapWrapper(80, -10, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        break;
                      default:
                        console.error("levelID ending not known, levelID:" + levelID);
                    }
                  } else {
                    if (levelID.startsWith("stage1level4")) {
                      tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                      addRotatingArm(tempMap, (30 + 15) / Math.SQRT2, (30 + 10) / Math.SQRT2, 30, 1, Math.PI * 1.25, -.01, 1);
                      addRotatingArm(tempMap, (30 + 15) / Math.SQRT2, -(30 + 10) / Math.SQRT2, 30, 1, Math.PI * -.25, -.01, 1);
                      addRotatingArm(tempMap, -(30 + 15) / Math.SQRT2, (30 + 10) / Math.SQRT2, 30, 1, Math.PI * 0.75, -.01, 1);
                      addRotatingArm(tempMap, -(30 + 15) / Math.SQRT2, -(30 + 10) / Math.SQRT2, 30, 1, Math.PI * 0.25, -.01, 1);
                      addAllDirectionalBooster(tempMap, 0, 0, 10, 120);
                      speedTemp = 1;
                      switch(levelID) {
                        case "stage1level4a":
                          dirTemp = Math.PI * 2 * 0.25;
                          addCellToMapWrapper(-80, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          dirTemp = Math.PI * 2 * 0.75;
                          addCellToMapWrapper(80, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          break;
                        case "stage1level4b":
                          dirTemp = Math.PI * 2 * 0;
                          addCellToMapWrapper(0, -80, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          dirTemp = Math.PI * 2 * 0.25;
                          addCellToMapWrapper(-80, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          dirTemp = Math.PI * 2 * 0.5;
                          addCellToMapWrapper(0, 80, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          dirTemp = Math.PI * 2 * 0.75;
                          addCellToMapWrapper(80, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          break;
                        default:
                          console.error("levelID ending not known, levelID:" + levelID);
                      }
                    } else {
                      if (levelID === "stage1level5") {
                        tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                        speedTemp = 1;
                        dirTemp = Math.PI * 2 * 0.2;
                        addCellToMapWrapper(-40, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        speedTemp = 3;
                        dirTemp = Math.PI * 2 * 0.7;
                        addCellToMapWrapper(60, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                        speedTemp = 3;
                        dirTemp = Math.PI * 2 * 0.54;
                        addCellToMapWrapper(0, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                      } else {
                        if (levelID === "stage1level6") {
                          tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                          speedTemp = 1;
                          dirTemp = Math.PI * 2 * 0.2;
                          addCellToMapWrapper(-40, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          speedTemp = 3;
                          dirTemp = Math.PI * 2 * 0.7;
                          addCellToMapWrapper(60, 0, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          speedTemp = 3;
                          dirTemp = Math.PI * 2 * 0.54;
                          addCellToMapWrapper(90, 70, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                          addAllDirectionalBooster(tempMap, 0, 0, 10, 120);
                          addRotatingArm(tempMap, -50, 0, 25, 1, Math.PI * 0.5, -.1, 1);
                          addRotatingArm(tempMap, 50, 0, 25, 1, Math.PI * 1.5, -.1, 1);
                        } else {
                          if (levelID === "stage1level7") {
                            tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                            speedTemp = 1;
                            dirTemp = Math.PI * 2 * 0.2;
                            addCellToMapWrapper(60, 60, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                            addCellToMapWrapper(20, 20, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                            addCellToMapWrapper(-20, -20, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                            addCellToMapWrapper(-60, -60, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                            addAllDirectionalBooster(tempMap, 0, -80, 10, 120);
                            addAllDirectionalBooster(tempMap, -40, 60, 10, 120);
                          } else {
                            if (levelID.startsWith("stage1level8")) {
                              tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                              addRotatingArm(tempMap, 40, 0, 25, 1, Math.PI * 1.5, -.025, 1);
                              addAllDirectionalBooster(tempMap, 0, 60, 10, 120);
                              switch(levelID) {
                                case "stage1level8a":
                                  speedTemp = 1.5;
                                  addCellToMapWrapper(50, -50, options.cellSize, 1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(-50, 50, options.cellSize, -1 * speedTemp, 1 * speedTemp);
                                  break;
                                case "stage1level8b":
                                  speedTemp = 1;
                                  addCellToMapWrapper(50, 50, options.cellSize, 1 * speedTemp, 1 * speedTemp);
                                  addCellToMapWrapper(50, -50, options.cellSize, 1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(-50, 50, options.cellSize, -1 * speedTemp, 1 * speedTemp);
                                  addCellToMapWrapper(-50, -50, options.cellSize, -1 * speedTemp, -1 * speedTemp);
                                  break;
                                default:
                                  console.error("levelID ending not known, levelID:" + levelID);
                              }
                            } else {
                              if (levelID.startsWith("stage1level9")) {
                                tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                                speedTemp = 1;
                                addAllDirectionalBooster(tempMap, 0, 60, 10, 120);
                                addAllDirectionalBooster(tempMap, 60, 60, 10, 120);
                                addAllDirectionalBooster(tempMap, -60, 60, 10, 120);
                                switch(levelID) {
                                  case "stage1level9a":
                                    addCellToMapWrapper(80, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(80, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                    break;
                                  case "stage1level9b":
                                    addCellToMapWrapper(80, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(80, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(-80, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(-80, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                    break;
                                  case "stage1level9c":
                                    addCellToMapWrapper(80, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(80, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(-80, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(-80, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(10, 0, options.cellSize, 0, -1 * speedTemp);
                                    addCellToMapWrapper(-10, 0, options.cellSize, 0, -1 * speedTemp);
                                    break;
                                  case "stage1level9d":
                                    addCellToMapWrapper(80, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(80, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(-80, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(-80, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(30, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(30, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                    addCellToMapWrapper(-30, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                    addCellToMapWrapper(-30, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                    break;
                                  default:
                                    console.error("levelID ending not known, levelID:" + levelID);
                                }
                              } else {
                                if (levelID === "screenshotlevel") {
                                  tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                                  speedTemp = 1;
                                  addAllDirectionalBooster(tempMap, 0, 60, 10, 120);
                                  addAllDirectionalBooster(tempMap, 60, 60, 10, 120);
                                  addAllDirectionalBooster(tempMap, -60, 60, 10, 120);
                                  addAllDirectionalBooster(tempMap, 0, -60, 10, 120);
                                  addAllDirectionalBooster(tempMap, 60, -60, 10, 120);
                                  addAllDirectionalBooster(tempMap, -60, -60, 10, 120);
                                  addCellToMapWrapper(80, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(80, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                  addCellToMapWrapper(-80, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(-80, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                  addCellToMapWrapper(30, 50, options.cellSize, -1 * 1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(30, -50, options.cellSize, -1 * 1 * speedTemp, 1 * speedTemp);
                                  addCellToMapWrapper(-30, 50, options.cellSize, -1 * -1 * speedTemp, -1 * speedTemp);
                                  addCellToMapWrapper(-30, -50, options.cellSize, -1 * -1 * speedTemp, 1 * speedTemp);
                                } else {
                                  if (levelID.startsWith("infiniteLevel")) {
                                    var numCellsToCreate = Number(levelID.substr("infiniteLevel".length));
                                    tempMap.points = [{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}];
                                    var seededRandomForMap = new SeedAbleRandom(numCellsToCreate);
                                    addAllDirectionalBooster(tempMap, 0, 0, 10, 120);
                                    var i;
                                    for (i = 0; i < numCellsToCreate; i++) {
                                      speedTemp = Math.log(i + 1) + 1;
                                      dirTemp = Math.PI * 2 * seededRandomForMap.getRand();
                                      addCellToMapWrapper((seededRandomForMap.getRand() * 2 - 1) * 80, (seededRandomForMap.getRand() * 2 - 1) * 80, options.cellSize, Math.sin(dirTemp) * speedTemp, Math.cos(dirTemp) * speedTemp);
                                    }
                                  } else {
                                    console.error("levelID not known: " + levelID);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (typeof tempMap.descTexts === "undefined") {
    tempMap.descTexts = [];
  }
  return tempMap;
}
;