var MIN_GUESS = 1;
var MAX_GUESS = 100;

var context = c;
var width = a.width;
var height = a.height;

var marvin = new Marvin();
var background;

var min = MIN_GUESS;
var max = MAX_GUESS;
var guessesCount = Math.ceil(Math.log2(max - min)) + 1;
var guess;
var isHigher;
var isGuessCorrect;

a.style.background = 'black';

function Marvin() {
    this.x = width / 2;
    this.y = 300;
    this.headRadius = 75;

    this.leftEye = new Eye(this, 5, 15, -25, -20);
    this.rightEye = new Eye(this, 5, 15, 25, -20);
    this.hat = new Hat(this, -69, 139);

    this.skinGradient = context.createRadialGradient(this.x, this.y, 75, this.x, this.y, 60);
    this.skinGradient.addColorStop(0, '#eac086');
    this.skinGradient.addColorStop(1, '#ffe0bd');
}

Marvin.prototype.render = function render() {
    context.fillStyle = this.skinGradient;
    context.beginPath();
    context.ellipse(this.x, this.y, this.headRadius, this.headRadius, 0, 0, Math.PI * 2);
    context.fill();

    this.hat.render();
    this.leftEye.render();
    this.rightEye.render();
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

function Hat(parent, xOffset, height) {
    this.parent = parent;
    this.xOffset = xOffset;
    this.baseWidth = this.parent.headRadius - this.xOffset;
    this.height = height;

    this.gradient = context.createLinearGradient(
        this.parent.x,
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
    context.moveTo(this.parent.x + this.xOffset, baseY);
    context.lineTo(this.parent.x + this.xOffset + this.baseWidth / 2, baseY - this.height);
    context.lineTo(this.parent.x + this.xOffset + this.baseWidth, baseY);
    context.lineTo(this.parent.x + this.xOffset, baseY);
    context.fill();
};

Hat.prototype.getBaseY = function getBaseY() {
    return this.parent.y - this.parent.headRadius / 2;
};

function Background(x, y) {
    this.x = x;
    this.y = y;
    this.fill = 'rgba(' + [
        Background.getRandomByte(),
        Background.getRandomByte(),
        Background.getRandomByte(),
    ].join(',') + ',0.5)';
}

Background.RADIUS = 25;
Background.PADDING = 10;

Background.getRandomByte = function getRandomByte() {
    return Math.ceil(Math.random() * 255);
};

Background.createElements = function createElements() {
    var elements = [];

    for (var x = 0; x < width; x += Background.RADIUS + Background.PADDING) {
        for (var y = 0; y < width; y += Background.RADIUS + Background.PADDING) {
            elements.push(new Background(x, y));
        }
    }

    return elements;
};

Background.create = function render() {
    var elements = Background.createElements();

    for (var i = 0; i < elements.length; i++) {
        elements[i].render();
    }

    return context.getImageData(0, 0, width, height);
};

Background.prototype.render = function render() {
    context.fillStyle = this.fill;
    context.fillRect(this.x, this.y, Background.RADIUS, Background.RADIUS);
};

background = Background.create();

requestAnimationFrame(function loop() {
    context.clearRect(0, 0, width, height);
    context.putImageData(background, 0, 0);

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
