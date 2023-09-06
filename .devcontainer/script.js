document.addEventListener("DOMContentLoaded", function () {
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
    let sentencesToType = [];

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
        selectedDifficulty = difficulty;
        quoteElement.textContent = "Choose a difficulty level:";
        textElement.textContent = "";
        highlightDifficultyButton(difficulty);

        // Select 5 random sentences for the user to type
        sentencesToType = getRandomSentences(quotes[selectedDifficulty], 5);
        startButton.disabled = false;

        // Register the "Start Game" button event listener
        startButton.addEventListener("click", startGameOnce);
    }

    function getRandomSentences(sentences, count) {
        const shuffledSentences = sentences.slice(); // Create a copy of sentences
        for (let i = shuffledSentences.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSentences[i], shuffledSentences[j]] = [shuffledSentences[j], shuffledSentences[i]];
        }
        return shuffledSentences.slice(0, count);
    }

    function startGameOnce() {
        // Unregister the event listener to prevent multiple game starts
        startButton.removeEventListener("click", startGameOnce);

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

    function updateTimer() {
        timerElement.textContent = `Time: ${seconds} seconds`;
        seconds++;
    }

    function showNextQuote() {
        if (currentQuoteIndex < sentencesToType.length) {
            quoteElement.textContent = "Type the text below:";
            textElement.textContent = sentencesToType[currentQuoteIndex];
        } else {
            endGame();
        }
    }

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
    }
});