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

window['marvin'] = marvin;

function loop() {
    c.clearRect(0, 0, width, height);
    marvin.render();

    requestAnimationFrame(loop);
}

loop();

function Marvin() {
    this.x = 100;
    this.y = 300;
    this.headRadius = 75;
    this.headTop = this.y - this.headRadius / 2;

    this.leftEye = new Eye(this, 5, 15, -25, -20);
    this.rightEye = new Eye(this, 5, 15, 25, -20);

    this.hatXOffset = 15;
    this.hatBaseWidth = this.headRadius - this.hatXOffset;
    this.hatHeight = 50;

    this.skinGradient = context.createRadialGradient(this.x, this.y, 75, this.x, this.y, 60);

    this.skinGradient.addColorStop(0, '#eac086');
    this.skinGradient.addColorStop(1, '#ffe0bd');
}

Marvin.prototype.render = function render() {
    var headTop = this.y / 2;

    // context.fillStyle = 'blue';
    // context.beginPath();
    // context.moveTo(this.x + this.hatXOffset, this.headTop);
    // context.lineTo(this.x + this.hatXOffset + this.hatBaseWidth / 2, this.headTop- this.hatHeight);
    // context.moveTo(this.x + this.hatXOffset + this.hatBaseWidth, this.headTop);
    // context.closePath();
    // context.fill();

    this.leftEye.render();
    this.rightEye.render();

    context.fillStyle = this.skinGradient;
    context.beginPath();
    context.ellipse(this.x, this.y, this.headRadius, this.headRadius, 0, 0, Math.PI * 2);
    context.fill();
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
    context.ellipse(this.parent.x - this.eyeXOffset, this.parent.y + this.eyeYOffset, this.eyeWidth, this.eyeHeight, 0, 0, Math.PI * 2);
    context.fill();
};

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