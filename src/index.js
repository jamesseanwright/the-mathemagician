var MIN_GUESS = 1;
var MAX_GUESS = 100;

var context = c;
var width = a.width;
var height = a.height;

var marvin = new Marvin(width / 2, 200);
var background;

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
