var mathMagicianX = 512;
var mathMagicianY = 200;
var bounceDirection = 1;

var lastMultiplicationGenTime = null;

var bgX = 0;

// create background
c.fillStyle = '#000';
c.fillRect(0, 0, 1024, 720);

for (var x = 0; x + 35 < 1024; x += 35) {
    for (var y = 0; y < 720; y += 35) {
        c.fillStyle = 'rgba(' + [
            Math.random() * 255 | 0,
            Math.random() * 255 | 0,
            Math.random() * 255 | 0,
        ].join(',') + ',0.5)'

        c.font = '25px monospace';
        c.fillText(Math.random() * 9 | 0, x, y, 25);
    }
}

bgImageData = c.getImageData(0, 0, 1024, 720);

with (new AudioContext()) {
    var snareBuffer = createBuffer(1, sampleRate, sampleRate);

    for (var i = 0; i < sampleRate; i++) {
        snareBuffer.getChannelData(0)[i] = Math.random() * 2 - 1;
    }

    // enqueue, play, and loop freqs
    (function audioLoop() {
        var time = currentTime;
        var endTime = time + 0.2;
        var oscillator = createOscillator();
        var kickGain = createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = 18;
        kickGain.gain.setValueAtTime(7, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.connect(kickGain);
        kickGain.connect(destination);
        oscillator.start(time);
        oscillator.stop(endTime);

        time += 1;
        endTime = time + 0.03;
        var snareSource = createBufferSource();
        var snareGain = createGain();

        snareSource.buffer = snareBuffer;

        snareGain.gain.value = 0.2;

        snareSource.connect(snareGain);
        snareGain.connect(destination);

        snareSource.start(time);
        snareSource.stop(endTime);

        setTimeout(audioLoop, 2000);
    }());
}

requestAnimationFrame(function loop(time) {
    // bg animation
    bgX -= 0.5;
    c.putImageData(bgImageData, bgX, 0);
    c.putImageData(bgImageData, bgX + 1024, 0);

    if (bgX < -1024) {
        bgX = 0;
    }

    // Mathmagician render
    // bounce animation
    if (mathMagicianY + 45 > 350 && bounceDirection === 1) {
        bounceDirection = -1;
    }

    if (mathMagicianY < 150 && bounceDirection === -1) {
        bounceDirection = 1;
    }

    var progress = 150 / (mathMagicianY || 1);
    mathMagicianY += (3 * bounceDirection) * Math.sin(3.14 * progress);

    // head
    c.fillStyle = '#fff6e5';

    c.beginPath();
    c.ellipse(mathMagicianX, mathMagicianY, 45, 45, 0, 0, 6.2832);
    c.fill();

    // left eye
    c.fillStyle = '#000';
    c.beginPath();
    c.ellipse(mathMagicianX - 25, mathMagicianY, 5, 15, 0, 0, 6.2832);
    c.fill();

    // right eye
    c.beginPath();
    c.ellipse(mathMagicianX + 25, mathMagicianY, 5, 15, 0, 0, 6.2832);
    c.fill();

    // hat
    c.fillStyle = '#104E8B';

    c.beginPath();
    c.moveTo(mathMagicianX - 45, mathMagicianY - 45 / 2);
    c.lineTo(mathMagicianX, mathMagicianY - 45 - 70);
    c.lineTo(mathMagicianX + 45, mathMagicianY - 45 / 2);
    c.lineTo(mathMagicianX - 45, mathMagicianY - 45 / 2);
    c.fill();

    // End Mathmagician

    // multiplication render
    if (!lastMultiplicationGenTime || time - lastMultiplicationGenTime > 4000) {
        lastMultiplicationGenTime = time;
        leftOperand = Math.random() * 50000 | 0;
        rightOperand = Math.random() * 50000 | 0;
        result = leftOperand * rightOperand;
    }

    progress = (time - lastMultiplicationGenTime) / 4000;
    var rotation = 1.57 - progress * 2;
    var scale = 1 + progress * 2;
    var opacity = 1 - progress;

    c.rotate(rotation);
    c.scale(scale, scale);

    c.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
    c.font = 'bold 25px Arial';
    c.fillText(leftOperand + ' x ' + rightOperand + ' = ' + result, 150, 50);
    c['resetTransform'](); // It seems Closure Compiler isn't aware of this relatively new API

    requestAnimationFrame(loop);
});