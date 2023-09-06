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
            "Debugging can be challenging but rewarding.",
        ],
        hard: [
            "The quick brown fox jumps over the lazy dog.",
            "HTML, CSS, and JavaScript are web technologies.",
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
    let gameStarted = false;

    function highlightDifficultyButton(difficulty) {
        easyButton.classList.remove("difficulty-button-active");
        mediumButton.classList.remove("difficulty-button-active");
        hardButton.classList.remove("difficulty-button-active");

        if (difficulty === "easy") {
            easyButton.classList.add("difficulty-button-active");
        } else if (difficulty === "medium") {
            mediumButton.classList.add("difficulty-button-active");
        } else if (difficulty === "hard") {
            hardButton.classList.add("difficulty-button-active");
        }
    }

    easyButton.addEventListener("click", () => selectDifficulty("easy"));
    mediumButton.addEventListener("click", () => selectDifficulty("medium"));
    hardButton.addEventListener("click", () => selectDifficulty("hard"));

    function selectDifficulty(difficulty) {
        if (!gameStarted) {
            selectedDifficulty = difficulty;
            quoteElement.textContent = "Choose a difficulty level:";
            textElement.textContent = "";
            highlightDifficultyButton(difficulty);
        }
    }

    function startGame() {
        if (!gameStarted) {
            if (!selectedDifficulty) {
                alert("Please select a difficulty level.");
                return;
            }

            gameStarted = true;
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
            const currentQuote = difficultyQuotes[currentQuoteIndex];
            const userInputValue = userInput.value;
            let typedText = '';

            for (let i = 0; i < currentQuote.length; i++) {
                const isCorrect = currentQuote[i] === userInputValue[i];
                const charClass = isCorrect ? 'correct' : (userInputValue[i] ? 'mistyped' : '');
                typedText += `<span class="${charClass}">${currentQuote[i]}</span>`;
            }
            textElement.innerHTML = typedText;

            if (userInputValue === currentQuote) {
                currentQuoteIndex++;

                if (currentQuoteIndex < difficultyQuotes.length) {
                    showNextQuote();
                } else {
                    endGame();
                }

                userInput.value = "";
            }
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        const wordsPerMinute = (
            (quotes[selectedDifficulty].join(" ").split(" ").length / (seconds / 60))
        ).toFixed(2);
        resultElement.textContent = `Game Over! Your typing speed (${selectedDifficulty}): ${wordsPerMinute} WPM`;
        startButton.textContent = "Restart Game";
        startButton.disabled = false;
        userInput.removeEventListener("input", checkInput);
        gameStarted = false;
        highlightDifficultyButton("");
        quoteElement.textContent = "";
        textElement.textContent = "";
    }

    startButton.addEventListener("click", startGame);
});
