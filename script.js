// ========================================
// HTML ELEMENTS
// ========================================

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const restartButton =
    document.getElementById("restartBtn");

const resetScoreButton =
    document.getElementById("resetScoreBtn");

const modeButtons =
    document.querySelectorAll(".mode-btn");


// ========================================
// SCORE ELEMENTS
// ========================================

const xScoreElement =
    document.getElementById("xScore");

const oScoreElement =
    document.getElementById("oScore");

const drawScoreElement =
    document.getElementById("drawScore");


// ========================================
// POPUP ELEMENTS
// ========================================

const resultOverlay =
    document.getElementById("resultOverlay");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const newGameButton =
    document.getElementById("newGameBtn");


// ========================================
// SOUND ELEMENT
// ========================================

const soundButton =
    document.getElementById("soundBtn");


// ========================================
// GAME VARIABLES
// ========================================

let gameBoard = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "2player";


// ========================================
// SCORE VARIABLES
// ========================================

let xScore = 0;

let oScore = 0;

let drawScore = 0;


// ========================================
// SOUND VARIABLES
// ========================================

let soundEnabled = true;

let audioContext = null;


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ========================================
// AUDIO CONTEXT
// ========================================

function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;

}


// ========================================
// PLAY SOUND
// ========================================

function playSound(
    frequency,
    duration,
    type = "sine"
) {

    if (!soundEnabled) {

        return;

    }


    const context =
        getAudioContext();


    if (
        context.state === "suspended"
    ) {

        context.resume();

    }


    const oscillator =
        context.createOscillator();

    const gainNode =
        context.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    gainNode.gain.setValueAtTime(
        0.08,
        context.currentTime
    );


    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + duration
    );


    oscillator.connect(
        gainNode
    );

    gainNode.connect(
        context.destination
    );


    oscillator.start();

    oscillator.stop(
        context.currentTime + duration
    );

}


// ========================================
// MOVE SOUND
// ========================================

function playMoveSound(player) {

    if (player === "X") {

        playSound(
            520,
            0.12,
            "sine"
        );

    }
    else {

        playSound(
            680,
            0.12,
            "sine"
        );

    }

}


// ========================================
// WIN SOUND
// ========================================

function playWinSound() {

    if (!soundEnabled) {

        return;

    }


    playSound(
        523,
        0.15,
        "sine"
    );


    setTimeout(
        () => {

            playSound(
                659,
                0.15,
                "sine"
            );

        },
        150
    );


    setTimeout(
        () => {

            playSound(
                784,
                0.25,
                "sine"
            );

        },
        300
    );

}


// ========================================
// DRAW SOUND
// ========================================

function playDrawSound() {

    if (!soundEnabled) {

        return;

    }


    playSound(
        350,
        0.2,
        "triangle"
    );


    setTimeout(
        () => {

            playSound(
                300,
                0.25,
                "triangle"
            );

        },
        180
    );

}


// ========================================
// BUTTON SOUND
// ========================================

function playButtonSound() {

    playSound(
        400,
        0.08,
        "square"
    );

}


// ========================================
// SOUND BUTTON
// ========================================

soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        if (soundEnabled) {

            soundButton.textContent =
                "🔊 Sound On";


            playButtonSound();

        }
        else {

            soundButton.textContent =
                "🔇 Sound Off";

        }

    }
);


// ========================================
// CONFETTI CELEBRATION
// ========================================

