//event listener that waits for html elements to load before allowing the function to run so players are unable to interact with unloaded elements
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

    // Function to get random sentences from the array.
    function getRandomSentences(sentences, count) {
        const shuffledSentences = sentences.slice();
        for (let i = shuffledSentences.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSentences[i], shuffledSentences[j]] = [shuffledSentences[j], shuffledSentences[i]];
        }
        return shuffledSentences.slice(0, count);
    }

    // Event listener for the "Start Game" button.
    startButton.addEventListener("click", () => {
        if (!selectedDifficulty) {
            // Alert the user to select a difficulty level first.
            alert("Please select a difficulty level first.");
        } else {
            startGameOnce();
        }
    });

    // Function to start the game once.
    function startGameOnce() {
        // Disable the difficulty and start buttons once the game is started.
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
        // Starting the countup to measure time for each game
        clearInterval(timerInterval);
        seconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Function to allow player to see the timer in 00:00 format
    function updateTimer() {
        //divides total seconds by 60 and uses math floor to get whole number to get minutes
        const minutes = Math.floor(seconds / 60);
        //uses % to get remainder from dividing seconds by 60 and displays as the seconds
        const remainingSeconds = seconds % 60;

        //turns the numbers into strings that can be displayed and ensures that if minutes or seconds is <10 a 0 is put in front
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(remainingSeconds).padStart(2, '0');
        
        //constructing the display in 00:00 format
        timerElement.textContent = `Time: ${minutesStr}:${secondsStr}`;
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
            //Fetches the current quote to type
            const currentQuote = sentencesToType[currentQuoteIndex];
            //Fetches the value enterd by the user input
            const userInputValue = userInput.value;
            //creating empty string for building styled display of typed characters
            let typedText = '';

            //creating a loop that iterates each character of the quote
            //It checks whether the user input matches the quote and flags the letters as either correct or incorrect and applies css to the character
            for (let i = 0; i < currentQuote.length; i++) {
                const isCorrect = currentQuote[i] === userInputValue[i];
                const charClass = isCorrect ? 'correct' : (userInputValue[i] ? 'mistyped' : '');
                typedText += `<span class="${charClass}">${currentQuote[i]}</span>`;
            }
            //updates the display with the styled characters
            textElement.innerHTML = typedText;

            //checks whether the final input matches quote
            //if correct then the game will show next quote otherwise end the game if there are no other quotes
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
        //referencing the HTML elements
        const tableBody = document.querySelector("#game-history tbody");
        const newRow = document.createElement("tr");
        //references for tables to populate with the game related data
        const gameCell = document.createElement("td");
        const difficultyCell = document.createElement("td");
        const timeSpentCell = document.createElement("td");
        const wordsPerMinuteCell = document.createElement("td");

        //populating the game related data
        //increasing the game number by 1 each time game is completed
        gameCell.textContent = gameHistory.length + 1;
        //difficulty level the game was completed at
        difficultyCell.textContent = difficulty;

        //time spent on the game
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeSpentCell.textContent = formattedTime;

        //words per minute (WPM)
        wordsPerMinuteCell.textContent = wordsPerMinute;

        //append each cell to the new row
        newRow.appendChild(gameCell);
        newRow.appendChild(difficultyCell);
        newRow.appendChild(timeSpentCell);
        newRow.appendChild(wordsPerMinuteCell);

        // Append the new row to the game history table.
        tableBody.appendChild(newRow);

        // Append the new row to the game history table.
        if (gameHistory.length >= 10) {
            // If so, remove the oldest entry (the first row) from the table.
            tableBody.removeChild(tableBody.firstElementChild);
            // Also, remove the oldest entry from the game history data array.
            gameHistory.shift();
        }

        // Add the current game's details (difficulty, time spent, and WPM) to the game history data array.
        gameHistory.push({
            difficulty,
            timeSpent,
            wordsPerMinute,
        });
    }

    // Function to end the game.
    function endGame() {
        //stops the timer by clearing interval used to update timer
        clearInterval(timerInterval);
        //calculates the WPM, creates result to 2dp
        const wordsPerMinute = (
            (sentencesToType.join(" ").split(" ").length / (seconds / 60))
        ).toFixed(2);
        resultElement.textContent = `Game Over! Your typing speed (${selectedDifficulty}): ${wordsPerMinute} WPM`;
        //changes content of the start game button to restart game
        startButton.textContent = "Restart Game";
        //renables the start game button
        startButton.disabled = false;
        //removes the even listener for the input so that it no longer checks after game ends
        userInput.removeEventListener("input", checkInput);
        //indicates the game is ended
        gameStarted = false;
        //clears the highlight on difficulty buttons
        highlightDifficultyButton("");
        //clears the game related text
        quoteElement.textContent = "";
        textElement.textContent = "";

        //re-enables difficulty buttons
        addGameToHistory(selectedDifficulty, seconds, wordsPerMinute);
        easyButton.disabled = false;
        mediumButton.disabled = false;
        hardButton.disabled = false;
    }
});
