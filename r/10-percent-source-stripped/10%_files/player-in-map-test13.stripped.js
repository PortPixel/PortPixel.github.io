var playerInMap3DExportVars;
function playerInMap3DLoader() {
  playerInMap3DExportVars = {};
  playerInMap3DExportVars.ignoreCellAsDeadAndAnimateMovingCameraToOveriew = false;
  playerInMap3DExportVars.movingCameraToOverviewInternals = {framesTotal:undefined, framesLeft:undefined, overviewPosition:{x:undefined, y:undefined, z:undefined}, overviewRotateToLookAtPosition:{x:undefined, y:undefined, z:undefined}};
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
  var playerV = {x:0, z:0};
  function getSmoothAnimationCurveValueForPoint(fraction) {
    return 6.75 * (Math.pow(fraction * 2 / 3, 2) - Math.pow(fraction * 2 / 3, 3));
  }
  var render = function() {
    frame += 1;
    if (!playerInMap3DExportVars.stopRenderLoop) {
      requestAnimationFrame(render);
    }
    if (playerInMap3DExportVars.ignoreCellAsDeadAndAnimateMovingCameraToOveriew) {
      var aniInternals = playerInMap3DExportVars.movingCameraToOverviewInternals;
      if (aniInternals.framesLeft >= 0) {
        if (aniInternals.framesLeft + 1 === aniInternals.framesTotal) {
          aniInternals.startPos = camera.position;
        }
        var fractionComplete = getSmoothAnimationCurveValueForPoint(1 - aniInternals.framesLeft / aniInternals.framesTotal);
        camera.position.x = (aniInternals.overviewPosition.x - aniInternals.startPos.x) * fractionComplete + aniInternals.startPos.x;
        camera.position.y = (aniInternals.overviewPosition.y - aniInternals.startPos.y) * fractionComplete + aniInternals.startPos.y;
        camera.position.z = (aniInternals.overviewPosition.z - aniInternals.startPos.z) * fractionComplete + aniInternals.startPos.z;
        camera.quaternion.slerp(aniInternals.targetQuaterion, fractionComplete);
        aniInternals.framesLeft -= 1;
        if (aniInternals.framesLeft < aniInternals.framesTotal * 0.7) {
          aniInternals.framesLeft = -Infinity;
          aniInternals.part2RotateAwayFramesTotal = 180;
          aniInternals.part2RotateAwayFramesLeft = aniInternals.part2RotateAwayFramesTotal - 1;
          aniInternals.part2RotateAwayTargetQuaterion = new THREE.Quaternion(Math.SQRT1_2, 0, 0, Math.SQRT1_2);
        }
      } else {
        var fractionComplete = getSmoothAnimationCurveValueForPoint(1 - aniInternals.part2RotateAwayFramesLeft / aniInternals.part2RotateAwayFramesTotal);
        camera.quaternion.slerp(aniInternals.part2RotateAwayTargetQuaterion, fractionComplete);
        var fractionEndBeforeEnd = 0.3;
        aniInternals.part2RotateAwayFramesLeft -= 1;
        camera.position.y += -(aniInternals.part2RotateAwayFramesTotal - aniInternals.part2RotateAwayFramesLeft) * 0.5;
        if (aniInternals.part2RotateAwayFramesLeft < aniInternals.part2RotateAwayFramesTotal * fractionEndBeforeEnd) {
          if (document.getElementById("playerInMapCanvas")) {
            document.body.removeChild(document.getElementById("playerInMapCanvas"));
          }
          showResetSuicideChamber();
          playerInMap3DExportVars.ignoreCellAsDeadAndAnimateMovingCameraToOveriew = false;
        }
      }
    } else {
      mapObj.updateFromMapData(aiControlledGameExportVars.map);
      update3DCellObjsFromGameCellsData();
      var cell3DToViewFrom = cells3DObjs[0];
      camera.position.x = cell3DToViewFrom.sphereMesh.position.x;
      camera.position.y = cell3DToViewFrom.sphereMesh.position.y;
      camera.position.z = cell3DToViewFrom.sphereMesh.position.z;
      var targetDir = Math.atan2(-cell3DToViewFrom.xv, -cell3DToViewFrom.zv);
      camera.rotation.y += (targetDir - camera.rotation.y) / 10;
      camera.rotation.x = 0;
      camera.rotation.z = 0;
      if (aiControlledGameExportVars.currentlyMorphingMapAndCells) {
        var mapMorphFrame = aiControlledGameExportVars.ui.scrollingToNextDifferentLevel.animation.frame;
        playerInMap3DExportVars.hemiLight.intensity = 1 + Math.sin(Math.PI * 2 * mapMorphFrame / 60 / 2) * 10;
      }
    }
    var time = Date.now() * 0.005;
    var sizes = geometry.attributes.size.array;
    var positions = geometry.attributes.position.array;
    for (var i = 0; i < numParticles; i++) {
      if (!checkIfUnprojectedPointIsInsideTempMap({x:-positions[i * 3], y:-positions[i * 3 + 2]}, aiControlledGameExportVars.map)) {
        sizes[i] = 0;
      } else {
        sizes[i] = 0.5 * (1 + Math.sin(0.1 * i + time));
      }
    }
    geometry.attributes.size.needsUpdate = true;
    renderer.render(scene, camera);
  };
  var scene = new THREE.Scene;
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.className = "threeJsCanvas";
  renderer.domElement.id = "playerInMapCanvas";
  THREEx.WindowResize(renderer, camera);
  var hemiLight = new THREE.HemisphereLight(16777147, 526368, 1);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);
  var dirLight = new THREE.DirectionalLight(16777215, 1);
  dirLight.position.set(-1, 0.75, 1);
  dirLight.position.multiplyScalar(50);
  dirLight.name = "dirlight";
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 1024 * 2;
  var d = 300;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -1E-4;
  var particleSystem, uniforms, geometry;
  var numParticles = 1.5e4;
  uniforms = {pointTexture:{value:(new THREE.TextureLoader).load("data:image/png;base64,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")}};
  var shaderMaterial = new THREE.ShaderMaterial({uniforms:uniforms, vertexShader:document.getElementById("vertexshader").textContent, fragmentShader:document.getElementById("fragmentshader").textContent, blending:THREE.AdditiveBlending, depthTest:false, transparent:true, vertexColors:true});
  var radius = 200;
  geometry = new THREE.BufferGeometry;
  var positions = [];
  var colors = [];
  var sizes = [];
  var color = new THREE.Color;
  for (var i = 0; i < numParticles; i++) {
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    color.setHSL(i / numParticles, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
    sizes.push(1);
  }
  geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.addAttribute("size", (new THREE.Float32BufferAttribute(sizes, 1)).setDynamic());
  particleSystem = new THREE.Points(geometry, shaderMaterial);
  scene.add(particleSystem);
  camera.position.x = 0;
  camera.position.y = 200;
  camera.position.z = 0;
  camera.lookAt({x:0, y:0, z:0});
  var Map3D = function() {
    this.material = new THREE.MeshStandardMaterial({color:11974326, roughness:0.4, metalness:0.7});
    this.geometry = undefined;
    this.mesh = undefined;
    this.mapShape = undefined;
    this.prevUpdatedFromMapPoints = undefined;
  };
  Map3D.prototype.updateFromMapData = function(mapTemp) {
    var i;
    var mapPointsHaveChanged = false;
    if (!this.prevUpdatedFromMapPoints) {
      mapPointsHaveChanged = true;
    } else {
      if (this.prevUpdatedFromMapPoints.length !== mapTemp.points.length) {
        mapPointsHaveChanged = true;
      } else {
        for (i = 0; i < mapTemp.points.length; i++) {
          if (this.prevUpdatedFromMapPoints[i].x !== mapTemp.points[i].x || this.prevUpdatedFromMapPoints[i].y !== mapTemp.points[i].y) {
            mapPointsHaveChanged = true;
            break;
          }
        }
      }
    }
    if (mapPointsHaveChanged) {
      this.prevUpdatedFromMapPoints = mapTemp.points;
      if (this.geometry) {
        this.geometry.dispose();
      }
      if (this.wallsMesh) {
        scene.remove(this.wallsMesh);
        scene.remove(this.floorMesh);
      }
      this.mapShape = new THREE.Shape;
      this.mapShape.moveTo(-mapTemp.points[0].x, mapTemp.points[0].y);
      for (i = 1; i < mapTemp.points.length; i++) {
        this.mapShape.lineTo(-mapTemp.points[i].x, mapTemp.points[i].y);
      }
      this.mapShape.lineTo(-mapTemp.points[0].x, mapTemp.points[0].y);
      this.geometry = new THREE.ShapeGeometry(this.mapShape);
      var floorMesh = new THREE.Mesh(this.geometry, this.material);
      floorMesh.rotation.x = -Math.PI / 2;
      this.floorMesh = floorMesh;
      scene.add(this.floorMesh);
      var combinedGeometry = new THREE.Geometry;
      var material = new THREE.MeshStandardMaterial({color:11974326, roughness:0.4, metalness:0.7});
      var startPointIndex;
      var endPointIndex;
      for (i = 0; i < mapTemp.points.length; i++) {
        startPointIndex = i;
        if (i === 0) {
          endPointIndex = mapTemp.points.length - 1;
        } else {
          endPointIndex = i - 1;
        }
        var dx = -mapTemp.points[endPointIndex].x + mapTemp.points[startPointIndex].x;
        var dz = -1 * (mapTemp.points[endPointIndex].y - mapTemp.points[startPointIndex].y);
        var geomTemp = new THREE.BoxGeometry(getDistance(dx, dz), 10, 1);
        geomTemp.translate(getDistance(dx, dz) / 2, 10 / 2, 1 / 2);
        var meshTemp = new THREE.Mesh(geomTemp);
        meshTemp.position.set(0, 0, 0);
        meshTemp.rotation.set(0, 0, 0);
        meshTemp.position.x = -mapTemp.points[endPointIndex].x;
        meshTemp.position.z = -1 * mapTemp.points[endPointIndex].y;
        meshTemp.rotation.y = Math.atan2(dz, -dx);
        combinedGeometry.mergeMesh(meshTemp);
      }
      var combinedMesh = new THREE.Mesh(combinedGeometry, material);
      this.wallsMesh = combinedMesh;
      scene.add(this.wallsMesh);
    }
  };
  function getDistance(dx, dy) {
    return Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5);
  }
  var mapObj = new Map3D;
  var Cell3D = function() {
    this.light = new THREE.PointLight(16711680, 0.1, 50);
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshStandardMaterial({color:16711680, roughness:0.4, metalness:0.7});
    this.sphereMesh = new THREE.Mesh(geometry, material);
    this.light.position.y = 5;
    this.sphereMesh.position.y = 5;
    this.isInScene = false;
  };
  Cell3D.prototype.updateFromCellData = function(cellData) {
    this.sphereMesh.position.x = -cellData.x;
    this.sphereMesh.position.z = -cellData.y;
    this.light.position.x = -cellData.x;
    this.light.position.z = -cellData.y;
    this.xv = -cellData.xv;
    this.zv = -cellData.yv;
  };
  Cell3D.prototype.removeFromScene = function() {
    if (this.isInScene) {
      scene.remove(this.sphereMesh);
      scene.remove(this.light);
      this.isInScene = false;
    } else {
      console.warn("cell mesh not in scene already - is .removeFromScene() meant to be called?");
    }
  };
  Cell3D.prototype.addToScene = function() {
    if (!this.isInScene) {
      scene.add(this.sphereMesh);
      scene.add(this.light);
      this.isInScene = true;
    } else {
      console.warn("cell mesh in scene already - is .addToScene() meant to be called?");
    }
  };
  var cells3DObjs;
  function precreate3DCellObjs(num) {
    var i;
    cells3DObjs = [];
    for (i = 0; i < num; i++) {
      cells3DObjs.push(new Cell3D);
    }
  }
  precreate3DCellObjs(50);
  function update3DCellObjsFromGameCellsData() {
    var i;
    var cell3D;
    var cells = aiControlledGameExportVars.cells;
    for (i = 0; i < cells.length; i++) {
      cell3D = cells3DObjs[i];
      if (!cell3D.isInScene) {
        cell3D.addToScene();
      }
      cell3D.updateFromCellData(cells[i]);
    }
    for (; i < cells3DObjs.length; i++) {
      cell3D = cells3DObjs[i];
      if (cell3D.isInScene) {
        cell3D.removeFromScene();
      }
    }
  }
  function addCanvasToDOM() {
    document.body.appendChild(renderer.domElement);
  }
  playerInMap3DExportVars.render = render;
  playerInMap3DExportVars.canvas = renderer.domElement;
  playerInMap3DExportVars.addCanvasToDOM = addCanvasToDOM;
  playerInMap3DExportVars.stopRenderLoop = false;
  playerInMap3DExportVars.hemiLight = hemiLight;
}
;
