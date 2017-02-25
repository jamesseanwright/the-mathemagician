'use strict';

var MIN_GUESS = 1;
var MAX_GUESS = 100;

var audioContext = new AudioContext();
var context = c;
var width = a.width;
var height = a.height;

var marvin = new Marvin(width / 2, 200);
var background;
var music;

var min = MIN_GUESS;
var max = MAX_GUESS;
var guessesCount = Math.ceil(Math.log2(max - min)) + 1;
var guess;
var isHigher;
var isGuessCorrect;

a.style.background = 'black';

function BounceAnimation(entity, startY, endY, speed) {
    this.entity = entity;
    this.startY = startY;
    this.endY = endY;
    this.speed = speed;
    this.direction = 1;
}

BounceAnimation.UP = -1;
BounceAnimation.DOWN = 1;

BounceAnimation.prototype.updateDirection = function updateDirection() {
    if (Math.ceil(this.entity.y) + this.entity.headRadius > this.endY && this.direction === BounceAnimation.DOWN) {
        this.direction = BounceAnimation.UP;
    }

    if (Math.floor(this.entity.y) <= this.startY && this.direction === BounceAnimation.UP) {
        this.direction = BounceAnimation.DOWN;
    }
};

BounceAnimation.prototype.update = function update() {
    var progress;

    this.updateDirection();
    progress = this.startY / (this.entity.y || 1);
    this.entity.y += (this.speed * this.direction) * Math.sin(Math.PI * progress);
};

function Marvin(x, y) {
    this.x = x
    this.y = y;
    this.headRadius = 45;

    this.leftEye = new Eye(this, 5, 15, -25, 0);
    this.rightEye = new Eye(this, 5, 15, 25, 0);
    this.hat = new Hat(this, 70);
    this.bounceAnimation = new BounceAnimation(this, height / 4, height / 2, 3, BounceAnimation.DOWN);
}

Marvin.prototype.render = function render() {
    context.fillStyle = this.createSkinGradient();
    context.beginPath();
    context.ellipse(this.x, this.y, this.headRadius, this.headRadius, 0, 0, Math.PI * 2);
    context.fill();

    this.bounceAnimation.update();
    this.hat.render();
    this.leftEye.render();
    this.rightEye.render();
};

Marvin.prototype.createSkinGradient = function createSkinGradient() {
    var gradient = context.createRadialGradient(this.x, this.y, this.headRadius, this.x, this.y, this.headRadius - 15);

    gradient.addColorStop(0, '#ffad60');
    gradient.addColorStop(1, '#ffe0bd');

    return gradient;
};

function Eye(parent, width, height, xOffset, yOffset) {
    this.parent = parent;
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
}

Eye.prototype.render = function render() {
    context.fillStyle = '#000';
    context.beginPath();
    context.ellipse(this.parent.x - this.xOffset, this.parent.y + this.yOffset, this.width, this.height, 0, 0, Math.PI * 2);
    context.fill();
};

function Hat(parent, height) {
    this.parent = parent;
    this.x = parent.x - this.parent.headRadius;
    this.baseWidth = this.parent.headRadius * 2;
    this.height = height;

    this.gradient = context.createLinearGradient(
        this.x,
        this.getBaseY() - this.height,
        this.baseWidth,
        this.height
    );

    this.gradient.addColorStop(0, '#60AFFE');
    this.gradient.addColorStop(0.5, '#104E8B');
}

Hat.prototype.render = function render() {
    var baseY = this.getBaseY();

    context.fillStyle = this.gradient;
    context.beginPath();
    context.moveTo(this.x, baseY);
    context.lineTo(this.x + this.baseWidth / 2, baseY - this.height);
    context.lineTo(this.x + this.baseWidth, baseY);
    context.lineTo(this.x, baseY);
    context.fill();
};

Hat.prototype.getBaseY = function getBaseY() {
    return this.parent.y - this.parent.headRadius / 2;
};

function BackgroundElement(x, y) {
    this.x = x;
    this.y = y;
    this.fill = 'rgba(' + [
        BackgroundElement.getRandomByte(),
        BackgroundElement.getRandomByte(),
        BackgroundElement.getRandomByte(),
    ].join(',') + ',0.5)';
}

BackgroundElement.SIZE = 25;
BackgroundElement.PADDING = 10;