function createConfetti() {

    const confettiCount = 80;

    const shapes = [
        "circle",
        "square",
        "rectangle"
    ];


    const colors = [

        "#ff6b6b",
        "#4dabf7",
        "#ffd43b",
        "#51cf66",
        "#f783ac",
        "#845ef7",
        "#ff922b"

    ];


    for (
        let i = 0;
        i < confettiCount;
        i++
    ) {

        const confetti =
            document.createElement("div");


        confetti.classList.add(
            "confetti"
        );


        const randomShape =
            shapes[
                Math.floor(
                    Math.random() *
                    shapes.length
                )
            ];


        confetti.classList.add(
            randomShape
        );


        confetti.style.left =
            Math.random() * 100 + "vw";


        const duration =
            2 +
            Math.random() * 3;


        confetti.style.animationDuration =
            duration + "s";


        confetti.style.animationDelay =
            Math.random() * 0.8 + "s";


        const size =
            6 +
            Math.random() * 8;


        confetti.style.width =
            size + "px";


        confetti.style.height =
            size * 1.5 + "px";


        confetti.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        document.body.appendChild(
            confetti
        );


        setTimeout(
            () => {

                confetti.remove();

            },
            (duration + 1) * 1000
        );

    }

}


// ========================================
// MODE BUTTONS
// ========================================

modeButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                playButtonSound();


                gameMode =
                    button.dataset.mode;


                modeButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                closePopup();

                restartGame();

            }
        );

    }
);


// ========================================
// CELL CLICK
// ========================================

cells.forEach(
    (cell) => {

        cell.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        cell.dataset.index
                    );


                if (
                    !gameActive ||
                    gameBoard[index] !== ""
                ) {

                    return;

                }


                // =================================
                // PLAYER VS COMPUTER
                // =================================

                if (
                    gameMode === "computer"
                ) {

                    if (
                        currentPlayer !== "X"
                    ) {

                        return;

                    }


                    makeMove(
                        index,
                        "X"
                    );


                    if (!gameActive) {

                        return;

                    }


                    currentPlayer =
                        "O";


                    statusText.textContent =
                        "Computer is thinking... 🤖";


                    setTimeout(
                        () => {

                            computerMove();

                        },
                        400
                    );


                    return;

                }


                // =================================
                // 2 PLAYER MODE
                // =================================

                makeMove(
                    index,
                    currentPlayer
                );


                if (!gameActive) {

                    return;

                }


                currentPlayer =
                    currentPlayer === "X"
                        ? "O"
                        : "X";


                statusText.textContent =
                    `Player ${currentPlayer}'s Turn`;

            }
        );

    }
);


// ========================================
// MAKE MOVE
// ========================================

function makeMove(
    index,
    player
) {

    gameBoard[index] =
        player;


    cells[index].textContent =
        player;


    cells[index].classList.add(
        player.toLowerCase()
    );


    playMoveSound(player);


    checkGameResult();

}


// ========================================
// COMPUTER MOVE
// ========================================

function computerMove() {

    if (!gameActive) {

        return;

    }


    let bestScore =
        -Infinity;

    let bestMove =
        -1;


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        if (
            gameBoard[i] === ""
        ) {

            gameBoard[i] =
                "O";


            const score =
                minimax(
                    gameBoard,
                    0,
                    false
                );


            gameBoard[i] =
                "";


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestMove =
                    i;

            }

        }

    }


    if (
        bestMove !== -1
    ) {

        makeMove(
            bestMove,
            "O"
        );

    }


    if (gameActive) {

        currentPlayer =
            "X";


        statusText.textContent =
            "Your Turn — Player X";

    }

}


// ========================================
// MINIMAX AI
// ========================================

function minimax(
    board,
    depth,
    isMaximizing
) {

    const result =
        evaluateBoard(board);


    if (result === "O") {

        return 10 - depth;

    }


    if (result === "X") {

        return depth - 10;

    }


    if (result === "draw") {

        return 0;

    }


    if (isMaximizing) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                board[i] === ""
            ) {

                board[i] =
                    "O";


                const score =
                    minimax(
                        board,
                        depth + 1,
                        false
                    );


                board[i] =
                    "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            if (
                board[i] === ""
            ) {

                board[i] =
                    "X";


                const score =
                    minimax(
                        board,
                        depth + 1,
                        true
                    );


                board[i] =
                    "";


                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


// ========================================
// EVALUATE BOARD
// ========================================

function evaluateBoard(board) {

    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return board[a];

        }

    }


    if (
        board.every(
            (cell) =>
                cell !== ""
        )
    ) {

        return "draw";

    }


    return null;

}


