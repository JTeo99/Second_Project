document.addEventListener("DOMContentLoaded", function () {
    const quotes = {
        easy: [
            "Programming is a valuable skill.",
            "Coding is fun and creative.",
            "Practice makes perfect.",
        ],
        medium: [
            "The quick brown fox jumps over the lazy dog.",
            "JavaScript is a scripting language.",
            "Efficiency is key in software development.",
        ],
        hard: [
            "HTML, CSS, and JavaScript are web technologies.",
            "Debugging can be challenging but rewarding.",
            "Algorithmic thinking is important for coding interviews.",
        ],
    };

    const quoteElement = document.getElementById("quote");
    const textElement = document.getElementById("text");
    const userInput = document.getElementById("user-input");
    const timerElement = document.getElementById("timer");
    const resultElement = document.getElementById("result");
    const startButton = document.getElementById("start-button");
    const easyButton = document.getElementById("easy-button");
    const mediumButton = document.getElementById("medium-button");
    const hardButton = document.getElementById("hard-button");

    let currentQuoteIndex = 0;
    let timerInterval;
    let seconds = 0;
    let selectedDifficulty = "";

    easyButton.addEventListener("click", () => selectDifficulty("easy"));
    mediumButton.addEventListener("click", () => selectDifficulty("medium"));
    hardButton.addEventListener("click", () => selectDifficulty("hard"));

    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;
        easyButton.disabled = true;
        mediumButton.disabled = true;
        hardButton.disabled = true;
        quoteElement.textContent = "Choose a difficulty level:";
        textElement.textContent = "";
        startButton.disabled = false;
    }

    function startGame() {
        currentQuoteIndex = 0;
        resultElement.textContent = "";
        startButton.disabled = true;
        startButton.textContent = "Game in progress...";
        showNextQuote();
        userInput.value = "";
        userInput.addEventListener("input", checkInput);
        userInput.focus();
        seconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timerElement.textContent = `Time: ${seconds} seconds`;
        seconds++;
    }

    function showNextQuote() {
        const difficultyQuotes = quotes[selectedDifficulty];
        if (currentQuoteIndex < difficultyQuotes.length) {
            quoteElement.textContent = "Type the text below:";
            textElement.textContent = difficultyQuotes[currentQuoteIndex];
        } else {
            endGame();
        }
    }

    function checkInput() {
        const difficultyQuotes = quotes[selectedDifficulty];
        if (currentQuoteIndex < difficultyQuotes.length) {
            if (userInput.value === difficultyQuotes[currentQuoteIndex]) {
                currentQuoteIndex++;
                userInput.value = "";
                showNextQuote();
                if (currentQuoteIndex === difficultyQuotes.length) {
                    endGame();
                }
            }
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        const wordsPerMinute = (
            (quotes[selectedDifficulty].join(" ").split(" ").length / (seconds / 60))
        ).toFixed(2);
        resultElement.textContent = `Game Over! Your typing speed: ${wordsPerMinute} WPM`;
        startButton.textContent = "Restart Game";
        startButton.disabled = false;
        userInput.removeEventListener("input", checkInput);
        easyButton.disabled = false;
        mediumButton.disabled = false;
        hardButton.disabled = false;
    }

    startButton.addEventListener("click", startGame);
});
