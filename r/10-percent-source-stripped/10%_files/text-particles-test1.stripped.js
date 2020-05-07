function loadTextParticles(particlesData, scale, translate) {
  var i;
  var circleData;
  var color;
  for (i = 0; i < particlesData.length; i++) {
    circleData = particlesData[i];
    if (circleData.color[0] === 255) {
      color = "#fff";
      createNewTextParticle(-circleData.data[0] * scale - translate.x, -circleData.data[1] * scale - translate.y, circleData.data[2] * scale * 2, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, 0.95, 0.97, color);
    } else {
    }
  }
}
function createNewTextParticle(x, y, size, xv, yv, vDecayRate, sizeDecayRate, color) {
  var createParticleTemp = {x:x, y:y, startPos:{x:x, y:y}, size:size, xv:xv, yv:yv, vDecayRate:vDecayRate, sizeDecayRate:sizeDecayRate, color:color, offset:getMapStackOffsetCurLevel(), stoppedOnOldMapWall:false, offsetShiftLastFrame:{x:undefined, y:undefined, lastRenderFrameUpdated:undefined}};
  textParticles.push(createParticleTemp);
}
;