var cl = console.log;
var mouseState = 0;
var cameraX = 0;
var cameraY = 0;
var mouseposx = 0;
var mouseposy = 0;
var centerX = 480;
var centerY = 270;
var zoom = 1.7;
var frame = 0;
var ctx;
var fps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var cameraOffsetX = 0;
var cameraOffsetY = 0;
var fpsDelta;
var lastCalledTime;
var physicsFrame = 0;
var frameskip = 0;
var DOMBody = document.getElementById("body");
var currentLevel = {id:"none-loaded", originalArea:-1, originalNumCells:-1, levelDisplayName:"none-loaded"};
var inputType = 1;
var colourScheme;
function setColorSchemeToNormalGameOne() {
  colourScheme = {rotatingArm:"hsla(0, 0%, 60%, 1)", circularBooster:{one:"hsla(0, 0%, 38%, 1)", two:"hsla(0, 0%, 56%, 1)"}, map:{mainColor:"hsla(0, 0%, 73%, 1)"}, background:"hsla(240, 100%, 5%, 1)"};
}
setColorSchemeToNormalGameOne();
var cells = [];
var particlesCreatedPreviousLevelRuns = [];
var textParticles = [];
var map = createNewMap();
var oldMaps = {};
var allOldMaps = [];
var mousePosHistory = [];
var particles = [];
var options = {maxMousePosHistoryLength:300, sliceMinMouseVelocitySquared:Math.pow(0.01, 2), render:{stopParticlesOnWall:true}, cellSize:10, cellCollisions:true, particleSizeMultiplier:10, requiredCutStraightFactor:3.2, renderOldMaps:true, oldMapsMargin:0, levelSuccessSpacer:{marginTopAndBottom:30}, levelPassesMapMorphDuration:60, doNotTryToFullscreen:true};
var dev = {on:true, renderCurMapOutline:false, renderAllMapOutlines:false, renderYZeroLine:false, showFPS:false, disableKeyboardControls:true};
var ui = {scene:3, levelFailedData:{areaFractionLeft:-1, cellDeaths:-1, startZoomLevel:-1, startWorldPos:{x:NaN, y:NaN}, splitFailCutMap:undefined, levelID:"undefined", levelDisplayName:"undefined", score:-1, animation:{curDisplayedScore:-1, frame:-1, explodedMapObjs:false, explodedCells:false}}, levelSuccessData:{areaFractionLeft:-1, startZoomLevel:-1, startWorldPos:{x:NaN, y:NaN}, levelID:"undefined", levelDisplayName:"undefined", score:-1, animation:{curDisplayedScore:-1, frame:-1}}, scrollingToNextLevel:{animation:{curScrolling:false, 
frame:-1, frameDuration:-1, addedMapToOldMaps:false, endCameraOffset:{x:undefined, y:undefined}, startCameraOffset:{x:undefined, y:undefined}, renderOldMapsForCurLevelOffset:0, pastLevelsStackHeightShifting:undefined, orignalPastLevelsStackHeight:undefined}}, scrollingToNextDifferentLevel:{animation:{curScrolling:false, frame:-1, frameDuration:-1, addedMapToOldMaps:false, endCameraOffset:{x:undefined, y:undefined}, startCameraOffset:{x:undefined, y:undefined}, renderOldMapsForCurLevelOffset:0, pastLevelsStackHeightShifting:undefined, 
orignalPastLevelsStackHeight:undefined, morphMapData:{animationData:undefined, extraAnimatedOffset:{x:undefined, y:undefined}}, morphCellsData:{animationData:undefined, extraAnimatedOffset:{x:undefined, y:undefined}}, extremeYValuesForSpacer:undefined, extremeYValuesForNextLevel:undefined}, nextLevelData:{exists:undefined, levelData:{id:undefined, data:{map:undefined, index:undefined, unlocked:undefined}}}}};
var pastLevelsStackHeight = 0;
var highestOldMapForCurLevel = {map:undefined, offset:{x:undefined, y:undefined}};
var levelIDsInPlayingOrder = [];
function addLevelToPlayingOrder(levelID) {
  levelIDsInPlayingOrder.push({id:levelID, data:{unlocked:false, map:getMapForLevelID(levelID, false, true), index:levelIDsInPlayingOrder.length}});
}
var storyFrame = -1;
var decayTitleScreenTextParticles = false;
var titleScreenAnimation = {curFrame:-1, totalFrames:undefined, preClickFrames:0};
function startGame() {
  setup();
  gameArea.start();
}
var gameArea = {canvas:document.createElement("canvas"), start:function() {
  this.canvas.width = centerX * 2;
  this.canvas.height = centerY * 2;
  this.canvas.id = "canvas";
  this.context = this.canvas.getContext("2d");
  document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  this.interval = setInterval(updateGameArea, 1000 / 60);
  window.addEventListener("keydown", function(e) {
    gameArea.keys = gameArea.keys || [];
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });
  window.addEventListener("keyup", function(e) {
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });
  ctx = gameArea.context;
}, clear:function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}};
var haveAlreadyFullscreened = false;
function setup() {
  loadTextParticles(tenPercentTextAsCirclesData, 0.4, {x:-100, y:-100});
  if (!options.doNotTryToFullscreen) {
    gameArea.canvas.onmousedown = function(e) {
      if (!haveAlreadyFullscreened) {
        document.body.requestFullscreen();
        e.preventDefault();
        e.stopPropagation();
        haveAlreadyFullscreened = true;
      }
    };
  }
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}
function saveCanvas() {
  canvas.toBlob(function(blob) {
    saveAs(blob, "vx.x.x-" + generateId() + ".png");
  }, "image/png");
}
function drawRotatedRect(x, y, width, height, angle, color) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.rect(-width / 2, -height, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
function drawRotatedImage(image, x, y, xsize, ysize, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle * Math.PI / 180);
  ctx.drawImage(image, -(xsize / 2), -(ysize / 2), xsize, ysize);
  ctx.restore();
}
function drawRotatedNonCenteredImage(image, x, y, xsize, ysize, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle * Math.PI / 180);
  ctx.drawImage(image, -(xsize / 2), -ysize, xsize, ysize);
  ctx.restore();
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
function toDegrees(angle) {
  return angle / (Math.PI / 180);
}
function getDirection(deltaX, deltaY) {
  return Math.atan2(deltaX, deltaY);
}
function getDistance(deltaX, deltaY) {
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}
function getSquareOfDistance(deltaX, deltaY) {
  return Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
}
function component(width, height, color, x, y) {
  this.gamearea = gameArea;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.v = 0;
  this.update = function() {
    drawRotatedRect(cameraX - this.x, cameraY - this.y, this.width, this.height, direction, color);
  };
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };
}
function createNewCell(x, y, size, xv, yv) {
  cells.push({x:x, y:y, size:size, xv:xv, yv:yv, speedBoostedFramesLeft:0, boostedSpeedLeftToRemove:0, color:"#FF0000", huePartOfHSLColour:"0"});
}
function createNewParticle(x, y, size, xv, yv, vDecayRate, sizeDecayRate, color, mapBoundaryStoppingMode) {
  var createParticleTemp = {x:x, y:y, size:size, xv:xv, yv:yv, vDecayRate:vDecayRate, sizeDecayRate:sizeDecayRate, color:color, mapBoundaryStoppingMode:mapBoundaryStoppingMode, offset:getMapStackOffsetCurLevel(), stoppedOnOldMapWall:false, offsetShiftLastFrame:{x:undefined, y:undefined, lastRenderFrameUpdated:undefined}};
  particles.push(createParticleTemp);
}
function addNewObjectToMap(tempMap, type, x, y, boundingBox, data) {
  tempMap.objects.push({type:type, x:x, y:y, frame:0, data:data, boundingBox:boundingBox});
}
function createNewMap(points, objects) {
  if (points === null || points === undefined) {
    points = [];
  }
  if (objects === null || objects === undefined) {
    objects = [];
  }
  return {points:points, objects:objects, data:{render:{spacer:{isSpacer:false, type:undefined, marginTop:undefined, marginBottom:undefined}}}};
}
function addAllDirectionalBooster(tempMap, x, y, radius, power) {
  addNewObjectToMap(tempMap, 0, x, y, {halfX:radius, halfY:radius}, {radius:radius, power:power});
}
function addRotatingArm(tempMap, x, y, length, mass, startAngle, startAngularVel, angularFriction) {
  addNewObjectToMap(tempMap, 1, x, y, {halfX:length, halfY:length}, {angle:startAngle, angularVel:startAngularVel, mass:mass, length:length, width:length / 5, angularFriction:angularFriction, recentlyHitCells:[]});
}
function setMap(levelID) {
  map = getMapForLevelID(levelID, true, false);
  currentLevel.id = levelID;
  currentLevel.originalArea = getAreaOfMap();
  currentLevel.originalNumCells = cells.length;
  currentLevel.levelDisplayName = levelDisplayNames[levelID];
  currentLevel.frame = 0;
  currentLevel.originalExtremeYValues = getMaxAndMinYValuesForTempMap(map);
  currentLevel.descTexts = map.descTexts;
}
function getMaxAndMinYValuesForTempMap(tempMap) {
  var i;
  if (tempMap.data.render.spacer.isSpacer) {
    return {minY:tempMap.data.render.spacer.marginBottom, maxY:tempMap.data.render.spacer.marginTop};
  } else {
    var minY = Infinity;
    var maxY = -Infinity;
    for (i = 0; i < tempMap.points.length; i++) {
      if (tempMap.points[i].y > maxY) {
        maxY = tempMap.points[i].y;
      }
      if (tempMap.points[i].y < minY) {
        minY = tempMap.points[i].y;
      }
    }
    return {minY:minY, maxY:maxY};
  }
}
function addMapToStoredOldMaps() {
  var extremeYValues = getMaxAndMinYValuesForTempMap(map);
  allOldMaps.push({map:JSON.parse(JSON.stringify(map)), minY:extremeYValues.minY, maxY:extremeYValues.maxY});
}
function getBottomRenderYPosOfCurMapInPlayFromHeightOfOldMapsStackForLevelID(levelID) {
  var i;
  var oldMapsArrForLevelID = allOldMaps;
  if (typeof oldMapsArrForLevelID !== "undefined") {
    var curYPos = 0;
    var curOldMap;
    for (i = 0; i < oldMapsArrForLevelID.length; i++) {
      curOldMap = oldMapsArrForLevelID[i];
      if (i > 0) {
        curYPos += -curOldMap.minY + oldMapsArrForLevelID[i - 1].maxY + options.oldMapsMargin;
      }
      if (i === oldMapsArrForLevelID.length - 1) {
        return curYPos + curOldMap.maxY;
      }
    }
    return 0;
  } else {
    console.warn("no oldMaps arr found for levelID:" + levelID);
    return 0;
  }
}
function renderOldMaps() {
  var i;
  var oldMapsArrForLevelID = allOldMaps;
  var renderOldMapCurOffset;
  if (typeof oldMapsArrForLevelID !== "undefined") {
    var curYPos = 0;
    var curOldMap;
    for (i = 0; i < oldMapsArrForLevelID.length; i++) {
      curOldMap = oldMapsArrForLevelID[i];
      if (i > 0) {
        curYPos += -curOldMap.minY + oldMapsArrForLevelID[i - 1].maxY + options.oldMapsMargin;
      }
      renderOldMapCurOffset = {x:0, y:curYPos};
      if ((cameraY - (renderOldMapCurOffset.y + curOldMap.maxY)) * zoom > canvas.height) {
      } else {
        renderMap(curOldMap.map, renderOldMapCurOffset);
      }
      if (i === oldMapsArrForLevelID.length - 1) {
        highestOldMapForCurLevel.map = curOldMap.map;
        highestOldMapForCurLevel.offset = renderOldMapCurOffset;
      }
    }
  }
}
function getMapWithPointsMovedAwayFromCenterOfMap(distToMove) {
  var i;
  var meanPos = {x:0, y:0};
  for (i = 0; i < map.points.length; i++) {
    meanPos.x += map.points[i].x;
    meanPos.y += map.points[i].y;
  }
  meanPos.x /= map.points.length;
  meanPos.y /= map.points.length;
  var tempMap = createNewMap();
  for (i = 0; i < map.points.length; i++) {
    var originalPoint = map.points[i];
    var direction = getDirection(originalPoint.x - meanPos.x, originalPoint.y - meanPos.y);
    tempMap.points.push({x:originalPoint.x + Math.sin(direction) * distToMove, y:originalPoint.y + Math.cos(direction) * distToMove});
  }
  return tempMap;
}
function renderMap(tempMap, offset) {
  var i;
  if (dev.on && dev.renderCurMapOutline) {
    var extremeYValues = getMaxAndMinYValuesForTempMap(tempMap);
    ctx.beginPath();
    ctx.rect((cameraX - 100) * zoom, (cameraY - (extremeYValues.maxY + offset.y)) * zoom, 200 * zoom, (extremeYValues.maxY - extremeYValues.minY) * zoom);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3 * zoom;
    ctx.stroke();
  }
  if (tempMap.data.render.spacer.isSpacer) {
    tempMap.data.render.spacer.frame += 1;
    switch(tempMap.data.render.spacer.type) {
      case 0:
        if (tempMap.data.render.spacer.frame < tempMap.data.render.spacer.fadeInDuration) {
          ctx.fillStyle = "hsla(0, 100%, 100%," + getSmoothAnimationCurveValueForPoint(tempMap.data.render.spacer.frame / tempMap.data.render.spacer.fadeInDuration) + ")";
        } else {
          ctx.fillStyle = "#FFFFFF";
        }
        ctx.font = 11 * zoom + "px Arial";
        var textToRender = "Passed " + tempMap.data.render.spacer.levelName + " : " + tempMap.data.render.spacer.areaAsPercent + "% " + tempMap.data.render.spacer.score;
        ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - offset.x) * zoom, (cameraY - offset.y) * zoom);
        break;
      default:
        console.error("map spacer type not known:" + tempMap.data.render.spacer.type);
    }
  } else {
    ctx.beginPath();
    ctx.moveTo((cameraX - (tempMap.points[0].x + offset.x)) * zoom, (cameraY - (tempMap.points[0].y + offset.y)) * zoom);
    for (i = 1; i < tempMap.points.length; i++) {
      ctx.lineTo((cameraX - (tempMap.points[i].x + offset.x)) * zoom, (cameraY - (tempMap.points[i].y + offset.y)) * zoom);
    }
    ctx.lineTo((cameraX - (tempMap.points[0].x + offset.x)) * zoom, (cameraY - (tempMap.points[0].y + offset.y)) * zoom);
    ctx.fillStyle = colourScheme.map.mainColor;
    ctx.fill();
  }
}
function renderParticles(tempParticles) {
  var i;
  var particle;
  for (i = 0; i < tempParticles.length; i++) {
    particle = tempParticles[i];
    ctx.beginPath();
    ctx.arc((cameraX - (particle.x + particle.offset.x)) * zoom, (cameraY - (particle.y + particle.offset.y)) * zoom, particle.size * zoom / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = particle.color;
    ctx.fill();
  }
}
function generateAnimationDataObjForMorphingMaps(startMap, targetMap) {
  var i;
  var animationData = {frame:-1, mergePoints:{points:[]}};
  if (startMap.points.length > targetMap.points.length) {
    var pointsToRemoveFractionalCounter = 0;
    var pointsIndexesToKeep = [];
    var pointsIndexesToRemove = [];
    for (i = 0; i < startMap.points.length; i++) {
      pointsToRemoveFractionalCounter += (startMap.points.length - targetMap.points.length) / targetMap.points.length;
      if (pointsToRemoveFractionalCounter > 1) {
        pointsToRemoveFractionalCounter -= startMap.points.length / targetMap.points.length;
        pointsIndexesToRemove.push(i);
      } else {
        pointsIndexesToKeep.push(i);
      }
    }
    var pointsIndexesToKeepCurIndex = -1;
    for (i = 0; i < pointsIndexesToRemove.length; i++) {
      var indexOfPointToRemove = pointsIndexesToRemove[i];
      while (true) {
        if (pointsIndexesToKeep[pointsIndexesToKeepCurIndex + 1] < indexOfPointToRemove) {
          pointsIndexesToKeepCurIndex += 1;
        } else {
          break;
        }
      }
      var nextToKeepPointIndex;
      if (pointsIndexesToKeepCurIndex + 1 < pointsIndexesToKeep.length) {
        nextToKeepPointIndex = pointsIndexesToKeepCurIndex + 1;
      } else {
        nextToKeepPointIndex = 0;
      }
      var prevToKeepPointIndex;
      if (pointsIndexesToKeepCurIndex < 0) {
        prevToKeepPointIndex = pointsIndexesToKeep.length - 1;
      } else {
        prevToKeepPointIndex = pointsIndexesToKeepCurIndex;
      }
      if (getSquareOfDistance(startMap.points[indexOfPointToRemove].x - startMap.points[pointsIndexesToKeep[prevToKeepPointIndex]].x, startMap.points[indexOfPointToRemove].y - startMap.points[pointsIndexesToKeep[prevToKeepPointIndex]].y) < getSquareOfDistance(startMap.points[indexOfPointToRemove].x - startMap.points[pointsIndexesToKeep[nextToKeepPointIndex]].x, startMap.points[indexOfPointToRemove].y - startMap.points[pointsIndexesToKeep[nextToKeepPointIndex]].y)) {
        animationData.mergePoints.points[indexOfPointToRemove] = {keep:false, startPos:startMap.points[indexOfPointToRemove], endPos:targetMap.points[prevToKeepPointIndex]};
      } else {
        animationData.mergePoints.points[indexOfPointToRemove] = {keep:false, startPos:startMap.points[indexOfPointToRemove], endPos:targetMap.points[nextToKeepPointIndex]};
      }
    }
    for (i = 0; i < pointsIndexesToKeep.length; i++) {
      animationData.mergePoints.points[pointsIndexesToKeep[i]] = {keep:true, startPos:startMap.points[pointsIndexesToKeep[i]], endPos:targetMap.points[i]};
    }
  } else {
    if (startMap.points.length < targetMap.points.length) {
      for (i = 0; i < startMap.points.length; i++) {
        animationData.mergePoints.points.push({keep:true, startPos:startMap.points[i], endPos:targetMap.points[i]});
      }
      for (i = startMap.points.length; i < targetMap.points.length; i++) {
        animationData.mergePoints.points.push({keep:true, startPos:startMap.points[startMap.points.length - 1], endPos:targetMap.points[i]});
      }
    } else {
      for (i = 0; i < startMap.points.length; i++) {
        animationData.mergePoints.points.push({keep:true, startPos:startMap.points[i], endPos:targetMap.points[i]});
      }
    }
  }
  return animationData;
}
function getSmoothAnimationCurveValueForPoint(fraction) {
  return 6.75 * (Math.pow(fraction * 2 / 3, 2) - Math.pow(fraction * 2 / 3, 3));
}
function renderAnimationForMorphingMapsFromAnimationDataObj(animationData, frameCompletionFraction, extraAnimatedOffset) {
  var i;
  var scrollMultiplier;
  var tempMap = createNewMap(null, null);
  scrollMultiplier = getSmoothAnimationCurveValueForPoint(frameCompletionFraction);
  for (i = 0; i < animationData.mergePoints.points.length; i++) {
    var curPointData = animationData.mergePoints.points[i];
    tempMap.points.push({x:curPointData.startPos.x + (curPointData.endPos.x - curPointData.startPos.x) * scrollMultiplier, y:curPointData.startPos.y + (curPointData.endPos.y - curPointData.startPos.y) * scrollMultiplier});
  }
  var offset = getMapStackOffsetCurLevel();
  offset.x += extraAnimatedOffset.x * scrollMultiplier;
  offset.y += extraAnimatedOffset.y * scrollMultiplier;
  renderMap(tempMap, offset);
}
function generateAnimationDataObjForMorphingCells(startCells, endCells) {
  var i;
  var animationData = {cells:[]};
  if (startCells.length > endCells.length) {
    for (i = 0; i < endCells.length; i++) {
      animationData.cells.push({start:startCells[i], end:endCells[i]});
    }
    for (i = endCells.length; i < startCells.length; i++) {
      explodeCell(startCells[i], 0);
    }
  } else {
    if (startCells.length < endCells.length) {
      for (i = 0; i < startCells.length; i++) {
        animationData.cells.push({start:startCells[i], end:endCells[i]});
      }
      for (i = startCells.length; i < endCells.length; i++) {
        animationData.cells.push({start:startCells[i % startCells.length], end:endCells[i]});
      }
    } else {
      for (i = 0; i < startCells.length; i++) {
        animationData.cells.push({start:startCells[i], end:endCells[i]});
      }
    }
  }
  return animationData;
}
function renderAnimationForMorphingCellsFromAnimationDataObj(animationData, frameCompletionFraction, extraAnimatedOffset) {
  var i;
  var scrollMultiplier = getSmoothAnimationCurveValueForPoint(frameCompletionFraction);
  var tempCells = [];
  var cell;
  var endCell;
  for (i = 0; i < animationData.cells.length; i++) {
    cell = JSON.parse(JSON.stringify(animationData.cells[i].start));
    endCell = animationData.cells[i].end;
    cell.speedBoostedFramesLeft *= 1 - scrollMultiplier;
    cell.huePartOfHSLColour = Math.floor(Math.tanh(cell.speedBoostedFramesLeft / 300) * 360);
    cell.color = "hsla(" + cell.huePartOfHSLColour + ", 100%, 50%,1)";
    cell.size = cell.size + (endCell.size - cell.size) * scrollMultiplier;
    cell.x = cell.x + (endCell.x - cell.x) * scrollMultiplier;
    cell.y = cell.y + (endCell.y - cell.y) * scrollMultiplier;
    tempCells.push(cell);
  }
  var offset = getMapStackOffsetCurLevel();
  offset.x += extraAnimatedOffset.x * scrollMultiplier;
  offset.y += extraAnimatedOffset.y * scrollMultiplier;
  renderCells(tempCells, offset);
}
function renderMapObjects(offset) {
  var i, i2;
  for (i = 0; i < map.objects.length; i++) {
    var object = map.objects[i];
    switch(object.type) {
      case 0:
        var numCircles = 6;
        var framesPerSubAnimationLoop = 10;
        var loopPart = Math.floor(object.frame / framesPerSubAnimationLoop) % 2;
        ctx.beginPath();
        ctx.arc((cameraX - (object.x + offset.x)) * zoom, (cameraY - (object.y + offset.y)) * zoom, object.data.radius * zoom, 0, 2 * Math.PI, false);
        if (numCircles % 2 === loopPart) {
          ctx.fillStyle = colourScheme.circularBooster.one;
        } else {
          ctx.fillStyle = colourScheme.circularBooster.two;
        }
        ctx.fill();
        for (i2 = numCircles - 1; i2 > -1; i2--) {
          ctx.beginPath();
          ctx.arc((cameraX - (object.x + offset.x)) * zoom, (cameraY - (object.y + offset.y)) * zoom, object.data.radius * (object.frame % framesPerSubAnimationLoop / framesPerSubAnimationLoop / numCircles + i2 / numCircles) * zoom, 0, 2 * Math.PI, false);
          if (i2 % 2 === loopPart) {
            ctx.fillStyle = colourScheme.circularBooster.one;
          } else {
            ctx.fillStyle = colourScheme.circularBooster.two;
          }
          ctx.fill();
        }
        break;
      case 1:
        ctx.beginPath();
        ctx.moveTo((cameraX - (object.x + offset.x)) * zoom, (cameraY - (object.y + offset.y)) * zoom);
        ctx.lineTo((cameraX - (object.x + offset.x) - Math.sin(object.data.angle) * object.data.length) * zoom, (cameraY - (object.y + offset.y) - Math.cos(object.data.angle) * object.data.length) * zoom);
        ctx.strokeStyle = colourScheme.rotatingArm;
        ctx.lineWidth = object.data.width * zoom;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc((cameraX - (object.x + offset.x)) * zoom, (cameraY - (object.y + offset.y)) * zoom, object.data.width / 2 * zoom, 0, 2 * Math.PI, false);
        ctx.fillStyle = colourScheme.rotatingArm;
        ctx.fill();
        break;
      default:
        console.error("object type not known: " + object.type + " obj: " + object + " i: " + i);
    }
  }
}
function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = {tl:radius, tr:radius, br:radius, bl:radius};
  } else {
    var defaultRadius = {tl:0, tr:0, br:0, bl:0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
function getHSLAComponentsFromStr(hslaStr) {
  var hslaParseTemp = hslaStr.substring(4);
  hslaParseTemp = hslaParseTemp.substring(0, hslaParseTemp.length - 1);
  var hslaParseTempComponentsAsArr = hslaParseTemp.split(",");
  return {h:hslaParseTempComponentsAsArr[0].trim().substring(1), s:hslaParseTempComponentsAsArr[1].trim().slice(0, -1), l:hslaParseTempComponentsAsArr[2].trim().slice(0, -1), a:hslaParseTempComponentsAsArr[3].trim()};
}
function renderGameFailedBox() {
  var i;
  ui.levelFailedData.animation.frame += 1;
  ctx.lineWidth = 3 * zoom;
  ctx.fillStyle = "#ebebeb";
  ctx.strokeStyle = "#808080";
  var maxFractionOfWidth = 0.7;
  var maxFractionOfHeight = 0.7;
  var boxSizeForCamera;
  var maxArea = 0.7;
  var minDimension = Math.min(maxFractionOfWidth * canvas.width, maxFractionOfHeight * canvas.height);
  var areaTakenAsFractionDivMaxArea = Math.pow(minDimension, 2) / (maxFractionOfWidth * canvas.width * maxFractionOfHeight * canvas.height) / maxArea;
  if (areaTakenAsFractionDivMaxArea > 1) {
    boxSizeForCamera = {x:minDimension / ui.levelFailedData.startZoomLevel / areaTakenAsFractionDivMaxArea, y:minDimension / ui.levelFailedData.startZoomLevel / areaTakenAsFractionDivMaxArea};
  } else {
    boxSizeForCamera = {x:minDimension / ui.levelFailedData.startZoomLevel, y:minDimension / ui.levelFailedData.startZoomLevel};
  }
  if (ui.levelFailedData.animation.curDisplayedScore !== ui.levelFailedData.score) {
    if (ui.levelFailedData.animation.frame > 20) {
      ui.levelFailedData.animation.curDisplayedScore = ui.levelFailedData.score;
    } else {
      ui.levelFailedData.animation.curDisplayedScore = ui.levelFailedData.score / 20 * ui.levelFailedData.animation.frame;
    }
  }
  if (!ui.levelFailedData.animation.explodedMapObjs) {
    if (ui.levelFailedData.animation.frame > 60) {
      explodeAllMapObjects();
      ui.levelFailedData.animation.explodedMapObjs = true;
    }
  }
  if (!ui.levelFailedData.animation.explodedCells) {
    if (ui.levelFailedData.animation.frame > 100) {
      explodeAllCells();
      ui.levelFailedData.animation.explodedCells = true;
    }
  }
  var particle;
  var renderText = true;
  var updatedParticleOffset;
  if (ui.scrollingToNextLevel.animation.curScrolling) {
    ui.scrollingToNextLevel.animation.frame += 1;
    if (ui.scrollingToNextLevel.animation.frame >= ui.scrollingToNextLevel.animation.frameDuration) {
      renderText = false;
      if (ui.scrollingToNextLevel.animation.frame === ui.scrollingToNextLevel.animation.frameDuration) {
        cameraOffsetX = ui.scrollingToNextLevel.animation.endCameraOffset.x;
        cameraOffsetY = ui.scrollingToNextLevel.animation.endCameraOffset.y;
        pastLevelsStackHeight = ui.scrollingToNextLevel.animation.orignalPastLevelsStackHeight + ui.scrollingToNextLevel.animation.pastLevelsStackHeightShifting;
        addMapToStoredOldMaps();
        var extremeYValues = getMaxAndMinYValuesForTempMap(map);
        for (i = 0; i < particles.length; i++) {
          particle = particles[i];
          particle.color = particle.hslaHwithPunctuation + "0" + particle.hslaLAwithPunctuation;
          particle.mapBoundaryStoppingMode = 0;
          particlesCreatedPreviousLevelRuns.push(particle);
        }
        particles = [];
        setMap(currentLevel.id);
        pastLevelsStackHeight = getBottomRenderYPosOfCurMapInPlayFromHeightOfOldMapsStackForLevelID(currentLevel.id) - getMaxAndMinYValuesForTempMap(map).minY;
        ui.scene = 0;
      }
    } else {
      var frameCompletionFraction = ui.scrollingToNextLevel.animation.frame / ui.scrollingToNextLevel.animation.frameDuration;
      var scrollMultiplier = 6.73 * (Math.pow(frameCompletionFraction * 2 / 3, 2) - Math.pow(frameCompletionFraction * 2 / 3, 3));
      pastLevelsStackHeight = ui.scrollingToNextLevel.animation.orignalPastLevelsStackHeight + ui.scrollingToNextLevel.animation.pastLevelsStackHeightShifting * scrollMultiplier;
      for (i = 0; i < particles.length; i++) {
        particle = particles[i];
        particle.color = particle.hslaHwithPunctuation + Math.floor((1 - scrollMultiplier) * particle.hslaSOriginalValue) + particle.hslaLAwithPunctuation;
        updatedParticleOffset = {x:0, y:pastLevelsStackHeight};
        particle.offsetShiftLastFrame.x = particle.offset.x - updatedParticleOffset.x;
        particle.offsetShiftLastFrame.y = particle.offset.y - updatedParticleOffset.y;
        particle.offsetShiftLastFrame.lastRenderFrameUpdated = frame;
        particle.offset = updatedParticleOffset;
      }
      cameraOffsetX = ui.scrollingToNextLevel.animation.startCameraOffset.x + (ui.scrollingToNextLevel.animation.endCameraOffset.x - ui.scrollingToNextLevel.animation.startCameraOffset.x) * scrollMultiplier;
      cameraOffsetY = ui.scrollingToNextLevel.animation.startCameraOffset.y + (ui.scrollingToNextLevel.animation.endCameraOffset.y - ui.scrollingToNextLevel.animation.startCameraOffset.y) * scrollMultiplier;
      ctx.fillStyle = "hsla(0, 100%, 100%," + (1 - scrollMultiplier) + ")";
    }
  } else {
    ctx.fillStyle = "white";
    if (mousePosHistory[0].mouseState === 1 && mousePosHistory[1].mouseState === 0) {
      if (options.renderOldMaps) {
        ui.scrollingToNextLevel.animation.addedMapToOldMaps = false;
        var extremeYValues = getMaxAndMinYValuesForTempMap(map);
        ui.scrollingToNextLevel.animation.frame = 0;
        ui.scrollingToNextLevel.animation.curScrolling = true;
        ui.scrollingToNextLevel.animation.frameDuration = 30;
        if (pastLevelsStackHeight > 0) {
          ui.scrollingToNextLevel.animation.pastLevelsStackHeightShifting = currentLevel.originalExtremeYValues.minY - extremeYValues.minY;
          ui.scrollingToNextLevel.animation.orignalPastLevelsStackHeight = pastLevelsStackHeight;
        } else {
          ui.scrollingToNextLevel.animation.pastLevelsStackHeightShifting = 0;
          ui.scrollingToNextLevel.animation.orignalPastLevelsStackHeight = pastLevelsStackHeight;
        }
        ui.scrollingToNextLevel.animation.endCameraOffset.x = cameraOffsetX;
        ui.scrollingToNextLevel.animation.endCameraOffset.y = cameraOffsetY - currentLevel.originalExtremeYValues.minY + extremeYValues.maxY + options.oldMapsMargin + ui.scrollingToNextLevel.animation.pastLevelsStackHeightShifting;
        ui.scrollingToNextLevel.animation.startCameraOffset.x = cameraOffsetX;
        ui.scrollingToNextLevel.animation.startCameraOffset.y = cameraOffsetY;
        ui.scrollingToNextLevel.animation.renderOldMapsForCurLevelOffset = 0;
        if (!ui.levelFailedData.animation.explodedMapObjs) {
          explodeAllMapObjects();
          ui.levelFailedData.animation.explodedMapObjs = true;
        }
        if (!ui.levelFailedData.animation.explodedCells) {
          explodeAllCells();
          ui.levelFailedData.animation.explodedCells = true;
        }
        for (i = 0; i < particles.length; i++) {
          particle = particles[i];
          var hslaComponents = getHSLAComponentsFromStr(particle.color);
          particle.hslaHwithPunctuation = "hsla(" + hslaComponents.h + ",";
          particle.hslaLAwithPunctuation = "%," + hslaComponents.l + "%," + hslaComponents.a + ")";
          particle.hslaSOriginalValue = hslaComponents.s;
          particle.orgColorTempDEVuse = particle.color;
          updatedParticleOffset = {x:0, y:pastLevelsStackHeight};
          particle.offsetShiftLastFrame.x = particle.offset.x - updatedParticleOffset.x;
          particle.offsetShiftLastFrame.y = particle.offset.y - updatedParticleOffset.y;
          particle.offsetShiftLastFrame.lastRenderFrameUpdated = frame;
          particle.offset = updatedParticleOffset;
        }
      }
    }
  }
  if (renderText) {
    var startYPos = ui.levelFailedData.startWorldPos.y + boxSizeForCamera.y / 3;
    var fontSize = Math.floor(50 * zoom / ui.levelFailedData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    var textToRender = "Fail!";
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelFailedData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(20 * zoom / ui.levelFailedData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = "Failed level " + ui.levelFailedData.levelDisplayName;
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelFailedData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(50 * zoom / ui.levelFailedData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = Math.ceil(ui.levelFailedData.areaFractionLeft * 100) + "%";
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelFailedData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(20 * zoom / ui.levelFailedData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = "Score: " + Math.floor(ui.levelFailedData.animation.curDisplayedScore) + "      Cells killed: " + ui.levelFailedData.cellDeaths;
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelFailedData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
  }
}
function renderGameSuccessBox() {
  ui.levelSuccessData.animation.frame += 1;
  ctx.lineWidth = 3 * zoom;
  ctx.fillStyle = "#ebebeb";
  ctx.strokeStyle = "#808080";
  var maxFractionOfWidth = 0.7;
  var maxFractionOfHeight = 0.7;
  var boxSizeForCamera;
  var maxArea = 0.7;
  var minDimension = Math.min(maxFractionOfWidth * canvas.width, maxFractionOfHeight * canvas.height);
  var areaTakenAsFractionDivMaxArea = Math.pow(minDimension, 2) / (maxFractionOfWidth * canvas.width * maxFractionOfHeight * canvas.height) / maxArea;
  if (areaTakenAsFractionDivMaxArea > 1) {
    boxSizeForCamera = {x:minDimension / ui.levelSuccessData.startZoomLevel / areaTakenAsFractionDivMaxArea, y:minDimension / ui.levelSuccessData.startZoomLevel / areaTakenAsFractionDivMaxArea};
  } else {
    boxSizeForCamera = {x:minDimension / ui.levelSuccessData.startZoomLevel, y:minDimension / ui.levelSuccessData.startZoomLevel};
  }
  if (ui.levelSuccessData.animation.curDisplayedScore !== ui.levelSuccessData.score) {
    if (ui.levelSuccessData.animation.frame > 20) {
      ui.levelSuccessData.animation.curDisplayedScore = ui.levelSuccessData.score;
    } else {
      ui.levelSuccessData.animation.curDisplayedScore = ui.levelSuccessData.score / 20 * ui.levelSuccessData.animation.frame;
    }
  }
  var i;
  var particle;
  var renderText = true;
  var updatedParticleOffset;
  var extremeYValues;
  if (ui.scrollingToNextDifferentLevel.animation.curScrolling) {
    ui.scrollingToNextDifferentLevel.animation.frame += 1;
    if (ui.scrollingToNextDifferentLevel.animation.frame >= ui.scrollingToNextDifferentLevel.animation.frameDuration) {
      renderText = false;
      if (ui.scrollingToNextDifferentLevel.animation.frame === ui.scrollingToNextDifferentLevel.animation.frameDuration) {
        cameraOffsetX = ui.scrollingToNextDifferentLevel.animation.endCameraOffset.x;
        cameraOffsetY = ui.scrollingToNextDifferentLevel.animation.endCameraOffset.y;
        pastLevelsStackHeight = ui.scrollingToNextDifferentLevel.animation.orignalPastLevelsStackHeight + ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting + ui.scrollingToNextDifferentLevel.animation.extremeYValuesForSpacer.maxY - ui.scrollingToNextDifferentLevel.animation.extremeYValuesForNextLevel.minY;
        addMapToStoredOldMaps();
        extremeYValues = getMaxAndMinYValuesForTempMap(map);
        for (i = 0; i < particles.length; i++) {
          particle = particles[i];
          particle.color = particle.hslaHwithPunctuation + "0" + particle.hslaLAwithPunctuation;
          particle.mapBoundaryStoppingMode = 0;
          particlesCreatedPreviousLevelRuns.push(particle);
        }
        particles = [];
        setMap(ui.scrollingToNextDifferentLevel.nextLevelData.levelData.id);
        ui.scene = 0;
      }
    } else {
      var frameCompletionFraction = ui.scrollingToNextDifferentLevel.animation.frame / ui.scrollingToNextDifferentLevel.animation.frameDuration;
      var scrollMultiplier = 6.73 * (Math.pow(frameCompletionFraction * 2 / 3, 2) - Math.pow(frameCompletionFraction * 2 / 3, 3));
      pastLevelsStackHeight = ui.scrollingToNextDifferentLevel.animation.orignalPastLevelsStackHeight + ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting * scrollMultiplier;
      for (i = 0; i < particles.length; i++) {
        particle = particles[i];
        particle.color = particle.hslaHwithPunctuation + Math.floor((1 - scrollMultiplier) * particle.hslaSOriginalValue) + particle.hslaLAwithPunctuation;
        updatedParticleOffset = {x:0, y:pastLevelsStackHeight};
        particle.offsetShiftLastFrame.x = particle.offset.x - updatedParticleOffset.x;
        particle.offsetShiftLastFrame.y = particle.offset.y - updatedParticleOffset.y;
        particle.offsetShiftLastFrame.lastRenderFrameUpdated = frame;
        particle.offset = updatedParticleOffset;
      }
      cameraOffsetX = ui.scrollingToNextDifferentLevel.animation.startCameraOffset.x + (ui.scrollingToNextDifferentLevel.animation.endCameraOffset.x - ui.scrollingToNextDifferentLevel.animation.startCameraOffset.x) * scrollMultiplier;
      cameraOffsetY = ui.scrollingToNextDifferentLevel.animation.startCameraOffset.y + (ui.scrollingToNextDifferentLevel.animation.endCameraOffset.y - ui.scrollingToNextDifferentLevel.animation.startCameraOffset.y) * scrollMultiplier;
      renderAnimationForMorphingMapsFromAnimationDataObj(ui.scrollingToNextDifferentLevel.animation.morphMapData.animationData, frameCompletionFraction, ui.scrollingToNextDifferentLevel.animation.morphMapData.extraAnimatedOffset);
      renderAnimationForMorphingCellsFromAnimationDataObj(ui.scrollingToNextDifferentLevel.animation.morphCellsData.animationData, frameCompletionFraction, ui.scrollingToNextDifferentLevel.animation.morphCellsData.extraAnimatedOffset);
      renderParticles(particles);
      ctx.fillStyle = "hsla(0, 100%, 100%," + (1 - scrollMultiplier) + ")";
    }
  } else {
    ctx.fillStyle = "white";
    if (mousePosHistory[0].mouseState === 1 && mousePosHistory[1].mouseState === 0) {
      if (options.renderOldMaps) {
        ui.scrollingToNextDifferentLevel.animation.frameDuration = options.levelPassesMapMorphDuration;
        ui.scrollingToNextDifferentLevel.nextLevelData = getNextLevelDataFromCurLevelID(currentLevel.id);
        if (!ui.scrollingToNextDifferentLevel.nextLevelData.exists) {
          console.error("ERROR: NO NEXT LEVEL FOUND/SET");
        }
        ui.scrollingToNextDifferentLevel.animation.addedMapToOldMaps = false;
        ui.scrollingToNextDifferentLevel.animation.morphMapData.animationData = generateAnimationDataObjForMorphingMaps(map, ui.scrollingToNextDifferentLevel.nextLevelData.levelData.data.map);
        ui.scrollingToNextDifferentLevel.animation.morphCellsData.animationData = generateAnimationDataObjForMorphingCells(cells, ui.scrollingToNextDifferentLevel.nextLevelData.levelData.data.map.initialCellPositions);
        explodeAllMapObjects();
        cells = [];
        map.data.render.spacer.type = 0;
        map.data.render.spacer.isSpacer = true;
        map.data.render.spacer.marginTop = options.levelSuccessSpacer.marginTopAndBottom;
        map.data.render.spacer.marginBottom = -options.levelSuccessSpacer.marginTopAndBottom;
        map.data.render.spacer.frame = 0;
        map.data.render.spacer.fadeInDuration = ui.scrollingToNextDifferentLevel.animation.frameDuration;
        map.data.render.spacer.levelName = ui.levelSuccessData.levelDisplayName;
        map.data.render.spacer.areaAsPercent = Math.ceil(ui.levelSuccessData.areaFractionLeft * 100);
        map.data.render.spacer.score = Math.floor(ui.levelSuccessData.score);
        var extremeYValuesForSpacer = getMaxAndMinYValuesForTempMap(map);
        var extremeYValuesForNextLevel = getMaxAndMinYValuesForTempMap(ui.scrollingToNextDifferentLevel.nextLevelData.levelData.data.map);
        ui.scrollingToNextDifferentLevel.animation.extremeYValuesForSpacer = extremeYValuesForSpacer;
        ui.scrollingToNextDifferentLevel.animation.extremeYValuesForNextLevel = extremeYValuesForNextLevel;
        ui.scrollingToNextDifferentLevel.animation.morphMapData.extraAnimatedOffset.x = 0;
        ui.scrollingToNextDifferentLevel.animation.morphMapData.extraAnimatedOffset.y = extremeYValuesForSpacer.maxY - extremeYValuesForNextLevel.minY;
        ui.scrollingToNextDifferentLevel.animation.morphCellsData.extraAnimatedOffset.x = ui.scrollingToNextDifferentLevel.animation.morphMapData.extraAnimatedOffset.x;
        ui.scrollingToNextDifferentLevel.animation.morphCellsData.extraAnimatedOffset.y = ui.scrollingToNextDifferentLevel.animation.morphMapData.extraAnimatedOffset.y;
        extremeYValues = {minY:extremeYValuesForSpacer.minY - extremeYValuesForSpacer.maxY + extremeYValuesForNextLevel.minY, maxY:extremeYValuesForNextLevel.maxY};
        ui.scrollingToNextDifferentLevel.animation.frame = 0;
        ui.scrollingToNextDifferentLevel.animation.curScrolling = true;
        if (pastLevelsStackHeight > 0) {
          ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting = currentLevel.originalExtremeYValues.minY - extremeYValuesForSpacer.minY;
          ui.scrollingToNextDifferentLevel.animation.orignalPastLevelsStackHeight = pastLevelsStackHeight;
        } else {
          ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting = 0;
          ui.scrollingToNextDifferentLevel.animation.orignalPastLevelsStackHeight = pastLevelsStackHeight;
          ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting = 0;
          ui.scrollingToNextDifferentLevel.animation.orignalPastLevelsStackHeight = pastLevelsStackHeight;
        }
        ui.scrollingToNextDifferentLevel.nextLevelData.levelData.data.unlocked = true;
        ui.scrollingToNextDifferentLevel.animation.endCameraOffset.x = cameraOffsetX;
        ui.scrollingToNextDifferentLevel.animation.endCameraOffset.y = cameraOffsetY - currentLevel.originalExtremeYValues.minY + options.oldMapsMargin + ui.scrollingToNextDifferentLevel.animation.pastLevelsStackHeightShifting + extremeYValuesForSpacer.maxY;
        ui.scrollingToNextDifferentLevel.animation.startCameraOffset.x = cameraOffsetX;
        ui.scrollingToNextDifferentLevel.animation.startCameraOffset.y = cameraOffsetY;
        ui.scrollingToNextDifferentLevel.animation.renderOldMapsForCurLevelOffset = 0;
        for (i = 0; i < particles.length; i++) {
          particle = particles[i];
          var hslaComponents = getHSLAComponentsFromStr(particle.color);
          particle.hslaHwithPunctuation = "hsla(" + hslaComponents.h + ",";
          particle.hslaLAwithPunctuation = "%," + hslaComponents.l + "%," + hslaComponents.a + ")";
          particle.hslaSOriginalValue = hslaComponents.s;
          particle.orgColorTempDEVuse = particle.color;
          updatedParticleOffset = {x:0, y:pastLevelsStackHeight};
          particle.offsetShiftLastFrame.x = particle.offset.x - updatedParticleOffset.x;
          particle.offsetShiftLastFrame.y = particle.offset.y - updatedParticleOffset.y;
          particle.offsetShiftLastFrame.lastRenderFrameUpdated = frame;
          particle.offset = updatedParticleOffset;
        }
      }
    }
  }
  if (renderText) {
    var startYPos = ui.levelSuccessData.startWorldPos.y + boxSizeForCamera.y / 3;
    var fontSize = Math.floor(50 * zoom / ui.levelSuccessData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    var textToRender = "Success!";
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelSuccessData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(20 * zoom / ui.levelSuccessData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = "Completed level " + ui.levelSuccessData.levelDisplayName;
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelSuccessData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(50 * zoom / ui.levelSuccessData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = Math.floor(ui.levelSuccessData.animation.curDisplayedScore);
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelSuccessData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
    startYPos -= fontSize / 50 * 45 / zoom;
    fontSize = Math.floor(20 * zoom / ui.levelSuccessData.startZoomLevel);
    ctx.font = fontSize + "px Arial";
    startYPos -= fontSize / 50 * 45 / zoom;
    textToRender = "Area: " + Math.ceil(ui.levelSuccessData.areaFractionLeft * 100) + "%";
    ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + (cameraX - ui.levelSuccessData.startWorldPos.x) * zoom, (cameraY - startYPos) * zoom);
  }
}
function getNextLevelDataFromCurLevelID(levelID) {
  var i;
  for (i = 0; i < levelIDsInPlayingOrder.length; i++) {
    if (levelIDsInPlayingOrder[i].id === levelID) {
      if (i + 1 < levelIDsInPlayingOrder.length) {
        return {exists:true, levelData:levelIDsInPlayingOrder[i + 1]};
      } else {
        return {exists:false};
      }
    }
  }
  console.error("level id not found:" + levelID);
}
function getMapStackOffsetCurLevel() {
  return {x:0, y:pastLevelsStackHeight};
}
function renderCells(tempCells, offset) {
  var i;
  for (i = 0; i < tempCells.length; i++) {
    var cell = tempCells[i];
    ctx.beginPath();
    ctx.arc((cameraX - (cell.x + offset.x)) * zoom, (cameraY - (cell.y + offset.y)) * zoom, cell.size * zoom / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = cell.color;
    ctx.strokeStyle = "hsla(" + cell.huePartOfHSLColour + ", 100%, 33%,1)";
    ctx.fill();
    ctx.lineWidth = cell.size / 10 * zoom;
    ctx.stroke();
  }
}
function render(dontFillBackground) {
  var i;
  if (!dontFillBackground) {
    ctx.fillStyle = colourScheme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (dev.on && dev.renderYZeroLine) {
    ctx.beginPath();
    ctx.moveTo((cameraX - 100) * zoom, (cameraY - 0) * zoom);
    ctx.lineTo((cameraX - -100) * zoom, (cameraY - 0) * zoom);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3 * zoom;
    ctx.stroke();
  }
  if (dev.on && dev.renderCurMapOutline) {
    var tempMap = {points:[{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}]};
    ctx.beginPath();
    ctx.moveTo((cameraX - tempMap.points[0].x) * zoom, (cameraY - (tempMap.points[0].y + pastLevelsStackHeight)) * zoom);
    for (i = 1; i < tempMap.points.length; i++) {
      ctx.lineTo((cameraX - tempMap.points[i].x) * zoom, (cameraY - (tempMap.points[i].y + pastLevelsStackHeight)) * zoom);
    }
    ctx.lineTo((cameraX - tempMap.points[0].x) * zoom, (cameraY - (tempMap.points[0].y + pastLevelsStackHeight)) * zoom);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3 * zoom;
    ctx.stroke();
  }
  if (ui.scene === 0 || (ui.scene === 1 || ui.scene === 2)) {
    var offset = getMapStackOffsetCurLevel();
    if (options.renderOldMaps) {
      renderOldMaps();
    }
    renderParticles(particlesCreatedPreviousLevelRuns);
    renderMap(map, offset);
    renderMapObjects(offset);
    renderParticles(particles);
    renderParticles(textParticles);
    renderCells(cells, offset);
    if (ui.scene === 0) {
      renderAndParseMouseSlices(offset);
      var fontSize = canvas.height / 35;
      ctx.font = Math.floor(fontSize) + "px Arial";
      ctx.fillStyle = "white";
      var textToRender = Math.ceil(getAreaOfMap() / currentLevel.originalArea * 100) + "%";
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, 10 + fontSize / 30 * 40);
      textToRender = Math.floor(getCurScore());
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, 10 + fontSize / 30 * 40 * 2);
      if (currentLevel.descTexts.length > 0) {
        var startYPos = 10 + fontSize / 30 * 40 * 3;
        fontSize = 20;
        ctx.font = Math.floor(fontSize) + "px Arial";
        var maxTextWidth = 0;
        var textWidthTemp;
        for (i = 0; i < currentLevel.descTexts.length; i++) {
          textWidthTemp = ctx.measureText(currentLevel.descTexts[i]).width;
          if (textWidthTemp > maxTextWidth) {
            maxTextWidth = textWidthTemp;
          }
        }
        if (maxTextWidth > canvas.width * 0.8) {
          fontSize *= canvas.width * 0.8 / maxTextWidth;
          ctx.font = Math.floor(fontSize) + "px Arial";
        }
        for (i = 0; i < currentLevel.descTexts.length; i++) {
          textToRender = currentLevel.descTexts[i];
          ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, startYPos + i * fontSize / 30 * 40);
        }
      }
    }
    if (ui.scene === 1) {
      renderGameFailedBox();
    }
    if (ui.scene === 2) {
      renderGameSuccessBox();
    }
  }
}
function getCurScore() {
  return (currentLevel.originalArea / (getAreaOfMap() + currentLevel.originalArea * 0.02) - 1 / (1 + 1 * 0.02)) * currentLevel.originalNumCells * 100 * (1 + 180 / currentLevel.frame);
}
function updateMouseHistory(offset) {
  var unProjectedMousePos = {x:cameraX - mouseposx / zoom - offset.x, y:cameraY - mouseposy / zoom - offset.y};
  var mouseInsideMap = checkIfUnprojectedPointIsInsideMap(unProjectedMousePos);
  if (mousePosHistory.length < 3) {
    mousePosHistory.unshift({x:unProjectedMousePos.x, y:unProjectedMousePos.y, velSquared:0, insideMap:mouseInsideMap, mouseState:mouseState});
  } else {
    mousePosHistory.unshift({x:unProjectedMousePos.x, y:unProjectedMousePos.y, velSquared:Math.pow((unProjectedMousePos.x - mousePosHistory[2].x) / canvas.width, 2) + Math.pow((unProjectedMousePos.y - mousePosHistory[2].y) / canvas.width, 2), insideMap:mouseInsideMap, mouseState:mouseState});
  }
  if (mousePosHistory.length > options.maxMousePosHistoryLength) {
    mousePosHistory.splice(options.maxMousePosHistoryLength, mousePosHistory.length - options.maxMousePosHistoryLength);
  }
}
function getLengthOfMouseVelAboveMinSliceVelRun() {
  var i;
  for (i = 0; i < mousePosHistory.length; i++) {
    if (mousePosHistory[i].velSquared < options.sliceMinMouseVelocitySquared || inputType === 1 && mousePosHistory[i].mouseState !== 1) {
      break;
    }
  }
  return i;
}
function renderAndParseMouseSlices(offset) {
  var runLength = getLengthOfMouseVelAboveMinSliceVelRun();
  var i;
  ctx.strokeStyle = "white";
  var maxDrawnRunLength = 14;
  if (runLength > 2) {
    ctx.beginPath();
    ctx.moveTo((cameraX - (mousePosHistory[0].x + offset.x)) * zoom, (cameraY - (mousePosHistory[0].y + offset.y)) * zoom);
    for (i = 1; i < runLength - 2 && i < maxDrawnRunLength - 2; i++) {
      var xc = (cameraX - ((mousePosHistory[i].x + mousePosHistory[i + 1].x) / 2 + offset.x)) * zoom;
      var yc = (cameraY - ((mousePosHistory[i].y + mousePosHistory[i + 1].y) / 2 + offset.y)) * zoom;
      ctx.quadraticCurveTo((cameraX - (mousePosHistory[i].x + offset.x)) * zoom, (cameraY - (mousePosHistory[i].y + offset.y)) * zoom, xc, yc);
      ctx.lineWidth = 2 * zoom * (maxDrawnRunLength - i) / maxDrawnRunLength;
      ctx.stroke();
    }
    ctx.quadraticCurveTo((cameraX - (mousePosHistory[i].x + offset.x)) * zoom, (cameraY - (mousePosHistory[i].y + offset.y)) * zoom, (cameraX - (mousePosHistory[i + 1].x + offset.x)) * zoom, (cameraY - (mousePosHistory[i + 1].y + offset.y)) * zoom);
    ctx.stroke();
  }
  if (mousePosHistory.length > 1) {
    if (!mousePosHistory[0].insideMap && mousePosHistory[1].insideMap) {
      var lastFrameMouseOutsideMap = -1;
      for (i = 1; i < runLength; i++) {
        if (!mousePosHistory[i].insideMap) {
          lastFrameMouseOutsideMap = i;
          break;
        }
      }
      if (lastFrameMouseOutsideMap !== -1) {
        var anyPointTooFarFromLine;
        if (lastFrameMouseOutsideMap > 2) {
          var sumOfDistsSquared = 0;
          var totalDistSquared = getSquareOfDistance(mousePosHistory[0].x - mousePosHistory[lastFrameMouseOutsideMap].x, mousePosHistory[0].y - mousePosHistory[lastFrameMouseOutsideMap].y);
          for (i = 1; i < lastFrameMouseOutsideMap - 1; i++) {
            sumOfDistsSquared += getSquareOfDistance(mousePosHistory[i].x - mousePosHistory[lastFrameMouseOutsideMap].x, mousePosHistory[i].y - mousePosHistory[lastFrameMouseOutsideMap].y);
          }
          if (sumOfDistsSquared / totalDistSquared > options.requiredCutStraightFactor) {
            anyPointTooFarFromLine = true;
          }
        }
        if (anyPointTooFarFromLine) {
        } else {
          var entryLineData = getClosestLineOfMapToPoint({x:mousePosHistory[lastFrameMouseOutsideMap].x, y:mousePosHistory[lastFrameMouseOutsideMap].y});
          var exitLineData = getClosestLineOfMapToPoint({x:mousePosHistory[0].x, y:mousePosHistory[0].y});
          if (Math.min(Math.abs(entryLineData.segmentEndPoints[0].index - exitLineData.segmentEndPoints[0].index), map.points.length - Math.abs(entryLineData.segmentEndPoints[0].index - exitLineData.segmentEndPoints[0].index)) < 1) {
          } else {
            var firstIndexCrossPoint;
            var lastIndexCrossPoint;
            if (entryLineData.segmentEndPoints[0].index < exitLineData.segmentEndPoints[0].index) {
              firstIndexCrossPoint = entryLineData;
              lastIndexCrossPoint = exitLineData;
            } else {
              firstIndexCrossPoint = exitLineData;
              lastIndexCrossPoint = entryLineData;
            }
            var tempMap1 = createNewMap(null, map.objects);
            var alreadyAddedNewPoints = false;
            for (i = 0; i < map.points.length; i++) {
              if (i < firstIndexCrossPoint.segmentEndPoints[1].index) {
                tempMap1.points.push(map.points[i]);
              } else {
                if (i > lastIndexCrossPoint.segmentEndPoints[0].index) {
                  tempMap1.points.push(map.points[i]);
                } else {
                  if (!alreadyAddedNewPoints) {
                    tempMap1.points.push(firstIndexCrossPoint.point);
                    tempMap1.points.push(lastIndexCrossPoint.point);
                    alreadyAddedNewPoints = true;
                  }
                }
              }
            }
            var tempMap2 = createNewMap(null, map.objects);
            alreadyAddedNewPoints = false;
            for (i = 0; i < map.points.length; i++) {
              if ((i < lastIndexCrossPoint.segmentEndPoints[1].index || lastIndexCrossPoint.segmentEndPoints[1].index === 0) && i > firstIndexCrossPoint.segmentEndPoints[0].index) {
                tempMap2.points.push(map.points[i]);
              } else {
                if (!alreadyAddedNewPoints) {
                  tempMap2.points.push(lastIndexCrossPoint.point);
                  tempMap2.points.push(firstIndexCrossPoint.point);
                  alreadyAddedNewPoints = true;
                }
              }
            }
            for (i = tempMap2.points.length - 1; i > 0; i--) {
              if (tempMap2.points[i].x === tempMap2.points[i - 1].x && tempMap2.points[i].y === tempMap2.points[i - 1].y) {
                tempMap2.points.splice(i, 1);
              }
            }
            var cellCount = [getCountOfCellsInsideTempMap(tempMap1), getCountOfCellsInsideTempMap(tempMap2)];
            if (cellCount[0] === 0 && cellCount[1] === 0) {
              console.error("both cellcounts 0");
            }
            var bestTempMap;
            var discardedMapCellCount;
            if (cellCount[0] < cellCount[1]) {
              bestTempMap = tempMap2;
              discardedMapCellCount = cellCount[0];
            } else {
              bestTempMap = tempMap1;
              discardedMapCellCount = cellCount[1];
            }
            if (discardedMapCellCount !== 0) {
              console.log("player failed");
              levelFailed(bestTempMap);
            } else {
              map = bestTempMap;
              if (Math.ceil(getAreaOfMap() / currentLevel.originalArea * 100) / 100 < 0.1) {
                levelSuccess();
              }
            }
            moveCellsInsideMapForCellsOnCutLine();
          }
        }
      }
    }
  }
}
function moveCellsInsideMapForCellsOnCutLine() {
  var i, cell;
  for (i = 0; i < cells.length; i++) {
    if (!checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMap(cells[i], map, options.cellSize / 2)) {
      cell = cells[i];
      var closestLineDataForCellPoint = getClosestLineOfTempMapToPoint(cell, map);
      var outsideMapWallToCellDir = getDirection(closestLineDataForCellPoint.point.x - cell.x, closestLineDataForCellPoint.point.y - cell.y);
      var distToMoveCell = options.cellSize / 2;
      cell.x -= Math.sin(outsideMapWallToCellDir) * distToMoveCell;
      cell.y -= Math.cos(outsideMapWallToCellDir) * distToMoveCell;
    }
  }
}
function explodeCell(cell, particleType) {
  var i2;
  var randomDir;
  var randomSpeed;
  for (i2 = 0; i2 < 200; i2++) {
    randomDir = Math.PI * 2 * Math.random();
    randomSpeed = Math.random() * 0.4;
    createNewParticle(cell.x, cell.y, Math.random() * options.particleSizeMultiplier, cell.xv + Math.sin(randomDir) * randomSpeed, cell.yv + Math.cos(randomDir) * randomSpeed, 0.97, 0.95, cell.color, particleType);
  }
}
function levelFailed(bestTempMap) {
  var i;
  ui.scene = 1, ui.levelFailedData.areaFractionLeft = getAreaOfMap() / currentLevel.originalArea;
  ui.levelFailedData.startZoomLevel = zoom;
  ui.levelFailedData.startWorldPos = unprojectPoint({x:canvas.width / 2, y:canvas.height / 2});
  ui.levelFailedData.levelID = currentLevel.id;
  ui.levelFailedData.levelDisplayName = currentLevel.levelDisplayName;
  ui.levelFailedData.score = getCurScore();
  ui.levelFailedData.animation.curDisplayedScore = 0;
  ui.levelFailedData.totalFrames = currentLevel.frame;
  ui.levelFailedData.animation.frame = 0;
  ui.levelFailedData.animation.explodedMapObjs = false;
  ui.levelFailedData.animation.explodedCells = false;
  ui.scrollingToNextLevel.animation.curScrolling = false;
  ui.scrollingToNextLevel.animation.frame = -1;
  if (options.renderOldMaps) {
    ui.levelFailedData.splitFailCutMap = JSON.parse(JSON.stringify(map));
  }
  map = bestTempMap;
  for (i = cells.length - 1; i > -1; i--) {
    if (!checkIfUnprojectedPointIsInsideMap(cells[i])) {
      explodeCell(cells[i], 1);
      cells.splice(i, 1);
    }
  }
  ui.levelFailedData.cellDeaths = currentLevel.originalNumCells - cells.length;
}
function levelSuccess() {
  ui.scene = 2, ui.levelSuccessData.areaFractionLeft = getAreaOfMap() / currentLevel.originalArea;
  ui.levelSuccessData.startZoomLevel = zoom;
  ui.levelSuccessData.startWorldPos = unprojectPoint({x:canvas.width / 2, y:canvas.height / 2});
  ui.levelSuccessData.levelID = currentLevel.id;
  ui.levelSuccessData.levelDisplayName = currentLevel.levelDisplayName;
  ui.levelSuccessData.score = getCurScore();
  ui.levelSuccessData.animation.curDisplayedScore = 0;
  ui.levelSuccessData.totalFrames = currentLevel.frame;
  ui.levelSuccessData.animation.frame = 0;
  ui.scrollingToNextDifferentLevel.animation.curScrolling = false;
  ui.scrollingToNextDifferentLevel.animation.frame = -1;
}
function explodeAllObjects() {
  explodeAllMapObjects();
  explodeAllCells();
}
function explodeAllCells() {
  var i;
  for (i = cells.length - 1; i > -1; i--) {
    explodeCell(cells[i], 2);
    cells.splice(i, 1);
  }
}
function explodeAllMapObjects() {
  var i;
  for (i = map.objects.length - 1; i > -1; i--) {
    explodeMapObject(map.objects[i]);
    map.objects.splice(i, 1);
  }
}
function getCountOfCellsInsideTempMap(tempMap) {
  var i;
  var count = 0;
  for (i = 0; i < cells.length; i++) {
    count += Number(checkIfUnprojectedPointIsInsideTempMap({x:cells[i].x, y:cells[i].y}, tempMap));
  }
  return count;
}
function getClosestPointToSegment(p, a, b) {
  var atob = {x:b.x - a.x, y:b.y - a.y};
  var atop = {x:p.x - a.x, y:p.y - a.y};
  var len = atob.x * atob.x + atob.y * atob.y;
  var dot = atop.x * atob.x + atop.y * atob.y;
  var t = Math.min(1, Math.max(0, dot / len));
  dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  return {point:{x:a.x + atob.x * t, y:a.y + atob.y * t}, dist:Math.pow(a.x + atob.x * t - p.x, 2) + Math.pow(a.y + atob.y * t - p.y, 2), left:dot < 1, dot:dot, t:t};
}
function unprojectPoint(point) {
  return {x:cameraX - point.x / zoom, y:cameraY - point.y / zoom};
}
function projectPoint(point, camera) {
  return {x:(cameraX - point.x) * zoom, y:(cameraY - point.y) * zoom};
}
function checkIfPointIsInsideMap(point) {
  var i, j = map.points.length - 1;
  var odd = false;
  var projectedMapPoints = [];
  for (i = 0; i < map.points.length; i++) {
    projectedMapPoints.push({x:(cameraX - map.points[i].x) * zoom, y:(cameraY - map.points[i].y) * zoom});
  }
  for (i = 0; i < projectedMapPoints.length; i++) {
    if ((projectedMapPoints[i].y < point.y && projectedMapPoints[j].y >= point.y || projectedMapPoints[j].y < point.y && projectedMapPoints[i].y >= point.y) && (projectedMapPoints[i].x <= point.x || projectedMapPoints[j].x <= point.x)) {
      odd ^= projectedMapPoints[i].x + (point.y - projectedMapPoints[i].y) * (projectedMapPoints[j].x - projectedMapPoints[i].x) / (projectedMapPoints[j].y - projectedMapPoints[i].y) < point.x;
    }
    j = i;
  }
  return Boolean(odd);
}
function checkIfUnprojectedPointIsInsideMap(point) {
  var i, j = map.points.length - 1;
  var odd = false;
  for (i = 0; i < map.points.length; i++) {
    if ((map.points[i].y < point.y && map.points[j].y >= point.y || map.points[j].y < point.y && map.points[i].y >= point.y) && (map.points[i].x <= point.x || map.points[j].x <= point.x)) {
      odd ^= map.points[i].x + (point.y - map.points[i].y) * (map.points[j].x - map.points[i].x) / (map.points[j].y - map.points[i].y) < point.x;
    }
    j = i;
  }
  return Boolean(odd);
}
function checkIfUnprojectedPointIsInsideTempMap(point, tempMap) {
  var i, j = tempMap.points.length - 1;
  var odd = false;
  for (i = 0; i < tempMap.points.length; i++) {
    if ((tempMap.points[i].y < point.y && tempMap.points[j].y >= point.y || tempMap.points[j].y < point.y && tempMap.points[i].y >= point.y) && (tempMap.points[i].x <= point.x || tempMap.points[j].x <= point.x)) {
      odd ^= tempMap.points[i].x + (point.y - tempMap.points[i].y) * (tempMap.points[j].x - tempMap.points[i].x) / (tempMap.points[j].y - tempMap.points[i].y) < point.x;
    }
    j = i;
  }
  return Boolean(odd);
}
function checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMap(point, tempMap, radius) {
  return checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMapAndReturnClosestLineData(point, tempMap, radius).insideMap;
}
function checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMapAndReturnClosestLineData(point, tempMap, radius) {
  var closestLineData = getClosestLineOfTempMapToPoint(point, tempMap);
  var modifiedClosestLineData = {};
  var pointToClosestLineDir = getDirection(-closestLineData.point.x + point.x, -closestLineData.point.y + point.y);
  var shiftToAccountForRadius = {x:Math.sin(pointToClosestLineDir) * radius, y:Math.cos(pointToClosestLineDir) * radius};
  modifiedClosestLineData.point = {x:closestLineData.point.x + shiftToAccountForRadius.x, y:closestLineData.point.y + shiftToAccountForRadius.y};
  modifiedClosestLineData.segmentEndPoints = closestLineData.segmentEndPoints;
  if (checkIfUnprojectedPointIsInsideTempMap(point, tempMap)) {
    if (getSquareOfDistance(point.x - closestLineData.point.x, point.y - closestLineData.point.y) > Math.pow(radius, 2)) {
      return {insideMap:true, closestLineData:modifiedClosestLineData};
    } else {
      return {insideMap:false, closestLineData:modifiedClosestLineData};
    }
  } else {
    return {insideMap:false, closestLineData:modifiedClosestLineData};
  }
}
function getAreaOfMap() {
  var j = 0;
  var i;
  var area = 0;
  for (i = 0; i < map.points.length; i++) {
    j = (i + 1) % map.points.length;
    area += map.points[i].x * map.points[j].y;
    area -= map.points[i].y * map.points[j].x;
  }
  area /= 2;
  return area < 0 ? -area : area;
}
function getClosestLineOfMapToPoint(point) {
  var segmentEndPoints, closestPointInfo;
  var minDist = Infinity;
  var minDistSegmentEndPoints;
  var minDistPoint;
  var i;
  for (i = 0; i < map.points.length; i++) {
    if (i === 0) {
      segmentEndPoints = [{x:map.points[map.points.length - 1].x, y:map.points[map.points.length - 1].y, index:map.points.length - 1}, {x:map.points[0].x, y:map.points[0].y, index:0}];
    } else {
      segmentEndPoints = [{x:map.points[i - 1].x, y:map.points[i - 1].y, index:i - 1}, {x:map.points[i].x, y:map.points[i].y, index:i}];
    }
    closestPointInfo = getClosestPointToSegment({x:point.x, y:point.y}, segmentEndPoints[0], segmentEndPoints[1]);
    if (closestPointInfo.dist < minDist) {
      minDist = closestPointInfo.dist;
      minDistSegmentEndPoints = segmentEndPoints;
      minDistPoint = closestPointInfo.point;
    }
  }
  return {segmentEndPoints:minDistSegmentEndPoints, point:minDistPoint};
}
function getClosestLineOfTempMapToPoint(point, tempMap) {
  var segmentEndPoints, closestPointInfo;
  var minDist = Infinity;
  var minDistSegmentEndPoints;
  var minDistPoint;
  var i;
  for (i = 0; i < tempMap.points.length; i++) {
    if (i === 0) {
      segmentEndPoints = [{x:tempMap.points[tempMap.points.length - 1].x, y:tempMap.points[tempMap.points.length - 1].y, index:tempMap.points.length - 1}, {x:tempMap.points[0].x, y:tempMap.points[0].y, index:0}];
    } else {
      segmentEndPoints = [{x:tempMap.points[i - 1].x, y:tempMap.points[i - 1].y, index:i - 1}, {x:tempMap.points[i].x, y:tempMap.points[i].y, index:i}];
    }
    closestPointInfo = getClosestPointToSegment({x:point.x, y:point.y}, segmentEndPoints[0], segmentEndPoints[1]);
    if (closestPointInfo.dist < minDist) {
      minDist = closestPointInfo.dist;
      minDistSegmentEndPoints = segmentEndPoints;
      minDistPoint = closestPointInfo.point;
    }
  }
  return {segmentEndPoints:minDistSegmentEndPoints, point:minDistPoint};
}
function reflectCell(cell, reflectionLine, closestLineData) {
  var toPoint = {x:closestLineData.point.x - cell.x, y:closestLineData.point.y - cell.y};
  var dotProductResult = toPoint.x * cell.xv + toPoint.y * cell.yv;
  if (dotProductResult < 0) {
    var reflectionLineLengthNormaliseTemp = 1 / Math.sqrt(Math.pow(reflectionLine.x, 2) + Math.pow(reflectionLine.y, 2));
    var reflectionNormalx = -reflectionLine.y * reflectionLineLengthNormaliseTemp;
    var reflectionNormaly = reflectionLine.x * reflectionLineLengthNormaliseTemp;
    dotProductResult = cell.xv * reflectionNormalx + cell.yv * reflectionNormaly;
    cell.x -= cell.xv;
    cell.y -= cell.yv;
    cell.xv -= 2 * dotProductResult * reflectionNormalx;
    cell.yv -= 2 * dotProductResult * reflectionNormaly;
  }
}
function particlePhysics(tempParticles, collideParticlesWithHighestOldMapForCurLevelAndShiftCorrespondingToOffset) {
  var i;
  var particle;
  var tempMap = map;
  var randomDir, randomSpeed, particleInsideMap;
  for (i = tempParticles.length - 1; i > -1; i--) {
    particle = tempParticles[i];
    if (particle.size < 0.01) {
      tempParticles.splice(i, 1);
    } else {
      particle.xv *= particle.vDecayRate;
      particle.yv *= particle.vDecayRate;
      particle.size *= particle.sizeDecayRate;
      particle.x += particle.xv;
      particle.y += particle.yv;
      if (particle.offsetShiftLastFrame.lastRenderFrameUpdated === undefined || particle.offsetShiftLastFrame.lastRenderFrameUpdated !== frame - 1) {
        particle.offsetShiftLastFrame.x = -particle.xv;
        particle.offsetShiftLastFrame.y = -particle.yv;
      } else {
        particle.offsetShiftLastFrame.x += -particle.xv;
        particle.offsetShiftLastFrame.y += -particle.yv;
      }
      if (collideParticlesWithHighestOldMapForCurLevelAndShiftCorrespondingToOffset && highestOldMapForCurLevel.map !== undefined) {
        particleInsideMap = checkIfUnprojectedPointIsInsideTempMap({x:particle.x + particle.offset.x - highestOldMapForCurLevel.offset.x, y:particle.y + particle.offset.y - highestOldMapForCurLevel.offset.y}, highestOldMapForCurLevel.map);
        if (particle.mapBoundaryStoppingMode === 1 && particleInsideMap) {
          particle.x += particle.offsetShiftLastFrame.x;
          particle.y += particle.offsetShiftLastFrame.y;
          particle.xv = 0;
          particle.yv = 0;
          particle.stoppedOnOldMapWall = true;
        }
      }
      if (particle.mapBoundaryStoppingMode !== 0 && (options.render.stopParticlesOnWall && !particle.stoppedOnOldMapWall)) {
        particleInsideMap = checkIfUnprojectedPointIsInsideTempMap(particle, tempMap);
        if (particle.mapBoundaryStoppingMode === 2 && !particleInsideMap && (particle.xv === 0 && particle.yv === 0)) {
          particle.mapBoundaryStoppingMode = 1;
        }
        if (particle.mapBoundaryStoppingMode === 1 && particleInsideMap || particle.mapBoundaryStoppingMode === 2 && !particleInsideMap) {
          particle.x -= particle.xv;
          particle.y -= particle.yv;
          particle.xv = 0;
          particle.yv = 0;
        } else {
          if (particle.xv === 0 && particle.yv === 0) {
            randomDir = Math.random() * Math.PI * 2;
            randomSpeed = Math.random() * 0.5;
            particle.xv += Math.sin(randomDir) * randomSpeed;
            particle.yv += Math.cos(randomDir) * randomSpeed;
          }
        }
      }
    }
  }
}
function textParticlePhysics(tempParticles) {
  var i;
  var particle;
  var mouseUnprojected = unprojectPoint({x:mouseposx, y:mouseposy});
  for (i = tempParticles.length - 1; i > -1; i--) {
    particle = tempParticles[i];
    if (particle.size < 1) {
      tempParticles.splice(i, 1);
    } else {
      var dir = getDirection(mouseUnprojected.x - particle.x, mouseUnprojected.y - particle.y);
      var dist = getSquareOfDistance(mouseUnprojected.x - particle.x, mouseUnprojected.y - particle.y);
      particle.xv += Math.sin(dir) / (dist + 1 * 10000) * 1000 * 3 * 10;
      particle.yv += Math.cos(dir) / (dist + 1 * 10000) * 1000 * 3 * 10;
      if (decayTitleScreenTextParticles) {
        particle.size *= particle.sizeDecayRate;
        particle.xv = particle.xv * 1.05 + (Math.random() - 0.5);
        particle.yv = particle.yv * 1.05 + (Math.random() - 0.5);
        particle.xv += -Math.sin(dir) / (dist + 10) * 600 * 3;
        particle.yv += -Math.cos(dir) / (dist + 10) * 600 * 3;
      } else {
        particle.xv *= particle.vDecayRate;
        particle.yv *= particle.vDecayRate;
        particle.xv += (particle.startPos.x - particle.x) / 5;
        particle.yv += (particle.startPos.y - particle.y) / 5;
      }
      particle.x += particle.xv;
      particle.y += particle.yv;
    }
  }
}
function rotateVector2(velocity, angle) {
  var rotatedVelocities = {x:velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle), y:velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)};
  return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
  var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
  var xDist = otherParticle.x - particle.x;
  var yDist = otherParticle.y - particle.y;
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
    var u1 = rotateVector2(particle.velocity, angle);
    var u2 = rotateVector2(otherParticle.velocity, angle);
    var v1 = {x:u2.x, y:u1.y};
    var v2 = {x:u1.x, y:u2.y};
    var vFinal1 = rotateVector2(v1, -angle);
    var vFinal2 = rotateVector2(v2, -angle);
    var ratioDifference = (getDistance(particle.velocity.x, particle.velocity.y) + getDistance(otherParticle.velocity.x, otherParticle.velocity.y)) / (getDistance(vFinal1.x, vFinal1.y) + getDistance(vFinal2.x, vFinal2.y));
    return {resolved:true, vels:[{xv:vFinal1.x * ratioDifference, yv:vFinal1.y * ratioDifference}, {xv:vFinal2.x * ratioDifference, yv:vFinal2.y * ratioDifference}]};
  } else {
    return {resolved:false};
  }
}
function explodeMapObject(object) {
  var i2;
  var randomSpeed, randomDist;
  var particleTypeTemp, particleSpawnPointTemp;
  switch(object.type) {
    case 0:
      for (i2 = 0; i2 < 200; i2++) {
        var randomDir = Math.PI * 2 * Math.random();
        randomSpeed = Math.random() * 0.4;
        var randomDir2 = Math.PI * 2 * Math.random();
        randomDist = 1 / 2 * Math.random() * object.data.radius;
        particleSpawnPointTemp = {x:object.x + Math.sin(randomDir2) * randomDist, y:object.y + Math.cos(randomDir2) * randomDist};
        if (checkIfUnprojectedPointIsInsideMap(particleSpawnPointTemp)) {
          particleTypeTemp = 2;
        } else {
          particleTypeTemp = 1;
        }
        createNewParticle(particleSpawnPointTemp.x, particleSpawnPointTemp.y, Math.random() * options.particleSizeMultiplier, Math.sin(randomDir) * randomSpeed, Math.cos(randomDir) * randomSpeed, 0.97, 0.95, colourScheme.circularBooster.two, particleTypeTemp);
      }
      break;
    case 1:
      for (i2 = 0; i2 < 200; i2++) {
        randomDist = Math.random() * object.data.length;
        particleSpawnPointTemp = {x:object.x + Math.sin(object.data.angle) * randomDist, y:object.y + Math.cos(object.data.angle) * randomDist};
        if (checkIfUnprojectedPointIsInsideMap(particleSpawnPointTemp)) {
          particleTypeTemp = 2;
          randomSpeed = 0.8 + Math.random() * 0.4;
        } else {
          particleTypeTemp = 1;
          randomSpeed = 2 + Math.random() * 0.5;
        }
        createNewParticle(particleSpawnPointTemp.x, particleSpawnPointTemp.y, Math.random() * options.particleSizeMultiplier * 0.7, Math.cos(object.data.angle) * Math.sqrt(randomDist) * Math.sqrt(Math.abs(object.data.angularVel)) * 0.4 * randomSpeed * Math.sign(object.data.angularVel), -Math.sin(object.data.angle) * Math.sqrt(randomDist) * Math.sqrt(Math.abs(object.data.angularVel)) * 0.4 * randomSpeed * Math.sign(object.data.angularVel), 0.97, 0.95, colourScheme.rotatingArm, particleTypeTemp);
      }
      break;
    default:
      console.error("object type not known: " + object.type + " obj: " + object + " type: " + object.type);
  }
}
function mapObjectPhysics() {
  var i, i2, i3;
  var cell;
  var closestLineData;
  for (i = map.objects.length - 1; i > -1; i--) {
    var object = map.objects[i];
    object.frame += 1;
    var objectDeleted = false;
    switch(object.type) {
      case 0:
        closestLineData = checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMapAndReturnClosestLineData(object, map, object.data.radius);
        if (!closestLineData.insideMap) {
          explodeMapObject(object);
          map.objects.splice(i, 1);
          objectDeleted = true;
        }
        break;
      case 1:
        var armPosDelta = {x:object.data.length * Math.sin(object.data.angle), y:object.data.length * Math.cos(object.data.angle)};
        var armEndPos = {x:object.x + armPosDelta.x, y:object.y + armPosDelta.y};
        if (checkIfUnprojectedPointIsInsideMap(object) && checkIfUnprojectedPointIsInsideMap(armEndPos)) {
          object.data.angle += object.data.angularVel;
          object.data.angularVel *= object.data.angularFriction;
          for (i2 = object.data.recentlyHitCells.length - 1; i2 > -1; i2--) {
            if (object.data.recentlyHitCells[i2].framesLeft === 0) {
              object.data.recentlyHitCells.splice(i2, 1);
            } else {
              object.data.recentlyHitCells[i2].framesLeft -= 1;
            }
          }
        } else {
          object.data.angle += -object.data.angularVel;
          explodeMapObject(object);
          map.objects.splice(i, 1);
          objectDeleted = true;
        }
        break;
      default:
        console.error("object type not known: " + object.type + " obj: " + object + " i: " + i);
    }
    if (!objectDeleted) {
      for (i2 = 0; i2 < cells.length; i2++) {
        cell = cells[i2];
        if (cell.x + options.cellSize / 2 > object.x - object.boundingBox.halfX && cell.x - options.cellSize / 2 < object.x + object.boundingBox.halfX && (cell.y + options.cellSize / 2 > object.y - object.boundingBox.halfY && cell.y - options.cellSize / 2 < object.y + object.boundingBox.halfY)) {
          switch(object.type) {
            case 0:
              if (getSquareOfDistance(cell.x - object.x, cell.y - object.y) < Math.pow(object.data.radius + options.cellSize / 2, 2)) {
                var speedToAdd = object.data.power / 40 - cell.boostedSpeedLeftToRemove;
                if (speedToAdd > 0) {
                  var cellDir = getDirection(cell.xv, cell.yv);
                  cell.xv += Math.sin(cellDir) * speedToAdd;
                  cell.yv += Math.cos(cellDir) * speedToAdd;
                  cell.boostedSpeedLeftToRemove += speedToAdd;
                }
                if (cell.speedBoostedFramesLeft < object.data.power) {
                  cell.speedBoostedFramesLeft = object.data.power;
                }
              }
              break;
            case 1:
              var cellHitTooRecently = false;
              for (i3 = 0; i3 < object.data.recentlyHitCells.length; i3++) {
                if (object.data.recentlyHitCells[i3].cell === cell) {
                  cellHitTooRecently = true;
                }
              }
              if (!cellHitTooRecently) {
                var closestPointInfo = getClosestPointToSegment(cell, object, armEndPos);
                if (closestPointInfo.dist < Math.pow(options.cellSize / 2 + object.data.width / 2, 2)) {
                  var v1x = cell.x - closestPointInfo.point.x;
                  var v1y = cell.y - closestPointInfo.point.y;
                  var len = getDistance(v1x, v1y);
                  var tx = -v1y / len;
                  var ty = v1x / len;
                  var dot = (cell.xv * tx + cell.yv * ty) * 2;
                  cell.xv = -cell.xv + tx * dot;
                  cell.yv = -cell.yv + ty * dot;
                  object.data.recentlyHitCells.push({cell:cell, framesLeft:10});
                  object.data.angularVel *= -1;
                }
              }
              break;
            default:
              console.error("object type not known: " + object.type + " obj: " + object + " i: " + i);
          }
        }
      }
    }
  }
}
function physics() {
  var i, cell;
  var i2;
  var reverseCellDir;
  for (i = cells.length - 1; i > -1; i--) {
    cell = cells[i];
    cell.x += cell.xv;
    cell.y += cell.yv;
    var checkCellInsideMapData = checkIfUnprojectedCircleWithNonZeroRadiusIsInsideTempMapAndReturnClosestLineData(cell, map, options.cellSize / 2);
    if (!checkCellInsideMapData.insideMap) {
      var closestLineData = checkCellInsideMapData.closestLineData;
      var segmentEndPoints = closestLineData.segmentEndPoints;
      reflectCell(cell, {x:segmentEndPoints[1].x - segmentEndPoints[0].x, y:segmentEndPoints[1].y - segmentEndPoints[0].y}, closestLineData);
    }
    if (options.cellCollisions) {
      for (i2 = cells.length - 1; i2 > i - 1; i2--) {
        if (i2 !== i) {
          var cell2 = cells[i2];
          if (getSquareOfDistance(cell.x - cell2.x, cell.y - cell2.y) < Math.pow((cell.size + cell2.size) / 2, 2)) {
            var postCollisionVels = resolveCollision({velocity:{x:cell.xv, y:cell.yv}, x:cell.x, y:cell.y}, {velocity:{x:cell2.xv, y:cell2.yv}, x:cell2.x, y:cell2.y});
            if (postCollisionVels.resolved) {
              cell.xv = postCollisionVels.vels[0].xv;
              cell.yv = postCollisionVels.vels[0].yv;
              cell2.xv = postCollisionVels.vels[1].xv;
              cell2.yv = postCollisionVels.vels[1].yv;
              var cellSpeed = getDistance(cell.xv, cell.yv);
              var cell2Speed = getDistance(cell2.xv, cell2.yv);
              var totalBoostedSpeedLeftToRemove = cell.boostedSpeedLeftToRemove + cell2.boostedSpeedLeftToRemove;
              var totalSpeed = cellSpeed + cell2Speed;
              cell.boostedSpeedLeftToRemove = cellSpeed / totalSpeed * totalBoostedSpeedLeftToRemove;
              cell2.boostedSpeedLeftToRemove = cell2Speed / totalSpeed * totalBoostedSpeedLeftToRemove;
            }
          }
        }
      }
    }
    if (cell.speedBoostedFramesLeft > 0) {
      cell.color = "hsla(" + Math.floor(Math.tanh(cell.speedBoostedFramesLeft / 300) * 360) + ", 100%, 50%,1)";
      cell.huePartOfHSLColour = Math.floor(Math.tanh(cell.speedBoostedFramesLeft / 300) * 360);
      reverseCellDir = getDirection(-cell.xv, -cell.yv);
      var particleDir, randomSpeed;
      for (i2 = 0; i2 < Math.tanh(cell.speedBoostedFramesLeft / 300) * 40; i2++) {
        particleDir = reverseCellDir + (Math.random() - 0.5) * Math.PI / 8;
        randomSpeed = Math.random();
        var randomCellOutsidePointDir = reverseCellDir + (Math.random() - 0.5) * Math.PI * 0.6;
        createNewParticle(cell.x + Math.sin(randomCellOutsidePointDir) * options.cellSize / 2, cell.y + Math.cos(randomCellOutsidePointDir) * options.cellSize / 2, Math.random() * options.particleSizeMultiplier * 0.1, cell.xv + Math.sin(particleDir) * randomSpeed, cell.yv + Math.cos(particleDir) * randomSpeed, 0.97, 0.95, cell.color, 2);
      }
      cell.speedBoostedFramesLeft -= 1;
    } else {
      cell.color = "hsla(0, 100%, 50%, 1)";
      cell.huePartOfHSLColour = 0;
    }
    if (cell.boostedSpeedLeftToRemove > 0) {
      reverseCellDir = getDirection(-cell.xv, -cell.yv);
      var speedToRemoveThisFrame;
      if (cell.boostedSpeedLeftToRemove < 0.05) {
        speedToRemoveThisFrame = cell.boostedSpeedLeftToRemove;
      } else {
        speedToRemoveThisFrame = cell.boostedSpeedLeftToRemove / 80;
      }
      cell.boostedSpeedLeftToRemove -= speedToRemoveThisFrame;
      cell.xv += Math.sin(reverseCellDir) * speedToRemoveThisFrame;
      cell.yv += Math.cos(reverseCellDir) * speedToRemoveThisFrame;
    }
  }
  mapObjectPhysics();
  particlePhysics(particles, true);
  particlePhysics(particlesCreatedPreviousLevelRuns, true);
  textParticlePhysics(textParticles);
}
function updateCamera() {
  centerX = window.innerWidth / 2;
  centerY = window.innerHeight / 2;
  gameArea.canvas.width = centerX * 2;
  gameArea.canvas.height = centerY * 2;
  cameraX = 0 + centerX / zoom + cameraOffsetX;
  cameraY = 0 + centerY / zoom + cameraOffsetY;
}
var storyData = [{levelID:"stage1level2b", totalFrames:612 + 60 + 1230, stageID:"gameofTheHidden", curFrame:0}, {levelID:"stage1level4a", totalFrames:480 + 60 + 1480 + 1400, stageID:"stacksPileAndTessellation", curFrame:0}, {levelID:"stage1level8a", totalFrames:1355, stageID:"suicideChamber2D", curFrame:0}, {levelID:"stage1level9d", totalFrames:Infinity, stageID:"suicideChamberAndPlayerInMap3D", curFrame:0}];
if (location.search.includes("story=false")) {
  storyData = [];
  cl("removing any loaded story data as story=false flag in url?<>");
}
cl('disabling story')
storyData = [];
var storyDataInternals = {startCameraOffsetX:undefined, startCameraOffsetY:undefined, startCameraZoom:undefined, haveSetStartCamera:false};
function renderStoryIfRequired() {
  var preventNormalRendering = false;
  var i;
  var storyDataForLevel;
  for (i = 0; i < storyData.length; i++) {
    storyDataForLevel = storyData[i];
    if (storyDataForLevel.levelID === currentLevel.id && storyDataForLevel.curFrame < storyDataForLevel.totalFrames) {
      if (!storyDataInternals.haveSetCameraOffset) {
        storyDataInternals.haveSetCameraOffset = true;
        storyDataInternals.startCameraOffsetX = cameraOffsetX;
        storyDataInternals.startCameraOffsetY = cameraOffsetY;
        storyDataInternals.startCameraZoom = zoom;
      }
      renderStoryV2(storyDataForLevel.stageID, storyDataForLevel.curFrame);
      storyDataForLevel.curFrame++;
      preventNormalRendering = true;
      if (storyDataForLevel.curFrame === storyDataForLevel.totalFrames) {
        setColorSchemeToNormalGameOne();
        storyDataInternals.haveSetCameraOffset = false;
        cameraOffsetX = storyDataInternals.startCameraOffsetX;
        cameraOffsetY = storyDataInternals.startCameraOffsetY;
        zoom = storyDataInternals.startCameraZoom;
      }
    }
  }
  return preventNormalRendering;
}
function updateGameArea() {
  gameArea.clear();
  frame += 1;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  if (inputType === 0) {
    document.onmousemove = function(e) {
      var event = e || window.event;
      window.mouseX = event.clientX;
      window.mouseY = event.clientY;
      mouseposx = window.mouseX;
      mouseposy = window.mouseY;
    };
  }
  if (inputType === 1) {
    canvas.addEventListener("touchmove", function(e) {
      if (!e) {
        var e = event;
      }
      if (e.touches) {
        if (e.touches.length == 1) {
          var touch = e.touches[0];
          mouseposx = touch.pageX - touch.target.offsetLeft;
          mouseposy = touch.pageY - touch.target.offsetTop;
        }
      }
    }, false);
  }
  function mousemov() {
    document.getElementById("canvas").style.left = window.mouseX;
  }
  window.onload = function() {
    setInterval(mousemov, 1000);
  };
  if (inputType === 0) {
    DOMBody.onmousedown = function() {
      mouseDown();
    };
    DOMBody.onmouseup = function() {
      mouseUp();
    };
  }
  if (inputType === 1) {
    canvas.addEventListener("touchstart", mouseDown, false);
    canvas.addEventListener("touchend", mouseUp, false);
  }
  function mouseDown() {
    mouseState = 1;
  }
  function mouseUp() {
    mouseState = 0;
  }
  function getDistance(deltaX, deltaY) {
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }
  function getSquareOfDistance(deltaX, deltaY) {
    return Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
  }
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  if (!dev.disableKeyboardControls) {
    if (gameArea.keys && gameArea.keys[48]) {
      cameraX -= centerX / zoom - centerX / (zoom / 1.1);
      cameraY -= centerY / zoom - centerY / (zoom / 1.1);
      zoom = zoom / 1.1;
    }
    if (gameArea.keys && gameArea.keys[57]) {
      cameraX -= centerX / zoom - centerX / (zoom * 1.1);
      cameraY -= centerY / zoom - centerY / (zoom * 1.1);
      zoom = zoom * 1.1;
    }
    if (gameArea.keys && gameArea.keys[87]) {
      cameraOffsetY += 6 / zoom;
    }
    if (gameArea.keys && gameArea.keys[83]) {
      cameraOffsetY -= 6 / zoom;
    }
    if (gameArea.keys && gameArea.keys[65]) {
      cameraOffsetX += 6 / zoom;
    }
    if (gameArea.keys && gameArea.keys[68]) {
      cameraOffsetX -= 6 / zoom;
    }
  }
  updateCamera();
  var doNotRenderNormally = false;
  if (ui.scene === 3) {
    titleScreenAnimation.preClickFrames += 1;
    doNotRenderNormally = true;
    var offset = getMapStackOffsetCurLevel();
    updateMouseHistory(offset);
    renderParticles(textParticles);
    textParticlePhysics(textParticles);
    if (titleScreenAnimation.curFrame === -1) {
      var framesBeforeShowPrompt = 60 * 5;
      var fadeInTransitionFrames = 60;
      if (titleScreenAnimation.preClickFrames > framesBeforeShowPrompt) {
        if (titleScreenAnimation.preClickFrames > framesBeforeShowPrompt + fadeInTransitionFrames) {
          ctx.fillStyle = "#FFF";
        } else {
          ctx.fillStyle = "hsla(360, 100%, 100%," + (titleScreenAnimation.preClickFrames - framesBeforeShowPrompt) / fadeInTransitionFrames + ")";
        }
        var textToRender = "Tap";
        ctx.font = "25px Arial";
        ctx.fillText(textToRender, -ctx.measureText(textToRender).width / 2 + canvas.width / 2, canvas.height * 0.1);
      } else {
      }
      if (mousePosHistory[0].mouseState === 1 && mousePosHistory[1].mouseState === 0) {
        decayTitleScreenTextParticles = true;
        titleScreenAnimation.curFrame = 0;
        titleScreenAnimation.totalFrames = 100;
      }
    } else {
      doNotRenderNormally = true;
      if (titleScreenAnimation.curFrame === titleScreenAnimation.totalFrames) {
        ui.scene = 0;
      } else {
        titleScreenAnimation.curFrame += 1;
      }
    }
  }
  if (ui.scene === 2) {
    doNotRenderNormally = renderStoryIfRequired();
  }
  if (!doNotRenderNormally) {
    currentLevel.frame += 1;
    var offset = getMapStackOffsetCurLevel();
    updateMouseHistory(offset);
    var i;
    for (i = 0; i < frameskip + 1; i++) {
      physicsFrame += 1;
      physics();
    }
    render();
  }
  fpsDelta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps.splice(0, 1);
  fps.push(1 / fpsDelta);
  var averagefps = 0;
  i = 0;
  while (i < 30) {
    averagefps += fps[i];
    i++;
  }
  if (dev.showFPS) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(Math.round(averagefps / 30), 10, 50);
  }
}
function resetCamera() {
  zoom = 1;
  cameraOffsetX = 0;
  cameraOffsetY = 0;
}
addLevels();
setMap(levelIDsInPlayingOrder[0].id);
