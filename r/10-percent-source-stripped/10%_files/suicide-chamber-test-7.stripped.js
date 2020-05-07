var suicideChamber3DExportVars;
function suicideChamber3DLoader() {
  suicideChamber3DExportVars = {};
  var gameArea = {keys:[]};
  var frame = 0;
  var cl = console.log;
  window.addEventListener("keydown", function(e) {
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });
  window.addEventListener("keyup", function(e) {
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });
  function rotatePoint(origin, point, angle) {
    var cos = Math.cos(angle), sin = Math.sin(angle), dX = point.x - origin.x, dY = point.y - origin.y;
    return {x:cos * dX - sin * dY + origin.x, y:sin * dX + cos * dY + origin.y};
  }
  var rotObjectMatrix;
  function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4;
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotObjectMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
  }
  var rotWorldMatrix;
  function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4;
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }
  var playerV;
  var render = function() {
    frame += 1;
    if (!suicideChamber3DExportVars.stopRenderLoop) {
      requestAnimationFrame(render);
    }
    if (gameArea.keys[65]) {
      camera.rotation.y += Math.PI * 0.01;
    }
    if (gameArea.keys[68]) {
      camera.rotation.y += -Math.PI * 0.01;
    }
    if (gameArea.keys[87]) {
      playerV.x += -Math.sin(camera.rotation.y) * 0.03;
      playerV.z += -Math.cos(camera.rotation.y) * 0.03;
    }
    if (gameArea.keys[83]) {
      playerV.x += Math.sin(camera.rotation.y) * 0.03;
      playerV.z += Math.cos(camera.rotation.y) * 0.03;
    }
    playerV.x *= 0.98;
    playerV.z *= 0.98;
    camera.position.x += playerV.x;
    camera.position.z += playerV.z;
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;
    if (document.getElementById("suicideChamberCanvas") && (Math.abs(camera.position.x) > wallsSize / 2 || Math.abs(camera.position.z) > wallsSize / 2)) {
      cl("3d story stage complete");
      console.warn("add code to move back to normal game play");
      goBackToNormalGame();
    } else {
      renderer.render(scene, camera);
      if (document.getElementById("suicideChamberCanvas") && getIfShouldChangeSceneFromSuicidChamberToPlayerInMap()) {
        change3DSceneToPlayerInMap();
      }
    }
  };
  var scene = new THREE.Scene;
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.className = "threeJsCanvas";
  renderer.domElement.id = "suicideChamberCanvas";
  THREEx.WindowResize(renderer, camera);
  var textCanvas = document.createElement("canvas");
  textCanvas.width = 2048;
  textCanvas.height = 512;
  var textCtx = textCanvas.getContext("2d");
  textCtx.fillStyle = "white";
  textCtx.font = "bold 225px Special Elite";
  textCtx.textBaseline = "top";
  textCtx.fillText("DANGER: LETHAL", 0, 0);
  textCtx.font = "bold 100px Special Elite";
  var textToRender = "[WASD]";
  textCtx.fillText(textToRender, textCanvas.width / 2 - textCtx.measureText(textToRender).width / 2, 225);
  var light;
  var wallsSize = 400;
  light = new THREE.PointLight(16711680, 2, 80);
  light.position.set(15, 15, 5);
  scene.add(light);
  var geometry = new THREE.BoxGeometry(wallsSize - 1, 100, 1);
  var material = new THREE.MeshPhongMaterial({color:16711680, opacity:0.5, transparent:true});
  var wall0 = new THREE.Mesh(geometry, material);
  wall0.position.set(0, 0, -wallsSize / 2);
  scene.add(wall0);
  var wall1 = new THREE.Mesh(geometry, material);
  wall1.position.set(0, 0, wallsSize / 2);
  scene.add(wall1);
  var wall2 = new THREE.Mesh(geometry, material);
  wall2.position.set(-wallsSize / 2, 0, 0);
  wall2.rotation.y = Math.PI / 2;
  scene.add(wall2);
  var wall3 = new THREE.Mesh(geometry, material);
  wall3.position.set(wallsSize / 2, 0, 0);
  wall3.rotation.y = Math.PI / 2;
  scene.add(wall3);
  var texture = new THREE.Texture(textCanvas);
  texture.needsUpdate = true;
  var material = new THREE.MeshBasicMaterial({map:texture, transparent:true});
  geometry = new THREE.PlaneGeometry(10, 10 / 4, 32);
  var textObj0 = new THREE.Mesh(geometry, material);
  textObj0.position.set(0, 0, -30);
  scene.add(textObj0);
  var textObj1 = new THREE.Mesh(geometry, material);
  textObj1.position.set(0, 0, 30);
  textObj1.rotation.y = Math.PI;
  scene.add(textObj1);
  var textObj2 = new THREE.Mesh(geometry, material);
  textObj2.position.set(-30, 0, 0);
  textObj2.rotation.y = Math.PI / 2;
  scene.add(textObj2);
  var textObj3 = new THREE.Mesh(geometry, material);
  textObj3.position.set(30, 0, 0);
  textObj3.rotation.y = -Math.PI / 2;
  scene.add(textObj3);
  function reset() {
    cl("reseting chamber3D");
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    playerV = {x:0, z:0};
  }
  function addCanvasToDOM() {
    document.body.appendChild(renderer.domElement);
  }
  suicideChamber3DExportVars.addCanvasToDOM = addCanvasToDOM;
  suicideChamber3DExportVars.reset = reset;
  suicideChamber3DExportVars.render = render;
  suicideChamber3DExportVars.stopRenderLoop = false;
}
;