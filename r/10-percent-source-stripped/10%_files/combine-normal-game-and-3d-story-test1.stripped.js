function hideNormalGame() {
  clearInterval(gameArea.interval);
  document.body.removeChild(gameArea.canvas);
}
function showNormalGame() {
  document.body.appendChild(gameArea.canvas);
  gameArea.start();
}
function unloadAllThreeStuff() {
  if (aiControlledGameExportVars && !aiControlledGameExportVars.hasBeenUnloaded) {
    aiControlledGameExportVars.unload();
  }
  var element;
  element = document.getElementById("playerInMapCanvas");
  if (element) {
    document.body.removeChild(element);
  }
  element = document.getElementById("suicideChamberCanvas");
  if (element) {
    document.body.removeChild(element);
  }
  suicideChamber3DExportVars.stopRenderLoop = true;
  playerInMap3DExportVars.stopRenderLoop = true;
}
function goBackToNormalGame() {
  unloadAllThreeStuff();
  var i;
  for (i = 0; i < storyData.length; i++) {
    if (storyData[i].stageID === "suicideChamberAndPlayerInMap3D") {
      storyData[i].totalFrames = 200 + 600 + 500 + 180 + 180;
      storyData[i].curFrame = 0;
      storyData[i].stageID = "sceneAfterSuicideChamber";
    }
  }
  showNormalGame();
}
;