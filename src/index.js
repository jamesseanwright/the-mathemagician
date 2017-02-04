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

function loop() {
    marvin.render();

    requestAnimationFrame(loop);
}

loop();

function Marvin() {
    this.x = 100;
    this.y = 100;
    this.headRadius = 75;
    this.eyeY = 75;
    this.eyeWidth = 5;
    this.eyeHeight = 15;
    this.eyeXOffset = 25;
    this.skinGradient = context.createRadialGradient(100, 100, 75, 100, 100, 60);

    this.skinGradient.addColorStop(0, '#eac086');
    this.skinGradient.addColorStop(1, '#ffe0bd');
}

Marvin.prototype.render = function render() {
    context.fillStyle = this.skinGradient;
    context.beginPath();
    context.ellipse(this.x, this.y, this.headRadius, this.headRadius, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#000';
    context.beginPath();
    context.ellipse(this.x - this.eyeXOffset, this.eyeY, this.eyeWidth, this.eyeHeight, 0, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.ellipse(this.x + this.eyeXOffset, this.eyeY, this.eyeWidth, this.eyeHeight, 0, 0, Math.PI * 2);
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