let state = {
    board: [],
    currentGame: [],
    savedGames: []
};

function start() {
    readLocalStorage();
    createBoard();
    newGame();
};

function readLocalStorage() {
    if(!window.localStorage) return;

    let saveGamesFromLocalStorage = window.localStorage.getItem('saved-games');

    if(saveGamesFromLocalStorage) state.savedGames = JSON.parse(saveGamesFromLocalStorage);
};

function writeToLOcalStorae() {
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
};

function createBoard() {
    state.board = [];

    for (let i = 1; i <= 60; i++) {
        state.board.push(i);
    };
};

function newGame() {
    resetGame();
    render();
};

function render() {
    renderBoard();
    renderButtons();
    renderSavedGames()
};

function renderBoard() {
    let divBoard = document.querySelector('#megasena-board');
    divBoard.innerHTML = '';

    let ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');
    for (let i = 0; i < state.board.length; i++) {
        let currentNumber = state.board[i];

        let liNumber = document.createElement('li');
        liNumber.classList.add('number')
        liNumber.textContent = currentNumber;

        liNumber.addEventListener('click', handleNumberClick);

        if(isNumberInGame(currentNumber)) {
            liNumber.classList.add('selected-number');
        }

        ulNumbers.appendChild(liNumber);
    }

    divBoard.appendChild(ulNumbers);
};

function handleNumberClick(event) {
    let value = Number(event.currentTarget.textContent);

    if (isNumberInGame(value)) {
        removeNumberFromGame(value);
    } else {
        addNumberToGame(value);
    };
    render();
};

function renderButtons() {
    let divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';

    let buttonNewGame = createNewGameButton();
    let buttonRandomGame = createRandomGameButton();
    let buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);
};

function createSaveGameButton() {
    let button = document.createElement('button');
    button.textContent = 'Salvar Jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame);

    return button;
};

function createRandomGameButton() {
    let button = document.createElement('button');
    button.textContent = 'Jogo Aleatório';

    button.addEventListener('click', randomGame);

    return button;
};

function createNewGameButton() {
    let button = document.createElement('button');
    button.textContent = 'Novo Jogo';

    button.addEventListener('click', newGame);

    return button;
};

function renderSavedGames() {
    let divSavedGame = document.querySelector('#megasena-saved-games');
    divSavedGame.innerHTML = '';

    if(state.savedGames.length === 0) {
        divSavedGame.innerHTML = '<p>Nenhum jogo salvo</p>'
    } else {
        let ulSavedGames = document.createElement('ul');

        for(let i = 0; i < state.savedGames.length; i++) {
            let currentGame = state.savedGames[i];

            let liGame = document.createElement('li');
            liGame.textContent = currentGame.join(', ');
            liGame.classList.add('liGame-style');

            ulSavedGames.appendChild(liGame);
        }

        divSavedGame.append(ulSavedGames);
    }
};

function addNumberToGame(numberToAdd) {
    if (numberToAdd < 1 || numberToAdd > 60) {
        console.error('Número Inválido', numberToAdd);
        return;
    }

    if (state.currentGame.length >= 6) {
        console.error('O jogo está completo.');
        return;
    }

    if (isNumberInGame(numberToAdd)) {
        console.error('Este número já está no jogo.', numberToAdd);
        return;
    }

    state.currentGame.push(numberToAdd);
};

function removeNumberFromGame(numberToRemove) {
    let newGame = [];

    for (let i = 0; i < state.currentGame.length; i++) {
        if (numberToRemove < 1 || numberToRemove > 60) {
            console.error('Número Inválido', numberToRemove);
            return;
        };

        let currentNumber = state.currentGame[i];

        if (currentNumber === numberToRemove) continue;

        newGame.push(currentNumber);
    };

    state.currentGame = newGame;
};

function isNumberInGame(numberToCheck) {
    /*     if(state.currentGame.includes(numberToCheck)){
            return true;
        }
        return false; */

    return state.currentGame.includes(numberToCheck);
};

function saveGame() {
    if (!isGameComplete()) {
        console.error('O Jogo não está completo!');
        return;
    };

    state.savedGames.push(state.currentGame);
    writeToLOcalStorae();
    newGame();
};

function isGameComplete() {
    return state.currentGame.length === 6;
};

function resetGame() {
    state.currentGame = [];
};

function randomGame() {
    resetGame();

    while (!isGameComplete()) {
        let randomNumber = Math.ceil(Math.random() * 60);
        addNumberToGame(randomNumber);
    };

    render()
};

start();