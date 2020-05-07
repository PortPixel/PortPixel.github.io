var aiControlledGameInitalised = false;
function showResetPlayerInMap() {
  if (aiControlledGameInitalised && !aiControlledGameExportVars.hasBeenUnloaded) {
    aiControlledGameExportVars.unload();
  }
  aiControlledGameLoader();
  aiControlledGameExportVars.startGame();
  if (!aiControlledGameInitalised) {
    playerInMap3DLoader();
    playerInMap3DExportVars.render();
    aiControlledGameInitalised = true;
  } else {
    playerInMap3DExportVars.addCanvasToDOM();
  }
  aiControlledGameExportVars.canvas.style.display = "none";
}
var suicideChamberInitalised = false;
function showResetSuicideChamber() {
  if (!suicideChamberInitalised) {
    suicideChamber3DLoader();
    suicideChamber3DExportVars.reset();
    suicideChamber3DExportVars.render();
    suicideChamberInitalised = true;
  } else {
    suicideChamber3DExportVars.reset();
    suicideChamber3DExportVars.addCanvasToDOM();
  }
}
function hidePlayerInMapDOMElements() {
  aiControlledGameExportVars.unload();
  document.body.removeChild(document.getElementById("playerInMapCanvas"));
}
function hideSuicideChamberDOMElements() {
  document.body.removeChild(document.getElementById("suicideChamberCanvas"));
}
function change3DSceneToPlayerInMap() {
  if (document.getElementById("suicideChamberCanvas")) {
    hideSuicideChamberDOMElements();
  }
  showResetPlayerInMap();
}
function change3DSceneToSuicideChamber() {
  if (document.getElementById("playerInMapCanvas")) {
    hidePlayerInMapDOMElements();
  }
  showResetSuicideChamber();
}
function changeSceneToCellDeadAndMovingCameraUpToOveriewOfMap() {
  aiControlledGameExportVars.unload();
  playerInMap3DExportVars.ignoreCellAsDeadAndAnimateMovingCameraToOveriew = true;
  var aniInternals = playerInMap3DExportVars.movingCameraToOverviewInternals;
  aniInternals.framesTotal = 240, aniInternals.framesLeft = aniInternals.framesTotal - 1;
  aniInternals.overviewPosition.x = 0;
  aniInternals.overviewPosition.y = 250;
  aniInternals.overviewPosition.z = 0;
  aniInternals.targetQuaterion = new THREE.Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2);
}
var framesSinceLastSwitchToPlayerInMap = 0;
var numTimesHaveSwitchedToPlayerInMap = 0;
function getIfShouldChangeSceneFromSuicidChamberToPlayerInMap() {
  var shouldSwitch = false;
  framesSinceLastSwitchToPlayerInMap += 1;
  if (numTimesHaveSwitchedToPlayerInMap === 0) {
    if (framesSinceLastSwitchToPlayerInMap > 120) {
      shouldSwitch = true;
    }
  } else {
    if (numTimesHaveSwitchedToPlayerInMap === 1) {
      if (framesSinceLastSwitchToPlayerInMap > 140) {
        shouldSwitch = true;
      }
    } else {
      cl("a");
      if (Math.random() < 0.0015) {
        shouldSwitch = true;
      }
    }
  }
  if (shouldSwitch) {
    framesSinceLastSwitchToPlayerInMap = 0;
    numTimesHaveSwitchedToPlayerInMap += 1;
  }
  return shouldSwitch;
}
;