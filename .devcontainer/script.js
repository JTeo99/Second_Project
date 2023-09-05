document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is fun and challenging.",
        "Typing speed matters in the digital age.",
        "Practice makes perfect.",
        "Coding is an art and science.",
    ];

    const quoteElement = document.getElementById("quote");
    const textElement = document.getElementById("text");
    const userInput = document.getElementById("user-input");
    const resultElement = document.getElementById("result");
    const startButton = document.getElementById("start-button");

    let currentQuoteIndex = 0;
    let startTime, endTime;

    startButton.addEventListener("click", startGame);

    function startGame() {
        currentQuoteIndex = 0;
        resultElement.textContent = "";
        startButton.disabled = true;
        startButton.textContent = "Game in progress...";
        showNextQuote();
        userInput.value = "";
        userInput.addEventListener("input", checkInput);
        userInput.focus();
    }

    function showNextQuote() {
        if (currentQuoteIndex < quotes.length) {
            quoteElement.textContent = "Type the text below:";
            textElement.textContent = quotes[currentQuoteIndex];
        } else {
            endGame();
        }
    }

    function checkInput() {
        if (currentQuoteIndex < quotes.length) {
            if (userInput.value === quotes[currentQuoteIndex]) {
                currentQuoteIndex++;
                userInput.value = "";
                showNextQuote();
                if (currentQuoteIndex === quotes.length) {
                    endGame();
                }
            }
        }
    }

    function endGame() {
        startTime = performance.now() - startTime;
        const totalTime = (endTime - startTime) / 1000;
        const wordsPerMinute = (quotes.join(" ").split(" ").length / totalTime) * 60;
        resultElement.textContent = `Game Over! You completed X quotes in X difficulty!`;
        startButton.textContent = "Restart Game";
        startButton.disabled = false;
        userInput.removeEventListener("input", checkInput);
    }
});
