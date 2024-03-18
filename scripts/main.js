const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];

let _blunders = [];
let _currentBlunderIndex = -1;
let _isHintRevealed = false;


main();

/**
 * Script starting point
 */
function main() {
    const startButton = document.getElementById('start-game-button');
    startButton.addEventListener('click', async () => {
        const startScene = document.getElementById('start-scene');
        startScene.classList.add('hidden');

       await startGame();
    });

    const hintButton = document.getElementById('hint-button');
    hintButton.addEventListener('click', () => {
        hintButton.classList.add('hidden');
    });
}

/**
 * Start new game
 */
async function startGame() {
    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    _blunders = await getBlunders();
    
    startRound(0);
}

/**
 * Start a new round of the game
 * @param {number} round Number indicating the next round
 */
function startRound(round) {
    _currentBlunderIndex = round;

    const playersHeading = document.getElementById('players-heading');
    playersHeading.innerText = `${_blunders[_currentBlunderIndex].white.name} (white) vs. ${_blunders[_currentBlunderIndex].black.name} (black)`;

    const eventHeading = document.getElementById('event-heading');
    eventHeading.innerText = `${_blunders[_currentBlunderIndex].event} - ${_blunders[_currentBlunderIndex].date}`;

    const playerToMove = document.getElementById('player-to-move');
    playerToMove.innerText = _blunders[_currentBlunderIndex].white.isActivePlayer ? _blunders[_currentBlunderIndex].white.name : _blunders[_currentBlunderIndex].black.name;

    const playerColor = document.getElementById('player-color');
    playerColor.innerText =  _blunders[_currentBlunderIndex].white.isActivePlayer ? 'white' : 'black';

    generateGameBoard(_blunders[_currentBlunderIndex].board);
}

/**
 * Generate game board
 */
function generateGameBoard(boardData) {
    const gameTable = document.getElementById('game-board');
    gameTable.innerHTML = '';

    for(let row = 0; row < 8; row++) {
        const tr = document.createElement('tr');
        for(let col = 0; col < 8; col++) {
            const td = document.createElement('td');
            td.id = `td-${row}-${col}`;
            td.title = FILES[col] + RANKS[RANKS.length - row - 1];

            const div = document.createElement('div');
            div.id = `${row}-${col}`;
            div.classList.add('game-cell');

            // Insert game pieces if applicable
            if (boardData[row][col]) {
                const gamePiece = boardData[row][col];
                const img = document.createElement('img');
                img.src = `assets/${gamePiece.color}-${gamePiece.type}.png`;
                img.classList.add('game-piece');

                div.appendChild(img);
            }

            td.appendChild(div);
            tr.appendChild(td);
        }

        gameTable.appendChild(tr);
    } 
}

/**
 * Loads data from json file
 * @returns Collection of blunders
 */
async function getBlunders() {
    let blunders = [];
    try {
        const response = await fetch('scripts/blunders.json');
        if(response.ok) {
            const data = await response.json();
            if(data) {
                blunders = data.blunders;
            } else {
                throw response.statusText;
            }
        }
    } catch (error) {
        console.error(error);
    }

    return blunders;
}