BackgroundElement.getRandomByte = function getRandomByte() {
    return Math.ceil(Math.random() * 255);
};

BackgroundElement.prototype.render = function render() {
    context.fillStyle = this.fill;
    context.fillRect(this.x, this.y, BackgroundElement.SIZE, BackgroundElement.SIZE);
};

background = {
    SPEED: 0.5,
    repetitions: [0, width],
    imageData: null
};

background.createElements = function createElements() {
    var elements = [];
    var totalElementSize = BackgroundElement.SIZE + BackgroundElement.PADDING;

    for (var x = 0; x + totalElementSize < width; x += totalElementSize) {
        for (var y = 0; y < height; y += totalElementSize) {
            elements.push(new BackgroundElement(x, y));
        }
    }

    return elements;
};

background.create = function create() {
    var elements = background.createElements();

    for (var i = 0; i < elements.length; i++) {
        elements[i].render();
    }

    this.imageData = context.getImageData(0, 0, width, height);
};

background.update = function update() {
    for (var i = 0; i < background.repetitions.length; i++) {
        background.repetitions[i] -= background.SPEED;

        if (background.repetitions[i] + width < 0) {
            background.repetitions[i] = width;
        }

        context.putImageData(background.imageData, background.repetitions[i], 0);
    }
};

background.create();

music = {
    snareBuffer: null,

    kickSequence: [
        0,
        2,
        4,
        6
    ],

    snareSequence: [
        1,
        3,
        5,
        7
    ],

    bassSequence: [
        [65.41, 0],
        [73.42, 0.5],
        [77.78, 1],
        [87.31, 1.5],
        [98.00, 2],
        [103.83, 2.5],
        [98.00, 3],
        [87.31, 3.5],
        [77.7, 4],
        [73.42, 4.5],
        [65.41, 5],
        [65.41, 5.5],
        [65.41, 6],
        [65.41, 6.5],
        [65.41, 7],
        [65.41, 7.5]
    ],

    getSnareBuffer: function getSnareBuffer() {
        if (this.snareBuffer) {
            return this.snareBuffer;
        }

        var buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
	    var output = buffer.getChannelData(0);

        for (var i = 0; i < audioContext.sampleRate; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.snareBuffer = buffer;

        return this.snareBuffer;
    },

    kick: function kick(startTime) {
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
    },

    snare: function snare(startTime) {
		var time = audioContext.currentTime + startTime;
        var endTime = time + 0.03;
        var source  = audioContext.createBufferSource();
		var gainNode = audioContext.createGain();
        var noiseFilter = audioContext.createBiquadFilter();

        source.buffer = this.getSnareBuffer();

        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        gainNode.gain.value = 0.2;

        source.connect(noiseFilter);
        noiseFilter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(time);
        source.stop(endTime);
    },

    bass: function bass(sequenceItem) {
        var frequency = sequenceItem[0];
        var startTime = sequenceItem[1];
		var time = audioContext.currentTime + startTime;
        var endTime = time + 0.5;
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();

		oscillator.type = 'triangle';
		oscillator.frequency.value = frequency;
		gainNode.gain.setValueAtTime(0.5, time);
		gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);
		oscillator.start(time);
        oscillator.stop(endTime);
	},

    play: function play() {
        this.kickSequence.forEach(this.kick.bind(this));
        this.snareSequence.forEach(this.snare.bind(this));
        this.bassSequence.forEach(this.bass.bind(this));

        setTimeout(this.play.bind(this), 8000);
    }
};

music.play();

requestAnimationFrame(function loop() {
    context.clearRect(0, 0, width, height);
    background.update();

    marvin.render();
    requestAnimationFrame(loop);
});

function foo() {
    while (guessesCount && min !== max) {
        guess = Math.round(min + Math.random() * (max - min));
        isHigher = Math.round(Math.random());
        isGuessCorrect = confirm('Is your number ' + (isHigher ? 'higher' : 'lower') + ' than ' + guess + '?');
        updateRange();
        guessesCount--;
    }

    function updateRange() {
        if (isGuessCorrect) {
            min = isHigher ? guess + 1 : min;
            max = !isHigher ? guess - 1 : max;
        } else {
            min = !isHigher ? guess : min;
            max = isHigher ? guess : max;
        }
    }
}
