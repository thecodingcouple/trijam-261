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

async function startGame() {
    const playScene = document.getElementById('play-scene');
    playScene.classList.remove('hidden');

    _blunders = await getBlunders();
    if (_blunders.length) {
        _currentBlunderIndex = 0;
    }

    const playersHeading = document.getElementById('players-heading');
    playersHeading.innerText = `${_blunders[_currentBlunderIndex].white.name} (white) vs. ${_blunders[_currentBlunderIndex].black.name} (black)`;

    const eventHeading = document.getElementById('event-heading');
    eventHeading.innerText = `${_blunders[_currentBlunderIndex].event} - ${_blunders[_currentBlunderIndex].date}`;

    const playerToMove = document.getElementById('player-to-move');
    playerToMove.innerText = _blunders[_currentBlunderIndex].white.isActivePlayer ? _blunders[_currentBlunderIndex].white.name : _blunders[_currentBlunderIndex].black.name;

    const playerColor = document.getElementById('player-color');
    playerColor.innerText =  _blunders[_currentBlunderIndex].white.isActivePlayer ? 'white' : 'black';
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
        console.log(error);
    }

    return blunders;
}