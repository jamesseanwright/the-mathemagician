var MIN_GUESS = 1;
var MAX_GUESS = 100;

var min = MIN_GUESS;
var max = MAX_GUESS;
var guessesCount = Math.ceil(Math.log2(max - min)) + 1;
var guess;
var isHigher;

while (guessesCount) {
    isHigher = Math.round(Math.random());
    alert('Foo');
    guessesCount--;
}