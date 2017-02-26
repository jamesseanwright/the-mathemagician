var audioContext = new AudioContext();
var width = a.width;
var height = a.height;

var mathMagicianX = width / 2;
var mathMagicianY = 200;
var mathMagicianHeadRadius = 45;
var bounceDirection = 1;

var leftOperand = Math.round(Math.random() * 50000);
var rightOperand = Math.round(Math.random() * 50000);
var result = leftOperand * rightOperand;
var lastMultiplicationGenTime = null;

var backgroundElements = [];
var backgroundReps = [0, width];

// create background elements
for (var x = 0; x + 35 < width; x += 35) {
    for (var y = 0; y < height; y += 35) {
        backgroundElements.push({
            x: x,
            y: y,
            number: Math.round(Math.random() * 9),

            fill: 'rgba(' + [
                Math.ceil(Math.random() * 255),
                Math.ceil(Math.random() * 255),
                Math.ceil(Math.random() * 255),
            ].join(',') + ',0.5)'
        });
    }
}

// render background
for (var i = 0; i < backgroundElements.length; i++) {
    c.fillStyle = backgroundElements[i].fill;
    c.font = '25px monospace';

    c.fillText(
        backgroundElements[i].number,
        backgroundElements[i].x,
        backgroundElements[i].y,
        25
    );
}

backgroundImageData = c.getImageData(0, 0, width, height);
a.style.background = 'black';

var snareBuffer = null;

var kickSequence = [
    0,
    2,
    4,
    6
];

var snareSequence = [
    1,
    3,
    5,
    7
];

var snareBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
var snareBufferOutput = snareBuffer.getChannelData(0);

for (var i = 0; i < audioContext.sampleRate; i++) {
    snareBufferOutput[i] = Math.random() * 2 - 1;
}

// enqueue, play, and loop freqs
(function audioLoop() {
    kickSequence.forEach(function (startTime) {
        var time = audioContext.currentTime + startTime;
        var endTime = time + 0.2;
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = 18;
        gainNode.gain.setValueAtTime(7, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(time);
        oscillator.stop(endTime);
    });

    snareSequence.forEach(function (startTime) {
        var time = audioContext.currentTime + startTime;
        var endTime = time + 0.03;
        var source = audioContext.createBufferSource();
        var gainNode = audioContext.createGain();

        source.buffer = snareBuffer;

        gainNode.gain.value = 0.2;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(time);
        source.stop(endTime);
    });

    setTimeout(audioLoop, 8000);
}());

requestAnimationFrame(function loop(time) {
    c.clearRect(0, 0, width, height);

    // background animation
    for (var i = 0; i < 2; i++) {
        backgroundReps[i] -= 0.5;

        if (backgroundReps[i] + width < 0) {
            backgroundReps[i] = width;
        }

        c.putImageData(backgroundImageData, backgroundReps[i], 0);
    }

    // Mathmagician render
    // bounce animation
    if (Math.ceil(mathMagicianY) + mathMagicianHeadRadius > 350 && bounceDirection === 1) {
        bounceDirection = -1;
    }

    if (Math.floor(mathMagicianY) <= 150 && bounceDirection === -1) {
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
    var rotation = Math.PI * 0.5 - progress;
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