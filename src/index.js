var MIN_GUESS = 1;
var MAX_GUESS = 100;

var context = c;
var width = a.width;
var height = a.height;

var marvin = new Marvin();
var min = MIN_GUESS;
var max = MAX_GUESS;
var guessesCount = Math.ceil(Math.log2(max - min)) + 1;
var guess;
var isHigher;
var isGuessCorrect;

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

function Star(x, y) {
    this.x = x;
    this.y = y;
    this.fill = 'rgba(' + [
        Star.getRandomByte(),
        Star.getRandomByte(),
        Star.getRandomByte(),
    ].join(',') + ',255)';
}

Star.SPEED = 5;
Star.RADIUS = 3;
Star.POINTS_COUNT = 5;
Star.PADDING = 10;

Star.getRandomByte = function getRandomByte() {
    return Math.ceil(Math.random() * 255);
};

Star.createInstances = function createInstances() {
    Star.instances = [];

    for (var x = 0; x < width; x += Star.RADIUS + Star.PADDING) {
        for (var y = 0; y < width; y += Star.RADIUS + Star.PADDING) {
            Star.instances.push(new Star(x, y));
        }
    }
};

Star.render = function render() {
    for (var i = 0; i < Star.instances.length; i++) {
        Star.instances[i].render();
    }
};

Star.prototype.render = function render() {
    context.fillStyle = this.fill;
    context.beginPath();
    context.ellipse(this.x, this.y, Star.RADIUS, Star.RADIUS, 0, 0, Math.PI * 2);
    context.fill();
};

window['star'] = Star;
Star.createInstances();

function loop() {
    c.clearRect(0, 0, width, height);

    c.fillStyle = 'orange';
    c.fillRect(0, 0, width, height);

    Star.render();
    marvin.render();

    requestAnimationFrame(loop);
}

loop();

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