// ========================================
// CHECK GAME RESULT
// ========================================

function checkGameResult() {

    let winner =
        null;

    let winningCombination =
        null;


    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            gameBoard[a] !== "" &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {

            winner =
                gameBoard[a];

            winningCombination =
                combination;

            break;

        }

    }


    // ====================================
    // WINNER
    // ====================================

    if (
        winner !== null
    ) {

        gameActive =
            false;


        if (winner === "X") {

            xScore++;

            xScoreElement.textContent =
                xScore;

        }
        else {

            oScore++;

            oScoreElement.textContent =
                oScore;

        }


        winningCombination.forEach(
            (index) => {

                cells[index]
                    .classList
                    .add("winner");

            }
        );


        playWinSound();


        showWinnerPopup(
            winner
        );


        return;

    }


    // ====================================
    // DRAW
    // ====================================

    if (
        gameBoard.every(
            (cell) =>
                cell !== ""
        )
    ) {

        gameActive =
            false;


        drawScore++;

        drawScoreElement.textContent =
            drawScore;


        playDrawSound();


        showDrawPopup();


        return;

    }

}


// ========================================
// WINNER POPUP
// ========================================

function showWinnerPopup(
    winner
) {

    resultIcon.textContent =
        "🏆";


    if (
        gameMode === "computer" &&
        winner === "O"
    ) {

        resultTitle.textContent =
            "Computer Wins! 🤖";


        resultMessage.textContent =
            "The AI played a great game!";

    }
    else {

        resultTitle.textContent =
            `Player ${winner} Wins!`;


        resultMessage.textContent =
            "Great Game! 🎉";

    }


    resultOverlay.classList.add(
        "show"
    );


    // ====================================
    // CONFETTI
    // ====================================

    createConfetti();

}


// ========================================
// DRAW POPUP
// ========================================

function showDrawPopup() {

    resultIcon.textContent =
        "🤝";


    resultTitle.textContent =
        "It's a Draw!";


    resultMessage.textContent =
        "Nobody won this round!";


    resultOverlay.classList.add(
        "show"
    );

}


// ========================================
// CLOSE POPUP
// ========================================

function closePopup() {

    resultOverlay.classList.remove(
        "show"
    );


    document
        .querySelectorAll(".confetti")
        .forEach(
            (confetti) => {

                confetti.remove();

            }
        );

}


// ========================================
// NEW GAME
// ========================================

newGameButton.addEventListener(
    "click",
    () => {

        playButtonSound();

        closePopup();

        restartGame();

    }
);


// ========================================
// RESTART
// ========================================

restartButton.addEventListener(
    "click",
    () => {

        playButtonSound();

        closePopup();

        restartGame();

    }
);


// ========================================
// RESTART GAME
// ========================================

function restartGame() {

    gameBoard = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer =
        "X";


    gameActive =
        true;


    cells.forEach(
        (cell) => {

            cell.textContent =
                "";

            cell.classList.remove(
                "x"
            );

            cell.classList.remove(
                "o"
            );

            cell.classList.remove(
                "winner"
            );

        }
    );


    if (
        gameMode === "computer"
    ) {

        statusText.textContent =
            "Your Turn — Player X";

    }
    else {

        statusText.textContent =
            "Player X's Turn";

    }

}


// ========================================
// RESET SCORES
// ========================================

resetScoreButton.addEventListener(
    "click",
    () => {

        playButtonSound();


        xScore =
            0;

        oScore =
            0;

        drawScore =
            0;


        xScoreElement.textContent =
            "0";

        oScoreElement.textContent =
            "0";

        drawScoreElement.textContent =
            "0";


        closePopup();

        restartGame();

    }
);