// DOM element selections for game controls
const ruleBtn  = document.querySelector("#rules");
const rmvBtn = document.querySelector("#btn-x");
const gameRules = document.querySelector(".rule-chart");
const paperButton = document.querySelector('#paper');
const rockButton = document.querySelector('#stone');
const scissorsButton = document.querySelector('#scissor');
const playAgainButton = document.querySelector('.play-again');
const playAgainAltButton = document.querySelector('.play-again-alt');
const nextButton = document.querySelector('#nxt');

// Constants for game choices to improve code readability
const STONE = 0;
const PAPER = 1;
const SCISSORS = 2;

// Game state variables
let computerScore = localStorage.getItem('computerScore') || 0;
let playerScore = localStorage.getItem('playerScore') || 0;
let playerChoice = '';
let computerChoice = '';
let matchResult = '';

/**
 * Initializes/resets the game state and updates the UI
 * - Retrieves scores from localStorage
 * - Resets choice variables
 * - Updates score display
 * - Resets visibility of game elements
 */
function setup() {
    computerScore = localStorage.getItem('computerScore') || 0;
    playerScore = localStorage.getItem('playerScore') || 0;

    // Save scores to localStorage
    localStorage.setItem('playerScore', playerScore);
    localStorage.setItem('computerScore', computerScore);

    // Update score display
    document.getElementById('p-score').innerText = playerScore;
    document.getElementById('c-score').innerText = computerScore;

    // Reset visibility of game elements using display
    document.querySelector('.results').style.zIndex = '-1';
    document.querySelector('.results').style.display = 'none';

    document.querySelector('.board').style.zIndex = '1';
    document.querySelector('.board').style.display = 'flex';

    document.querySelector('.game').style.zIndex = '1';
    document.querySelector('.game').style.display = 'block';

    document.querySelector('#nxt').style.display = 'none';

    document.querySelector('.celebrate').style.display = 'none';
}

function start() {
    const choiceArray = localStorage.getItem('choiceArray') || [];
    const isCelebrate = localStorage.getItem('celebrate') || false;

    if (isCelebrate) {
        celebrate();
        return;
    }

    if (choiceArray.length === 0) {
        setup();
    }
    else {
        playerChoice = choiceArray[0];
        computerChoice = choiceArray[2];
        setup();

        showResult(playerChoice, computerChoice, true);
    }
}

/**
 * Handles player's choice and triggers game logic
 * @param {Event} e - Click event object
 */
function playerClick(e) {
    // Generate random computer choice (0-2)
    computerChoice = Math.floor(Math.random() * 3);

    // Convert button ID to numeric choice
    switch (e.target.id) {
        case 'stone':
            playerChoice = STONE;
            break;
        case 'paper':
            playerChoice = PAPER;
            break;
        case 'scissor':
            playerChoice = SCISSORS;
            break;
    }

    // Save choices to localStorage
    localStorage.setItem('choiceArray', [playerChoice, computerChoice]);

    showResult(playerChoice, computerChoice, false);
}

/**
 * Determines and displays the game result
 * Uses modulo arithmetic to determine winner:
 * 0 = tie, 1 = player wins, 2 = computer wins
 * @param {number} playerChoice - Player's selection (0-2)
 * @param {number} computerChoice - Computer's selection (0-2)
 */
function showResult(playerChoice, computerChoice, reload) {
    let result = (playerChoice - computerChoice + 3) % 3;

    switch (result) {
        case 0: // Tie
            document.querySelector('#nxt').style.display = 'none';
            document.getElementsByClassName('otcy')[0].classList.remove('won');
            document.getElementsByClassName('otcp')[0].classList.remove('won');
            document.querySelector('.against-pc').style.display = 'none';
            document.querySelector('.play-again').innerHTML = "REPLAY";
            matchResult = '&nbsp; &nbsp;Tie Up';
            break;
        case 1: // Player wins
            matchResult = 'You Win';
            document.querySelector('#nxt').style.display = 'block';
            document.getElementsByClassName('otcy')[0].classList.add('won');
            document.getElementsByClassName('otcp')[0].classList.remove('won');
            document.querySelector('.play-again').innerHTML = "PLAY AGAIN";
            document.querySelector('.against-pc').style.display = 'block';

            if (!reload) {
                playerScore++;
            }
            
            break;
        case 2: // Computer wins
            matchResult = 'You Lose';
            document.querySelector('#nxt').style.display = 'none';
            document.getElementsByClassName('otcp')[0].classList.add('won');
            document.getElementsByClassName('otcy')[0].classList.remove('won');
            document.querySelector('.play-again').innerHTML = "PLAY AGAIN";
            document.querySelector('.against-pc').style.display = 'block';
            
            if (!reload) {
                computerScore++;
            }

            break;
    }

    // Update localStorage and score display
    localStorage.setItem('playerScore', playerScore);
    localStorage.setItem('computerScore', computerScore);
    document.getElementById('p-score').innerText = playerScore;
    document.getElementById('c-score').innerText = computerScore;

    // Update UI with result
    document.querySelector('.result-display').innerHTML = matchResult;

    // Update choice images
    document.querySelector('#player-picked').setAttribute('src', `./icons/icon-${playerChoice}.png`);
    document.querySelector('#computer-picked').setAttribute('src', `./icons/icon-${computerChoice}.png`);

    // Show results screen
    document.querySelector('.results').style.zIndex = '1';
    document.querySelector('.results').style.display = 'block';

    document.querySelector('.game').style.zIndex = '-1';
    document.querySelector('.game').style.display = 'none';
}

/**
 * Displays celebration screen after winning
 * Hides other game elements and shows celebration view
 */
function celebrate() {
    document.querySelector('#nxt').style.display = 'none';
    document.querySelector('.celebrate').style.display = 'block';
    document.querySelector('.celebrate').style.zIndex = '1';
    document.querySelector('.results').style.zIndex = '-1';
    document.querySelector('.results').style.display = 'none';
    document.querySelector('.game').style.zIndex = '-1';
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.board').style.zIndex = '-1';
    document.querySelector('.board').style.display = 'none';
}

// Event listeners for game controls
ruleBtn.addEventListener('click', () => {
    gameRules.classList.toggle('rule-open')
});

rmvBtn.addEventListener('click', () => {
    gameRules.classList.toggle('rule-open')
});

// Game action button listeners
paperButton.addEventListener('click', playerClick);
rockButton.addEventListener('click', playerClick);
scissorsButton.addEventListener('click', playerClick);
playAgainButton.addEventListener('click', () => {
    localStorage.setItem('choiceArray', []);
    setup();
});
playAgainAltButton.addEventListener('click', () => {
    localStorage.clear();
    setup();
});
nextButton.addEventListener('click', () => {
    localStorage.setItem('choiceArray', []);
    localStorage.setItem('celebrate', true);
    celebrate();
});

// Initialize game on load
start();
