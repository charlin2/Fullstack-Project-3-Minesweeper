document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const win = document.querySelector('#win');
    const loss = document.querySelector('#loss');
    let width = 10;
    let mineAmount = 10;
    let flags = 0;
    let nonflags = 0;
    let squares = [];
    let isGameOver = false;
    let firstClick = true;

    const resetbtn = document.querySelector('button');
    resetbtn.addEventListener('click', function (e) {
        for (let i = 0; i < 100; i++) {
            let square = document.getElementById(i);
            square.remove();
        }
        createBoard();
    });

    function createBoard() {
        flagsLeft.innerHTML = mineAmount;
        flags = 0;
        nonflags = 0;
        squares = [];
        isGameOver = false;
        win.innerHTML = '';
        loss.innerHTML = '';
        firstClick = true;

        const gameArray = Array(width * width).fill('valid');

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function (e) {
                // Make sure first click cannot be a mine
                if (firstClick) {
                    let minesArray = [];
                    while (minesArray.length < 10) {
                        let r = Math.floor(Math.random()*99);
                        if (r != square.id && minesArray.indexOf(r) === -1)
                            minesArray.push(r);
                    }
                    // Randomly insert mines
                    for (let i = 0; i < mineAmount; i++) {
                        let index = minesArray[i];
                        let mSquare = document.getElementById(index);
                        mSquare.classList.remove('valid');
                        mSquare.classList.add('mine');
                    }
                    // Insert numbers
                    for (let i = 0; i < squares.length; i++) {
                        let total = 0;
                        const isLeftEdge = (i % width === 0);
                        const isRightEdge = (i % width === width - 1);
                        if (squares[i].classList.contains('valid')) {
                            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine'))
                                total++;
                            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('mine'))
                                total++;
                            if (i > 10 && squares[i - width].classList.contains('mine'))
                                total++;
                            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('mine'))
                                total++;
                            if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('mine'))
                                total++;
                            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('mine'))
                                total++;
                            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('mine'))
                                total++;
                            if (i < 89 && squares[i + width].classList.contains('mine'))
                                total++;
                            squares[i].setAttribute('data', total);
                        }
                    }
                    click(square);
                    firstClick = false;
                } else {
                    click(square);
                }
            });

            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }
    }
    createBoard();

    // Add Flag with right click
    function addFlag(square) {
        if (isGameOver)
            return;
        if (!(flags === mineAmount)) {
            if (!square.classList.contains('checked')) {
                if (!square.classList.contains('flag')) {
                    square.classList.add('flag');
                    square.innerHTML = ' 🚩';
                    flags++;
                    flagsLeft.innerHTML = mineAmount - flags;
                } else {
                    square.classList.remove('flag');
                    square.innerHTML = '';
                    flags--;
                    flagsLeft.innerHTML = mineAmount - flags;
                }
            }
        } else if (square.classList.contains('flag')) {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
            flagsLeft.innerHTML = mineAmount - flags;
        }
    }

    // Reveal tile with left click
    function click(square) {
        let currentId = square.id;
        if (isGameOver)
            return;
        if (square.classList.contains('checked') || square.classList.contains('flag'))
            return;
        if (square.classList.contains('mine')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            nonflags++;
            checkForWin();
            if (total != 0) {
                square.classList.add('checked');
                if (total == 1)
                    square.classList.add('one');
                if (total == 2)
                    square.classList.add('two');
                if (total == 3)
                    square.classList.add('three');
                if (total == 4)
                    square.classList.add('four');
                if (total == 5)
                    square.classList.add('five');
                if (total == 6)
                    square.classList.add('six');
                if (total == 7)
                    square.classList.add('seven');
                if (total == 8)
                    square.classList.add('eight');
                square.innerHTML = total;
                return;
            }
            checkSquare(currentId);
        }
        square.classList.add('checked');
    }


    // Check neighboring squares after one is clicked
    function checkSquare(currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
        checkForWin();
    }

    function gameOver() {
        loss.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;

        // Reveal mines
        squares.forEach(square => {
            if (square.classList.contains('mine')) {
                square.innerHTML = '💣';
                square.classList.remove('mine');
                square.classList.add('checked');
            }
        })
    }

    function checkForWin() {
        if (nonflags == 100 - mineAmount) {
            win.innerHTML = 'YOU WIN!';
            isGameOver = true;
        }
    }
});


