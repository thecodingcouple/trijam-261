const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];
const HIGHLIGHT_CELL_CLASSNAME = 'highlighted-cell';

let _blunders = [];
let _currentBlunderIndex = -1;
let _isHintRevealed = false;
let _clickedCells = [];

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

        const pieceToMove = _blunders[_currentBlunderIndex].pieceToMove;
        const elementId = `${pieceToMove[0]}-${pieceToMove[1]}`;
        const div = document.getElementById(elementId);
        div.classList.add(HIGHLIGHT_CELL_CLASSNAME);

        _clickedCells.push([pieceToMove[0], pieceToMove[1]]);
    });

    const tryAgainButton = document.getElementById('try-again-button');
    tryAgainButton.addEventListener('click', () => {
        const incorrectAnswer = document.getElementById('incorrect-answer');
        incorrectAnswer.classList.add('hidden');
        hintButton.classList.remove('hidden');

        startRound(_currentBlunderIndex);
    });

    const nextRoundButton = document.getElementById('next-round-button');
    nextRoundButton.addEventListener('click', () => {
        const correctAnswer = document.getElementById('correct-answer');
        correctAnswer.classList.add('hidden');

        if(hintButton.classList.contains('hidden')) {
            hintButton.classList.remove('hidden');
        }

        startRound(_currentBlunderIndex + 1);
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
    _clickedCells = [];

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
 * Determine whether or not the player guess correctly before ending the round
 */
function endRound() {
    let pieceToMove = _blunders[_currentBlunderIndex].pieceToMove;
    let destination = _blunders[_currentBlunderIndex].destination;

    // Check to see if the user won the rounds
    const containsPieceToMove = _clickedCells.some(p => pieceToMove[0] == p[0] && pieceToMove[1] == p[1]);
    const containsDestination = _clickedCells.some(d => destination[0] == d[0] && destination[1] == d[1]);

    const playerWon = containsPieceToMove && containsDestination;

    if (playerWon) {
        const blunderExplanation = document.getElementById('blunder-explanation');
        blunderExplanation.innerText = _blunders[_currentBlunderIndex].description;

        const hintButton = document.getElementById('hint-button');
        hintButton.classList.add('hidden');

        // Hide the next round button if player is in the last round
        if(_currentBlunderIndex + 1 == _blunders.length) {
            const nextRoundButton = document.getElementById('next-round-button');
            nextRoundButton.classList.add('hidden');
        }

        const correctAnswer = document.getElementById('correct-answer');
        correctAnswer.classList.remove('hidden');

    } else {
        const incorrectAnswer = document.getElementById('incorrect-answer');
        incorrectAnswer.classList.remove('hidden');
    }
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
            div.addEventListener('click', () => {
                if(div.classList.contains(HIGHLIGHT_CELL_CLASSNAME)) {
                    div.classList.remove(HIGHLIGHT_CELL_CLASSNAME);
                    _clickedCells = _clickedCells.filter(c => c[0] != row && c[1] != col);
                } else {
                    div.classList.add(HIGHLIGHT_CELL_CLASSNAME);
                    _clickedCells.push([row, col]);
                }

                if(_clickedCells.length == 2) {
                    endRound();
                }
            });

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