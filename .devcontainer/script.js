document.addEventListener("DOMContentLoaded", function () {
    // Arrays for quotes.
    const quotes = {
        easy: [
            "Programming is a valuable skill.",
            "Coding is fun and creative.",
            "Practice makes perfect.",
            "Touch typing is a necessity.",
            "Starting off with easy.",
            "This sentence is not too hard.",
            "I wish I could type faster.",
            "Building websites is fun."
        ],
        medium: [
            "I love vanilla ice cream, but my brother prefers chocolate.",
            "JavaScript is a scripting language.",
            "Debugging can be challenging but rewarding.",
            "Coding is exciting, I want to learn more.",
            "Whatever you are, be a good one.",
            "Happiness is not by chance, but by choice.",
            "I may not be with you, but I am always there for you!",
            "Sometimes later becomes never. Do it now."
        ],
        hard: [
            "The quick brown fox jumps over the lazy dog.",
            "HTML, CSS, and JavaScript are web technologies.",
            "Algorithmic thinking is important for coding interviews.",
            "Work hard in silence; let success make the noise.",
            "I have three things to do today: wash my car, call my mother, and feed my dog.",
            "I haven't been everywhere, but it's on my list.",
            "Music should strike fire from people's hearts.",
            "Sphinx of black quartz, judge my vow."
        ],
    };

    // Get references to HTML elements.
    const quoteElement = document.getElementById("quote");
    const textElement = document.getElementById("text");
    const userInput = document.getElementById("user-input");
    const timerElement = document.getElementById("timer");
    const resultElement = document.getElementById("result");
    const startButton = document.getElementById("start-button");
    const easyButton = document.getElementById("easy-button");
    const mediumButton = document.getElementById("medium-button");
    const hardButton = document.getElementById("hard-button");

    // Initialize game variables.
    let currentQuoteIndex = 0;
    let timerInterval;
    let seconds = 0;
    let selectedDifficulty = "";
    let gameStarted = false;
    let sentencesToType = [];

    // Function to highlight the active difficulty button.
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

    // Event listeners for difficulty buttons.
    easyButton.addEventListener("click", () => selectDifficulty("easy"));
    mediumButton.addEventListener("click", () => selectDifficulty("medium"));
    hardButton.addEventListener("click", () => selectDifficulty("hard"));

    // Function to select a difficulty level.
    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;
        quoteElement.textContent = "Choose a difficulty level:";
        textElement.textContent = "";
        highlightDifficultyButton(difficulty);
        sentencesToType = getRandomSentences(quotes[selectedDifficulty], 5);
        startButton.disabled = false;
        startButton.addEventListener("click", startGameOnce);
    }

    // Function to get random sentences from a list.
    function getRandomSentences(sentences, count) {
        const shuffledSentences = sentences.slice();
        for (let i = shuffledSentences.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSentences[i], shuffledSentences[j]] = [shuffledSentences[j], shuffledSentences[i]];
        }
        return shuffledSentences.slice(0, count);
    }

    // Function to start the game once.
    function startGameOnce() {
        startButton.removeEventListener("click", startGameOnce);
        easyButton.disabled = true;
        mediumButton.disabled = true;
        hardButton.disabled = true;

        gameStarted = true;
        currentQuoteIndex = 0;
        resultElement.textContent = "";
        startButton.disabled = true;
        startButton.textContent = "Game in progress...";
        showNextQuote();
        userInput.value = "";
        userInput.addEventListener("input", checkInput);
        userInput.focus();

        clearInterval(timerInterval);
        seconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Function to update the timer.
    function updateTimer() {
        timerElement.textContent = `Time: ${seconds} seconds`;
        seconds++;
    }

    // Function to display the next quote.
    function showNextQuote() {
        if (currentQuoteIndex < sentencesToType.length) {
            quoteElement.textContent = "Type the text below:";
            textElement.textContent = sentencesToType[currentQuoteIndex];
        } else {
            endGame();
        }
    }

    // Function to check user input.
    function checkInput() {
        if (currentQuoteIndex < sentencesToType.length) {
            const currentQuote = sentencesToType[currentQuoteIndex];
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

                if (currentQuoteIndex < sentencesToType.length) {
                    showNextQuote();
                } else {
                    endGame();
                }

                userInput.value = "";
            }
        }
    }

    // Array to store game history.
    const gameHistory = [];

    // Function to add a game to the history.
    function addGameToHistory(difficulty, timeSpent, wordsPerMinute) {
        const tableBody = document.querySelector("#game-history tbody");

        const newRow = document.createElement("tr");

        const gameCell = document.createElement("td");
        const difficultyCell = document.createElement("td");
        const timeSpentCell = document.createElement("td");
        const wordsPerMinuteCell = document.createElement("td");

        gameCell.textContent = gameHistory.length + 1;
        difficultyCell.textContent = difficulty;
        timeSpentCell.textContent = `${timeSpent} seconds`;
        wordsPerMinuteCell.textContent = wordsPerMinute;

        newRow.appendChild(gameCell);
        newRow.appendChild(difficultyCell);
        newRow.appendChild(timeSpentCell);
        newRow.appendChild(wordsPerMinuteCell);

        tableBody.appendChild(newRow);

        if (gameHistory.length >= 10) {
            tableBody.removeChild(tableBody.firstElementChild);
            gameHistory.shift();
        }

        gameHistory.push({
            difficulty,
            timeSpent,
            wordsPerMinute,
        });
    }

    // Function to end the game.
    function endGame() {
        clearInterval(timerInterval);
        const wordsPerMinute = (
            (sentencesToType.join(" ").split(" ").length / (seconds / 60))
        ).toFixed(2);
        resultElement.textContent = `Game Over! Your typing speed (${selectedDifficulty}): ${wordsPerMinute} WPM`;
        startButton.textContent = "Restart Game";
        startButton.disabled = false;
        userInput.removeEventListener("input", checkInput);
        gameStarted = false;
        highlightDifficultyButton("");
        quoteElement.textContent = "";
        textElement.textContent = "";

        addGameToHistory(selectedDifficulty, seconds, wordsPerMinute);
        easyButton.disabled = false;
        mediumButton.disabled = false;
        hardButton.disabled = false;
    }
});
