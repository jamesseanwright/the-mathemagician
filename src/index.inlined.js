var audioContext = new AudioContext();

var mathMagicianX = a.width / 2;
var mathMagicianY = 200;
var mathMagicianHeadRadius = 45;
var bounceDirection = 1;

var leftOperand = Math.round(Math.random() * 50000);
var rightOperand = Math.round(Math.random() * 50000);
var result = leftOperand * rightOperand;
var lastMultiplicationGenTime = null;

var bgX = 0;

// create background elements
for (var x = 0; x + 35 < a.width; x += 35) {
    for (var y = 0; y < a.height; y += 35) {
        c.fillStyle = 'rgba(' + [
            Math.ceil(Math.random() * 255),
            Math.ceil(Math.random() * 255),
            Math.ceil(Math.random() * 255),
        ].join(',') + ',0.5)'

        c.font = '25px monospace';
        c.fillText(Math.round(Math.random() * 9), x, y, 25);
    }
}

bgImageData = c.getImageData(0, 0, a.width, a.height);
a.style.background = '#000';

var snareBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
var snareBufferOutput = snareBuffer.getChannelData(0);

for (var i = 0; i < audioContext.sampleRate; i++) {
    snareBufferOutput[i] = Math.random() * 2 - 1;
}

// enqueue, play, and loop freqs
(function audioLoop() {
    var time = audioContext.currentTime;
    var endTime = time + 0.2;
    var oscillator = audioContext.createOscillator();
    var kickGain = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = 18;
    kickGain.gain.setValueAtTime(7, time);
    kickGain.gain.exponentialRampToValueAtTime(0.001, endTime);

    oscillator.connect(kickGain);
    kickGain.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(endTime);

    time += 1;
    endTime = time + 0.03;
    var snareSource = audioContext.createBufferSource();
    var snareGain = audioContext.createGain();

    snareSource.buffer = snareBuffer;

    snareGain.gain.value = 0.2;

    snareSource.connect(snareGain);
    snareGain.connect(audioContext.destination);

    snareSource.start(time);
    snareSource.stop(endTime);

    setTimeout(audioLoop, 2000);
}());

requestAnimationFrame(function loop(time) {
    c.clearRect(0, 0, a.width, a.height);

    // bg animation
    bgX -= 0.5;
    c.putImageData(bgImageData, bgX, 0);
    c.putImageData(bgImageData, bgX + a.width, 0);

    if (bgX + a.width < 0) {
        bgX = 0;
    }

    // Mathmagician render
    // bounce animation
    if (mathMagicianY + mathMagicianHeadRadius > 350 && bounceDirection === 1) {
        bounceDirection = -1;
    }

    if (Math.round(mathMagicianY) <= 150 && bounceDirection === -1) {
        bounceDirection = 1;
    }

    var progress = 150 / (mathMagicianY || 1);
    mathMagicianY += (3 * bounceDirection) * Math.sin(Math.PI * progress);

    // head
    c.fillStyle = '#fff6e5';

    c.beginPath();
    c.ellipse(mathMagicianX, mathMagicianY, mathMagicianHeadRadius, mathMagicianHeadRadius, 0, 0, Math.PI * 2);
    c.fill();

    // left eye
    c.fillStyle = '#000';
    c.beginPath();
    c.ellipse(mathMagicianX - 25, mathMagicianY, 5, 15, 0, 0, Math.PI * 2);
    c.fill();

    // right eye
    c.beginPath();
    c.ellipse(mathMagicianX + 25, mathMagicianY, 5, 15, 0, 0, Math.PI * 2);
    c.fill();

    // hat
    c.fillStyle = '#104E8B';

    c.beginPath();
    c.moveTo(mathMagicianX - mathMagicianHeadRadius, mathMagicianY - mathMagicianHeadRadius / 2);
    c.lineTo(mathMagicianX, mathMagicianY - mathMagicianHeadRadius - 70);
    c.lineTo(mathMagicianX + mathMagicianHeadRadius, mathMagicianY - mathMagicianHeadRadius / 2);
    c.lineTo(mathMagicianX - mathMagicianHeadRadius, mathMagicianY - mathMagicianHeadRadius / 2);
    c.fill();

    // End Mathmagician

    // multiplication render
    if (!lastMultiplicationGenTime || time - lastMultiplicationGenTime > 4000) {
        lastMultiplicationGenTime = time;
        leftOperand = Math.round(Math.random() * 50000);
        rightOperand = Math.round(Math.random() * 50000);
        result = leftOperand * rightOperand;
    }

    progress = (time - lastMultiplicationGenTime) / 4000;
    var rotation = Math.PI * 0.5 - progress * 2;
    var scale = 1 + progress * 2;
    var opacity = 1 - progress;

    c.rotate(rotation);
    c.scale(scale, scale);

    c.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
    c.font = 'bold 26px Arial';
    c.fillText(leftOperand + ' x ' + rightOperand + ' = ' + result, 150, 50);
    c['resetTransform'](); // It seems Closure Compiler isn't aware of this relatively new API

    requestAnimationFrame(loop);
});