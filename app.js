
// Import words from word-list.js
import { kidsWordList } from './word-list.js';

let word;
let hint;
let guessedLetters = [];
let remainingGuesses = 6;
let gameOver = false;

function initializeGame() {
    const randomIndex = Math.floor(Math.random() * kidsWordList.length);
    word = kidsWordList[randomIndex].word.toUpperCase();
    hint = kidsWordList[randomIndex].hint;
    guessedLetters = [];
    remainingGuesses = 6;
    gameOver = false;
    updateDisplay();
    updateKeyboard(true); // Reset the keyboard
}

function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    const wordArray = word.split('').map(letter => 
        (guessedLetters.includes(letter) || letter === ' ') ? letter : '_'
    );
    wordDisplay.textContent = wordArray.join(' ');

    document.getElementById('guesses-remaining').textContent = remainingGuesses;
    document.getElementById('hint-display').textContent = hint;

    const guessedLettersDisplay = document.getElementById('guessed-letters');
    guessedLettersDisplay.textContent = guessedLetters.join(', ');

    const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    hangmanParts.forEach((part, index) => {
        document.getElementById(part).style.display = index < (6 - remainingGuesses) ? 'block' : 'none';
    });

    if (wordArray.join('') === word) {
        endGame(true);
    } else if (remainingGuesses === 0) {
        endGame(false);
    }
    updateKeyboard(); // Update the keyboard state
}

function handleGuess(letter) {
    if (gameOver) return;
    
    letter = letter.toUpperCase();
    if (!letter.match(/^[A-Z]$/) || guessedLetters.includes(letter)) {
        return;
    }
    
    guessedLetters.push(letter);
    
    if (!word.includes(letter)) {
        playSound('correct');
        remainingGuesses--;
    } else {
        
        playSound('incorrect');
        
    }
    
    updateDisplay();
}

function endGame(won) {
    gameOver = true;
    document.getElementById('message').textContent = won ? "You won!" : `Game Over! The word was ${word}.`;
    // Disable keyboard
    document.querySelectorAll('.key').forEach(key => key.classList.add('disabled'));
    playSound(won ? 'win' : 'lose');
    if (won) {
        showFireworks();
    } else if (!won) {
            showBlackScreen();
        }
    }    

function showBlackScreen() {
        const blackScreen = document.createElement('div');
        blackScreen.className = 'black-screen';
        document.body.appendChild(blackScreen);


        blackScreen.classList.add('blinking-black-screen');
    setTimeout(() => {
        blackScreen.classList.remove('blinking-black-screen');
        // After blinking, solid black for 1 second
        setTimeout(() => {
            blackScreen.classList.add('hide');
        }, 1000);
    }, 3000);

    // Remove black screen after animation
    setTimeout(() => {
        blackScreen.remove();
    }, 3000); // 3000ms for blinking + 1000ms for black screen
}
    

function showFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks';
    document.body.appendChild(fireworksContainer);

    const colors = [
        '#FF1493', // Deep Pink
        '#FFD700', // Gold
        '#00FF00', // Lime Green
        '#4169E1', // Royal Blue
        '#FF4500', // Orange Red
        '#9400D3', // Dark Violet
        '#00B7EB', // Sky Blue
        '#FF6347'  // Tomato
    ];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            const color = colors[Math.floor(Math.random() * colors.length)];
            firework.style.setProperty('--firework-color', color);
            // firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            fireworksContainer.appendChild(firework);

            for (let j = 0; j < 10; j++) { // 10 sparkles per firework
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = `${Math.random() * 10 - 5}px`; // Position sparkles around the firework
                sparkle.style.top = `${Math.random() * 10 - 5}px`;
                sparkle.style.animationDelay = `${j * 0.1}s`; // Stagger the sparkle animation
                firework.appendChild(sparkle);
            }

            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, Math.random() * 4000); // Stagger the fireworks
    }

    // Remove the fireworks container after the last firework has faded
    setTimeout(() => {
        fireworksContainer.remove();
    }, 5000);
}



// Setup or reset the keyboard
function setupKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    keyboardContainer.innerHTML = ''; // Clear previous keyboard if any

    const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');

    ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';
        row.split('').forEach(letter => {
            const keyButton = document.createElement('div');
            keyButton.className = 'key';
            keyButton.textContent = letter.toUpperCase();
            keyButton.addEventListener('click', () => handleGuess(letter));
            rowDiv.appendChild(keyButton);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

// Update the state of the keyboard keys
function updateKeyboard(reset = false) {
    if (reset) {
        setupKeyboard(); // Completely reset the keyboard
    } else {
        document.querySelectorAll('.key').forEach(key => {
            if (guessedLetters.includes(key.textContent)) {
                key.classList.add('disabled');
            } else {
                key.classList.remove('disabled');
            }
        });
    }

}

    function playSound(type) {
        const sound = document.getElementById(`${type}-sound`);
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }    
    
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    document.getElementById('new-game').addEventListener('click', () => {
        initializeGame();
        document.getElementById('message').textContent = '';
    });
});


