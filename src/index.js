var MIN_GUESS = 1;
var MAX_GUESS = 100;

var min = MIN_GUESS;
var max = MAX_GUESS;
var guessesCount = Math.ceil(Math.log2(max - min)) + 1;
var guess;
var isHigher;
var isGuessCorrect;

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