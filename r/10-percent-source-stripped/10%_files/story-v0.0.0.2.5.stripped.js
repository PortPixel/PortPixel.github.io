"use strict";
var cameraOffsetY = cameraOffsetY || undefined;
var cameraOffsetX = cameraOffsetX || undefined;
var zoom = zoom || undefined;
var colourScheme = colourScheme || undefined;
var storyOptions = {endlessStacks:{chanceOfEmptyStack:0.05, chanceOfStackEndInCameraView:0.1, stackSpacing:370}};
var endlessStacks = {stacks:undefined, initalised:false};
var particlePile = {particles:undefined, initalised:false};
var mapTessellation = {maps:undefined, initalised:false};
var storyTextParticles = {maps:undefined, initalised:false};
var randomSeed = 1834;
function seededRandom() {
  var x = Math.sin(randomSeed++) * 10000;
  return x - Math.floor(x);
}
var gameCompleteScene = {yays:[], initalised:false};
function renderStoryV2(stageID, frameForSection) {
  colourScheme = {rotatingArm:"hsla(0, 0%, 60%, 1)", circularBooster:{one:"hsla(0, 0%, 38%, 1)", two:"hsla(0, 0%, 56%, 1)"}, map:{mainColor:"hsla(0, 0%, 43%, 1)"}, background:"hsla(240, 100%, 0%, 1)"};
  switch(stageID) {
    case "gameofTheHidden":
      if (frameForSection < 612) {
        renderGameCompleteScene(frameForSection);
      } else {
        frameForSection -= 612;
        if (frameForSection < 60) {
          renderBackground();
        } else {
          frameForSection -= 60;
          if (frameForSection < 1230) {
            render10IsAGameOfTheHiddenTextScene(frameForSection);
          } else {
            frameForSection -= 1230;
          }
        }
      }
      break;
    case "stacksPileAndTessellation":
      if (frameForSection < 480) {
        renderEndlessStacks(frameForSection);
      } else {
        frameForSection -= 480;
        if (frameForSection < 60) {
          renderBackground();
        } else {
          frameForSection -= 60;
          if (frameForSection < 1480) {
            renderParticlePile(frameForSection);
          } else {
            frameForSection -= 1480;
            if (frameForSection < 1400) {
              renderMapTessellation(frameForSection);
            } else {
              frameForSection -= 1400;
            }
          }
        }
      }
      break;
    case "suicideChamber2D":
      renderSuicideChamber(frameForSection);
      break;
    case "suicideChamberAndPlayerInMap3D":
      hideNormalGame();
      showResetSuicideChamber();
      break;
    case "sceneAfterSuicideChamber":
      renderSceneAfterSuicideChamber(frameForSection);
      break;
    default:
      console.error("stageID not known:" + stageID);
  }
}
function renderStory(frameForSection) {
  colourScheme = {rotatingArm:"hsla(0, 0%, 60%, 1)", circularBooster:{one:"hsla(0, 0%, 38%, 1)", two:"hsla(0, 0%, 56%, 1)"}, map:{mainColor:"hsla(0, 0%, 43%, 1)"}, background:"hsla(240, 100%, 0%, 1)"};
}
var suicideChamber = {initalised:false};
function setUpEndlessStacks(viewportHeightInWorldPosTerms) {
  var numStacks = 100;
  endlessStacks.stacks = [];
  var i;
  var randomNumber;
  for (i = 0; i < numStacks; i++) {
    randomNumber = seededRandom();
    if (randomNumber < storyOptions.endlessStacks.chanceOfEmptyStack) {
      endlessStacks.stacks.push([]);
    } else {
      if (randomNumber < storyOptions.endlessStacks.chanceOfEmptyStack + storyOptions.endlessStacks.chanceOfStackEndInCameraView) {
        endlessStacks.stacks.push(genRandomStack(viewportHeightInWorldPosTerms * seededRandom()));
      } else {
        endlessStacks.stacks.push(genRandomStack(viewportHeightInWorldPosTerms));
      }
    }
  }
}
function genRandomStack(minHeight) {
  var totalHeightSoFar = 0;
  var stack = [];
  var tempMap;
  tempMap = getRandomOldMapFromArr();
  totalHeightSoFar += tempMap.maxY;
  stack.push(tempMap);
  while (totalHeightSoFar < minHeight) {
    tempMap = getRandomOldMapFromArr();
    totalHeightSoFar += -tempMap.minY + tempMap.maxY;
    stack.push(tempMap);
  }
  return stack;
}
function getRandomOldMapFromArr() {
  return randomOldMapsArr[Math.floor(randomOldMapsArr.length * seededRandom())];
}
function renderStack(stack, offset) {
  var i;
  var renderOldMapCurOffset;
  var curYPos = 0;
  var curOldMap;
  for (i = 0; i < stack.length; i++) {
    curOldMap = stack[i];
    if (i > 0) {
      curYPos += -curOldMap.minY + stack[i - 1].maxY;
    }
    renderOldMapCurOffset = {x:offset.x, y:offset.y + curYPos};
    if ((cameraY - (renderOldMapCurOffset.y + curOldMap.maxY)) * zoom > canvas.height) {
    } else {
      renderMap(curOldMap.map, renderOldMapCurOffset);
    }
  }
}
function renderEndlessStacks(frameForSection) {
  var maxViewportHeightInWorldPosTerms = canvas.height / 0.13;
  zoom = 200 / (100 + frameForSection);
  cameraOffsetX = -400 + -Math.pow(frameForSection, 3) / 10000 - Math.pow(1.07, frameForSection) / 10000000000;
  cameraOffsetY = maxViewportHeightInWorldPosTerms / 2;
  if (!endlessStacks.initalised) {
    setUpEndlessStacks(maxViewportHeightInWorldPosTerms);
    endlessStacks.initalised = true;
  }
  updateCamera();
  ctx.fillStyle = colourScheme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var i;
  for (i = 0; i < endlessStacks.stacks.length; i++) {
    renderStack(endlessStacks.stacks[i], {x:-storyOptions.endlessStacks.stackSpacing * i, y:0});
  }
}
function setUpParticlePile() {
  particlePile.particles = [];
  zoom = 0.3;
  cameraOffsetX = 0;
  cameraOffsetY = 0;
  updateCamera();
  particlePile.spawnYPos = cameraY * 1.1;
  particlePile.map = {points:[{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}], data:{render:{spacer:{isSpacer:false}}}};
}
function renderParticlePile(frameForSection) {
  if (!particlePile.initalised) {
    setUpParticlePile();
    particlePile.initalised = true;
  }
  var rotation = {on:false, angle:undefined};
  if (frameForSection > 400) {
    var fractionComplete, scrollMultiplier;
    if (frameForSection < 700) {
      fractionComplete = (frameForSection - 400) / 600;
      scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
      updateCamera();
      rotation.angle = Math.PI * 2 * scrollMultiplier;
    } else {
      fractionComplete = (frameForSection - 400) / 600;
      scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
      zoom = 0.3 + (7 - 0.3) * (scrollMultiplier - 0.5);
      updateCamera();
      rotation.angle = Math.PI * 2 * scrollMultiplier;
    }
    rotation.on = true;
  }
  ctx.fillStyle = colourScheme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var gravity = -.3;
  var randomColor;
  if (seededRandom() < 0.1) {
    randomColor = "hsla(" + Math.floor(seededRandom() * 360) + ", 100%, 50%, 1)";
  } else {
    randomColor = "#FF0000";
  }
  var i;
  for (i = 0; i < 10; i++) {
    particlePile.particles.push({x:(seededRandom() - 0.5) * 40, y:particlePile.spawnYPos, xv:0, yv:-10 + -5 * seededRandom() + gravity * seededRandom(), color:randomColor});
  }
  var particle;
  for (i = particlePile.particles.length - 1; i > -1; i--) {
    particle = particlePile.particles[i];
    particle.x += particle.xv;
    particle.y += particle.yv;
    particle.yv += gravity;
    particle.xv += seededRandom() - 0.5;
    particle.yv *= 0.97;
    particle.xv *= 0.97;
    if (true) {
      var mouseUnprojected = unprojectPoint({x:mouseposx, y:mouseposy});
      var mouseUnprojectedRotated;
      if (rotation.on) {
        mouseUnprojectedRotated = rotateVector2(mouseUnprojected, -rotation.angle);
      } else {
        mouseUnprojectedRotated = mouseUnprojected;
      }
      var dir = getDirection(mouseUnprojectedRotated.x - particle.x, mouseUnprojectedRotated.y - particle.y);
      var dist = getSquareOfDistance(mouseUnprojectedRotated.x - particle.x, mouseUnprojectedRotated.y - particle.y);
      particle.xv += Math.sin(dir) / (dist + 10000) * 10000 * 3;
      particle.yv += Math.cos(dir) / (dist + 10000) * 10000 * 3;
    }
    if (particle.y < (cameraY - canvas.height / zoom) * 2) {
      particlePile.particles.splice(i, 1);
    }
    if (checkIfUnprojectedPointIsInsideTempMap(particle, particlePile.map)) {
      particlePile.particles.splice(i, 1);
    }
  }
  if (rotation.on) {
    var tempParticles = [];
    var rotatedPos;
    for (i = 0; i < particlePile.particles.length; i++) {
      particle = particlePile.particles[i];
      rotatedPos = rotateVector2(particle, rotation.angle);
      tempParticles.push({x:rotatedPos.x, y:rotatedPos.y, color:particle.color});
    }
    var tempMap = {points:[], data:{render:{spacer:{isSpacer:false}}}};
    var point;
    for (i = particlePile.map.points.length - 1; i > -1; i--) {
      point = particlePile.map.points[i];
      rotatedPos = rotateVector2(point, rotation.angle);
      tempMap.points.push({x:rotatedPos.x, y:rotatedPos.y});
    }
    renderParticlesAsSquaresAndConstantSizeAndNoOffset(tempParticles, 10);
    renderMap(tempMap, {x:0, y:0});
    if (frameForSection < 1220) {
      rotatedPos = rotateVector2({x:0, y:particlePile.spawnYPos}, rotation.angle);
      ctx.beginPath();
      ctx.arc((cameraX - rotatedPos.x) * zoom, (cameraY - rotatedPos.y) * zoom, 30 * zoom, 0, 2 * Math.PI, false);
      ctx.fillStyle = colourScheme.map.mainColor;
      ctx.fill();
    }
  } else {
    renderParticlesAsSquaresAndConstantSizeAndNoOffset(particlePile.particles, 10);
    renderMap(particlePile.map, {x:0, y:0});
  }
}
function renderParticlesAsSquaresAndConstantSizeAndNoOffset(tempParticles, size) {
  var projectedSize = size * zoom / 2;
  var i;
  var particle;
  for (i = 0; i < tempParticles.length; i++) {
    particle = tempParticles[i];
    ctx.fillStyle = particle.color;
    ctx.fillRect((cameraX - particle.x) * zoom, (cameraY - particle.y) * zoom, projectedSize, projectedSize);
  }
}
function renderGrid(spacing, color, lineWidth) {
  var i;
  for (i = 0; i < Math.ceil(centerY * 2 / zoom / spacing) + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (cameraY % spacing + i * spacing) * zoom);
    ctx.lineTo(centerX * 2, (cameraY % spacing + i * spacing) * zoom);
    ctx.lineWidth = lineWidth * zoom;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  for (i = 0; i < Math.ceil(centerX * 2 / zoom / spacing) + 1; i++) {
    ctx.beginPath();
    ctx.moveTo((cameraX % spacing + i * spacing) * zoom, 0);
    ctx.lineTo((cameraX % spacing + i * spacing) * zoom, centerY * 2);
    ctx.lineWidth = lineWidth * zoom;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
function setUpMapTessellation() {
  mapTessellation.particles = [];
  zoom = 7 / 2;
  cameraOffsetX = 0;
  cameraOffsetY = 0;
  updateCamera();
}
function renderBackground() {
  ctx.fillStyle = colourScheme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function renderMapTessellation(frameForSection) {
  if (!mapTessellation.initalised) {
    setUpMapTessellation();
    mapTessellation.initalised = true;
  }
  var lineWidth = 2;
  var fractionComplete, scrollMultiplier;
  if (frameForSection < 100) {
    if (frameForSection < 50) {
      fractionComplete = frameForSection / 50;
      scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
      ctx.fillStyle = colourScheme.map.mainColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height * scrollMultiplier);
      ctx.lineWidth = lineWidth * zoom;
      ctx.strokeStyle = colourScheme.background;
      ctx.stroke();
    } else {
      fractionComplete = (frameForSection - 50) / 50;
      scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
      ctx.fillStyle = colourScheme.map.mainColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.lineWidth = lineWidth * zoom;
      ctx.strokeStyle = colourScheme.background;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width * scrollMultiplier, centerY);
      ctx.lineWidth = lineWidth * zoom;
      ctx.strokeStyle = colourScheme.background;
      ctx.stroke();
    }
  } else {
    zoom = 700 / (100 + frameForSection);
    updateCamera();
    ctx.fillStyle = colourScheme.map.mainColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var spacing = 200;
    renderGrid(spacing, colourScheme.background, lineWidth);
    var i, i2;
    for (i = -1; i < Math.ceil(centerY * 2 / zoom / spacing) + 1; i++) {
      for (i2 = -1; i2 < Math.ceil(centerX * 2 / zoom / spacing) + 1; i2++) {
      }
    }
    if (frameForSection < 1350) {
      if (frameForSection > 200) {
        var fontSize = canvas.width / 5;
        ctx.font = Math.floor(fontSize) + "px Special Elite";
        textToRender = "or what you see may only be 10%";
        var textWidth = ctx.measureText(textToRender).width;
        if (textWidth > canvas.width * 0.4) {
          fontSize *= canvas.width * 0.4 / textWidth;
          ctx.font = Math.floor(fontSize) + "px Special Elite";
        }
        var textToRender;
        if (frameForSection < 200) {
          fractionComplete = (frameForSection - 100) / 100;
          scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
          ctx.fillStyle = "hsla(0, 100%, 100%, " + scrollMultiplier + ")";
          textToRender = "careful";
        } else {
          if (frameForSection < 400) {
            if (frameForSection < 300) {
              ctx.fillStyle = "#FFFFFF";
              textToRender = "careful".substr();
            } else {
              ctx.fillStyle = "#FFFFFF";
              textToRender = "careful";
              textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((100 - (frameForSection - 300)) / 100)));
            }
          } else {
            if (frameForSection < 500) {
              if (frameForSection < 470) {
                ctx.fillStyle = "#FFFFFF";
                textToRender = "or";
                textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((frameForSection - 400) / 50)));
              } else {
                ctx.fillStyle = "#FFFFFF";
                textToRender = "or";
                textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((50 - (frameForSection - 450)) / 50)));
              }
            } else {
              if (frameForSection < 700) {
                if (frameForSection < 630) {
                  ctx.fillStyle = "#FFFFFF";
                  textToRender = "what you see";
                  textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((frameForSection - 500) / 100)));
                } else {
                  ctx.fillStyle = "#FFFFFF";
                  textToRender = "what you see";
                  textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((100 - (frameForSection - 600)) / 100)));
                }
              } else {
                if (frameForSection < 930) {
                  if (frameForSection < 830) {
                    ctx.fillStyle = "#FFFFFF";
                    textToRender = "may only be 10";
                    textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((frameForSection - 700) / 100)));
                  } else {
                    ctx.fillStyle = "#FFFFFF";
                    textToRender = "may only be";
                    textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((100 - (frameForSection - 830)) / 100))) + " 10";
                  }
                } else {
                  if (frameForSection < 1350) {
                    if (frameForSection < 1000) {
                      ctx.fillStyle = "#FFFFFF";
                      textToRender = "10";
                    } else {
                      ctx.fillStyle = "#FFFFFF";
                      textToRender = "10%";
                    }
                  }
                }
              }
            }
          }
        }
        ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
      }
    } else {
      if (frameForSection < 1360) {
        fractionComplete = (frameForSection - 1350) / 10;
        scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2 * scrollMultiplier);
        ctx.fillRect(0, canvas.height * (1 - scrollMultiplier / 2), canvas.width, canvas.height / 2 * scrollMultiplier);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
}
function getBlankLevelSuccessSpacerTemplate() {
  var tempSpacer = {"map":{"points":[], "objects":[], "data":{"render":{"spacer":{"isSpacer":true, "type":0, "marginTop":30, "marginBottom":-30, "frame":0, "fadeInDuration":60, "levelName":"", "areaAsPercent":0, "score":0}}}}, "minY":-30, "maxY":30};
  return tempSpacer;
}
function setUpGameCompleteScene() {
  gameCompleteScene.yays = [];
  var i;
  for (i = 0; i < 100; i++) {
    gameCompleteScene.yays.push({x:canvas.width * seededRandom(), y:canvas.height * seededRandom(), sizeScaler:seededRandom(), frame:-1});
  }
}
function renderGameCompleteScene(frameForSection) {
  if (!gameCompleteScene.initalised) {
    setUpGameCompleteScene();
    gameCompleteScene.initalised = true;
  }
  var fractionComplete, scrollMultiplier;
  var offset;
  var fontSize;
  var textToRender;
  var textWidth;
  var i;
  var yay;
  if (frameForSection < 100) {
    render();
  } else {
    if (frameForSection < 300) {
      render();
      fractionComplete = (frameForSection - 100) / 200;
      scrollMultiplier = getSmoothAnimationCurveValueForPoint(fractionComplete);
      ctx.fillStyle = "hsla(168, 100%, 87%, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height * scrollMultiplier);
      offset = getMapStackOffsetCurLevel();
      ctx.fillStyle = "hsla(0, 100%, 0%, " + scrollMultiplier + ")";
      fontSize = canvas.width / 5;
      ctx.font = Math.floor(fontSize) + "px Arial";
      textToRender = "Congratulations!";
      textWidth = ctx.measureText(textToRender).width;
      if (textWidth > canvas.width * 0.8) {
        fontSize *= canvas.width * 0.8 / textWidth;
        ctx.font = Math.floor(fontSize) + "px Arial";
      }
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.2);
      ctx.font = Math.floor(fontSize / 2) + "px Arial";
      textToRender = "Complete! We win!";
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.3);
    } else {
      ctx.fillStyle = "hsla(168, 100%, 87%, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      offset = getMapStackOffsetCurLevel();
      ctx.fillStyle = "hsla(0, 100%, 0%, 1)";
      fontSize = canvas.width / 5;
      ctx.font = Math.floor(fontSize) + "px Arial";
      textToRender = "Congratulations!";
      textWidth = ctx.measureText(textToRender).width;
      if (textWidth > canvas.width * 0.8) {
        fontSize *= canvas.width * 0.8 / textWidth;
        ctx.font = Math.floor(fontSize) + "px Arial";
      }
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.2);
      fontSize /= 2;
      ctx.font = Math.floor(fontSize) + "px Arial";
      textToRender = "Complete! We win!";
      ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.3);
      for (i = 0; i < Math.floor(Math.pow(1.03, (frameForSection - 300) / 2)) && i < gameCompleteScene.yays.length; i++) {
        yay = gameCompleteScene.yays[i];
        yay.frame += 1;
        if (yay.frame < 30) {
          ctx.fillStyle = "hsla(0, 100%, 0%, " + yay.frame / 30 + ")";
        } else {
          ctx.fillStyle = "hsla(0, 100%, 0%, 1)";
        }
        ctx.font = Math.floor(fontSize * yay.sizeScaler) + "px Arial";
        renderRotatedText("Yay!", yay.x, yay.y, Math.sin(frameForSection / 100) * Math.PI / 3, fontSize * yay.sizeScaler / 1.8);
      }
    }
  }
}
function renderZoomIntoCell(frameForSection) {
  cameraOffsetX = 0;
  cameraOffsetY = 0;
  zoom = Math.pow(1.03, frameForSection / 5) - 0.999 + Math.pow(1.1, frameForSection) / 10000000;
  updateCamera();
  renderBackground();
  ctx.beginPath();
  ctx.arc((cameraX - 0) * zoom, (cameraY - 0) * zoom, 10 * zoom / 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#FF0000";
  ctx.strokeStyle = "#a80000";
  ctx.fill();
  ctx.lineWidth = 10 / 10 * zoom;
  ctx.stroke();
}
function render10IsAGameOfTheHiddenTextScene(frameForSection) {
  renderBackground();
  if (frameForSection < 1230) {
    var fontSize = canvas.width / 5;
    ctx.font = Math.floor(fontSize) + "px Special Elite";
    textToRender = "or what you see may only be 10%";
    var textWidth = ctx.measureText(textToRender).width;
    if (textWidth > canvas.width * 0.4) {
      fontSize *= canvas.width * 0.4 / textWidth;
      ctx.font = Math.floor(fontSize) + "px Special Elite";
    }
    var textToRender;
    ctx.fillStyle = "hsla(0, 100%, 100%, 1)";
    if (frameForSection < 200) {
      textToRender = "10%";
    } else {
      if (frameForSection < 1230) {
        if (frameForSection < 500) {
          textToRender = " is a game";
          textToRender = "10%" + textToRender.substring(0, Math.floor(textToRender.length * ((frameForSection - 200) / 300)));
        } else {
          if (frameForSection < 700) {
            textToRender = "10% is a game";
          } else {
            if (frameForSection < 1100) {
              textToRender = " of the hidden";
              textToRender = "10% is a game" + textToRender.substring(0, Math.floor(textToRender.length * ((frameForSection - 700) / 400)));
            } else {
              if (frameForSection < 1200) {
                textToRender = "10% is a game of the hidden";
              } else {
                textToRender = "10% is a game of the hidden";
                textToRender = textToRender.substring(0, Math.floor(textToRender.length * ((30 - (frameForSection - 1200)) / 30)));
              }
            }
          }
        }
      }
    }
    ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
  }
}
function renderRotatedText(text, x, y, angle, lineHeight) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.textAlign = "center";
  ctx.fillText(text, 0, lineHeight / 2);
  ctx.restore();
}
function getNewRandomisedScoreAndPercentLevelSuccessSpacer() {
  var tempSpacer = getBlankLevelSuccessSpacerTemplate();
  tempSpacer.map.data.render.spacer.areaAsPercent = Math.floor(seededRandom() * 9) + 1;
  tempSpacer.map.data.render.spacer.areaAsPercent.score = seededRandom() * 8000 + 800;
}
function setUpSuicideChamber() {
  suicideChamber.particles = [];
  zoom = 2;
  cameraOffsetX = 0;
  cameraOffsetY = 0;
  updateCamera();
  suicideChamber.map = {points:[{x:-100, y:-100}, {x:100, y:-100}, {x:100, y:100}, {x:-100, y:100}], data:{render:{spacer:{isSpacer:false}}}};
  suicideChamber.cells = [];
  suicideChamber.startDespawnDelayLeft = -1;
  suicideChamber.batchesLeftToSpawnAndDestroy = 3;
}
function renderSuicideChamber(frameForSection) {
  var i;
  var suicideMapSize = 100;
  if (!suicideChamber.initalised) {
    setUpSuicideChamber();
    suicideChamber.initalised = true;
  }
  var totalFramesPerBatch = 100 + 1 + 250 + 1 + 100;
  if (frameForSection < totalFramesPerBatch * suicideChamber.batchesLeftToSpawnAndDestroy) {
    frameForSection %= totalFramesPerBatch;
    if (frameForSection < 100) {
      renderBackground();
      suicideChamberRenderMap();
    } else {
      frameForSection -= 100;
      if (frameForSection < 1) {
        renderBackground();
        var suicideChamberCell;
        for (i = 50 + Math.floor(seededRandom() * 30); i > 0; i--) {
          suicideChamberCell = {};
          suicideChamberCell.x = (seededRandom() - 0.5) * suicideMapSize / 4;
          suicideChamberCell.y = (seededRandom() - 0.5) * suicideMapSize / 4;
          suicideChamberCell.direction = seededRandom() * Math.PI * 2;
          suicideChamberCell.speed = (seededRandom() + 4) * 0.2;
          suicideChamberCell.delayLeft = (1000 + seededRandom() * 600 + (seededRandom() < 0.2) * seededRandom() * 7000) / (1000 / 60);
          suicideChamber.cells.push(suicideChamberCell);
        }
        suicideChamber.startDespawnDelayLeft = 90;
        suicideChamberRenderMap();
      } else {
        frameForSection -= 1;
        if (frameForSection < 300) {
          renderBackground();
          suicideChamberRenderMap();
          suicideChamberPhysicsAndRenderCells(1);
        } else {
          frameForSection -= 300;
          if (frameForSection < 1) {
            suicideChamber.cells = [];
            renderBackground();
            suicideChamberRenderMap();
          } else {
            frameForSection -= 1;
            if (frameForSection < 100) {
              renderBackground();
              suicideChamberRenderMap();
            } else {
              cl(frameForSection);
              suicideChamber.batchesLeftToSpawnAndDestroy -= 1;
            }
          }
        }
      }
    }
  } else {
    console.warn("should have moved to next scene...");
  }
}
function suicideChamberPhysicsAndRenderCells(size) {
  var i;
  var projectedSize = size * zoom / 2;
  suicideChamber.startDespawnDelayLeft -= 1;
  var suicideChamberCell;
  for (i = suicideChamber.cells.length - 1; i > -1; i--) {
    suicideChamberCell = suicideChamber.cells[i];
    suicideChamberCell.delayLeft -= 1;
    if (suicideChamberCell.delayLeft < 0) {
      suicideChamberCell.x += Math.sin(suicideChamberCell.direction) * suicideChamberCell.speed;
      suicideChamberCell.y += Math.cos(suicideChamberCell.direction) * suicideChamberCell.speed;
    }
    if (!checkIfUnprojectedPointIsInsideTempMap(suicideChamberCell, suicideChamber.map)) {
      suicideChamber.cells.splice(i, 1);
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (suicideChamber.startDespawnDelayLeft < 0 && seededRandom() < 0.03) {
      suicideChamber.cells.splice(i, 1);
    }
  }
  for (i = 0; i < suicideChamber.cells.length; i++) {
    suicideChamberCell = suicideChamber.cells[i];
    ctx.beginPath();
    ctx.fillStyle = "#F00";
    ctx.arc((cameraX - suicideChamberCell.x) * zoom, (cameraY - suicideChamberCell.y) * zoom, projectedSize, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
function suicideChamberRenderMap() {
  ctx.beginPath();
  var offset = {x:0, y:0};
  var i;
  ctx.moveTo((cameraX - (suicideChamber.map.points[0].x + offset.x)) * zoom, (cameraY - (suicideChamber.map.points[0].y + offset.y)) * zoom);
  for (i = 1; i < suicideChamber.map.points.length; i++) {
    ctx.lineTo((cameraX - (suicideChamber.map.points[i].x + offset.x)) * zoom, (cameraY - (suicideChamber.map.points[i].y + offset.y)) * zoom);
  }
  ctx.lineTo((cameraX - (suicideChamber.map.points[0].x + offset.x)) * zoom, (cameraY - (suicideChamber.map.points[0].y + offset.y)) * zoom);
  ctx.lineWidth = 1 * zoom;
  ctx.strokeStyle = "#ff3d3d";
  ctx.stroke();
}
function renderSceneAfterSuicideChamber(frameForSection) {
  renderBackground();
  if (true) {
    var fontSize = canvas.width / 5;
    ctx.font = Math.floor(fontSize) + "px Special Elite";
    textToRender = "or what you see may only be 10%";
    var textWidth = ctx.measureText(textToRender).width;
    if (textWidth > canvas.width * 0.4) {
      fontSize *= canvas.width * 0.4 / textWidth;
      ctx.font = Math.floor(fontSize) + "px Special Elite";
    }
    var textToRender;
    ctx.fillStyle = "hsla(0, 100%, 100%, 1)";
    if (frameForSection < 200) {
      if (frameForSection < 10) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      frameForSection -= 200;
      if (frameForSection < 200) {
        textToRender = "LETHAL";
        ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
      } else {
        if (frameForSection < 400) {
        } else {
          if (frameForSection < 500) {
            textToRender = "10%";
            ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
          } else {
            if (frameForSection < 600) {
            } else {
              frameForSection -= 600;
              if (frameForSection < 500) {
                textToRender = "do you want to keep playing?";
                textToRender = "" + textToRender.substring(0, Math.floor(textToRender.length * (frameForSection / 500)));
                ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
              } else {
                frameForSection -= 500;
                if (frameForSection < 180) {
                  textToRender = "do you want to keep playing?";
                  ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
                } else {
                  frameForSection -= 180;
                  if (frameForSection < 180) {
                    textToRender = "keep playing.";
                    ctx.fillText(textToRender, canvas.width / 2 - ctx.measureText(textToRender).width / 2, canvas.height * 0.4);
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
;