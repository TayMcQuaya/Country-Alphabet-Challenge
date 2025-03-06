// List of countries by letter (simplified, not exhaustive)
const countriesByLetter = {
    'A': ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan'],
    'B': ['Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi'],
    'C': ['Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic'],
    'D': ['Denmark', 'Djibouti', 'Dominica', 'Dominican Republic'],
    'E': ['Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia'],
    'F': ['Fiji', 'Finland', 'France'],
    'G': ['Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana'],
    'H': ['Haiti', 'Honduras', 'Hungary','Holland'],
    'I': ['Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy'],
    'J': ['Jamaica', 'Japan', 'Jordan'],
    'K': ['Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan'],
    'L': ['Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg'],
    'M': ['Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar'],
    'N': ['Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway'],
    'O': ['Oman'],
    'P': ['Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal'],
    'Q': ['Qatar'],
    'R': ['Romania', 'Russia', 'Rwanda'],
    'S': ['Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria'],
    'T': ['Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu'],
    'U': ['Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan'],
    'V': ['Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam'],
    'Y': ['Yemen'],
    'Z': ['Zambia', 'Zimbabwe']
};


// Game state
let currentLetter = 'A';
let gameOver = false;
let timerInterval = null;
let timeLeft = 10;

// DOM elements
const letterDisplay = document.getElementById('current-letter').querySelector('span');
const messageDisplay = document.getElementById('message');
const input = document.getElementById('country-input');
const gameContent = document.getElementById('game-content');
const gameState = document.getElementById('game-state');
const stateMessage = document.getElementById('state-message');
const restartBtn = document.getElementById('state-restart-btn');
const successSound = document.getElementById('success-sound');
const failureSound = document.getElementById('failure-sound');
const timerDisplay = document.getElementById('timer');

// Initialize game
function initGame() {
    currentLetter = 'A';
    gameOver = false;
    timeLeft = 10;
    letterDisplay.textContent = currentLetter;
    messageDisplay.textContent = `Type a country starting with ${currentLetter}`;
    messageDisplay.className = '';
    input.value = '';
    
    // Enable input
    enableInput();
    
    // Show game content, hide game state
    gameContent.classList.remove('hidden');
    gameState.classList.add('hidden');
    stateMessage.textContent = '';
    gameState.className = 'hidden';
    
    // Reset and start timer
    clearInterval(timerInterval);
    startTimer();
    
    // Focus input
    requestAnimationFrame(() => {
        input.focus();
        enableInput();
    });
}

// Timer functions
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 3) {
            timerDisplay.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame('TIME\'S UP!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = timeLeft;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    timerDisplay.classList.remove('warning');
    startTimer();
}

// Function to enable input
function enableInput() {
    input.disabled = false;
    input.readOnly = false;
    input.style.pointerEvents = 'auto';
    input.style.zIndex = '2';
    input.style.position = 'relative';
}

// Check input
function checkCountry() {
    const userInput = input.value.trim().toLowerCase();
    const countries = countriesByLetter[currentLetter].map(c => c.toLowerCase());

    if (userInput === '') {
        endGame('GAME OVER');
        return;
    }

    if (countries.includes(userInput)) {
        messageDisplay.textContent = 'Correct!';
        messageDisplay.className = 'correct';
        // Reset and play success sound
        successSound.currentTime = 0;
        let playPromise = successSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Error playing sound:', error);
            });
        }
        input.value = '';
        moveToNextLetter();
    } else {
        endGame('GAME OVER');
    }
}

// Move to next letter
function moveToNextLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentIndex = alphabet.indexOf(currentLetter);
    let nextIndex = currentIndex + 1;

    // Skip letters with no countries
    while (nextIndex < 26 && !countriesByLetter[alphabet[nextIndex]]) {
        nextIndex++;
    }

    if (nextIndex >= 26) {
        clearInterval(timerInterval);
        showSuccess();
    } else {
        currentLetter = alphabet[nextIndex];
        letterDisplay.textContent = currentLetter;
        messageDisplay.textContent = `Type a country starting with ${currentLetter}`;
        messageDisplay.className = '';
        resetTimer();
        input.focus();
    }
}

// End game
function endGame(message) {
    clearInterval(timerInterval);
    gameContent.classList.add('hidden');
    gameState.classList.remove('hidden');
    stateMessage.textContent = message;
    gameState.className = 'wrong';
    failureSound.play();
    gameOver = true;
}

// Show success
function showSuccess() {
    clearInterval(timerInterval);
    gameContent.classList.add('hidden');
    gameState.classList.remove('hidden');
    stateMessage.textContent = 'SUCCESS';
    gameState.className = 'success';
    successSound.play();
    gameOver = true;
}

// Event listeners
gameContent.addEventListener('click', (e) => {
    if (!gameOver) {
        enableInput();
        input.focus();
    }
});

input.addEventListener('focus', () => {
    if (!gameOver) {
        enableInput();
    }
});

input.addEventListener('blur', () => {
    if (!gameOver) {
        setTimeout(enableInput, 0);
    }
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !gameOver) {
        checkCountry();
    }
});

restartBtn.addEventListener('click', initGame);

// Start the game
initGame();