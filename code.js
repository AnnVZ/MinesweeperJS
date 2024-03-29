let sizePX = 41;

let defaultN = [9, 16, 16];
let defaultM = [9, 16, 30];
let defaultMinesNumber = [10, 40, 99];

let n = defaultN[0];
let m = defaultM[0];
let minesNumber = defaultMinesNumber[0];

let field;
let userField;
let cellsOpened;
let cellsToOpen;
let minesLeft;

let labels;
let firstClick; //boolean
let gameOver; //boolean

let time;
let timer;

function startNewGame() {
    let mainDiv = document.getElementById('mainDiv').remove();
    let smile = document.getElementById('smileImage').remove();
    clearTimer();
    loadField();
}

function setType(id) {
    let i = Number(id);
    if (minesNumber != defaultMinesNumber[i] || gameOver) {
        n = defaultN[i];
        m = defaultM[i];
        minesNumber = defaultMinesNumber[i];
        startNewGame();
    }
}

function startTimer() {
    time = 0;
    timer = setInterval(function () {
        ++time;
        if (time == 100 * 60 * 60)
            stopTimer();
        let hours = Math.floor(time / 360000) % 60 + '';
        if (hours.length == 1)
            hours = '0' + hours;
        let minutes = Math.floor(time / 6000) % 60 + '';
        if (minutes.length == 1)
            minutes = '0' + minutes;
        let seconds = Math.floor(time / 100) % 60 + '';
        if (seconds.length == 1)
            seconds = '0' + seconds;
        let hundredthOfSecond = (time % 100) + '';
        if (hundredthOfSecond.length == 1)
            hundredthOfSecond = '0' + hundredthOfSecond;
        document.getElementById("timer").innerHTML = hours + ':' + minutes + ':' + seconds + ':' + hundredthOfSecond;
    }, 10);
    // setTimeout('startTimer()', 100);
}

function clearTimer() {
    stopTimer();
    document.getElementById("timer").innerHTML = '00:00:00:00';
}

function stopTimer() {
    clearInterval(timer);
}

function setVariables() {
    cellsOpened = 0;
    cellsToOpen = n * m - minesNumber;
    minesLeft = minesNumber;
    firstClick = true;
    gameOver = false;
    field = new Array();
    userField = new Array();
    for (let i = 0; i < n; ++i) {
        let arrField = new Array();
        let arrUserField = new Array();
        for (let j = 0; j < m; ++j) {
            arrField.push(0);
            arrUserField.push(-2);
        }
        field.push(arrField);
        userField.push(arrUserField);
    }
}

function createRandomField() {
    for (let i = 0; i < minesNumber; ++i) {
        let x = Math.floor(Math.random() * (n - 1));
        let y = Math.floor(Math.random() * (m - 1));
        while (true) {
            x = Math.floor(Math.random() * (n - 1));
            y = Math.floor(Math.random() * (m - 1));
            if (field[x][y] != -1) {
                field[x][y] = -1;
                break;
            }
        }
    }
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (field[i][j] != -1) {
                let value = 0;
                for (let x = i - 1, count1 = 1; count1 <= 3; ++count1, ++x) {
                    for (let y = j - 1, count2 = 1; count2 <= 3; ++count2, ++y) {
                        if (!(x == i && y == j)) {
                            if (x >= 0 && x < n && j >= 0 && j < m) {
                                if (field[x][y] == -1) {
                                    ++value;
                                }
                            }
                        }
                    }
                }
                field[i][j] = value;
            }
        }
    }
}

function showResult(result) {
    document.getElementById('result').innerHTML = result;
}

function showMinesLeft(num) {
    document.getElementById("minesNumber").innerHTML = num;
}

function showSmile() {
    let smileImage = document.createElement('img');
    smileImage.id = 'smileImage';
    smileImage.src = 'img/smileUp.png';
    smileImage.addEventListener('click', function () {
        startNewGame();
    });
    smileImage.addEventListener('mousedown', function () {
        this.src = 'img/smileDown.png'
    });
    smileImage.addEventListener('mouseup', function () {
        this.src = 'img/smileUp.png'
    });
    smileImage.oncontextmenu = () => false;
    document.getElementById('smileSpan').appendChild(smileImage);
}

function loadField() {
    setVariables();
    createRandomField();

    showResult('');
    showSmile();
    showMinesLeft(minesNumber);
    let mainDiv = document.createElement('div');
    mainDiv.id = 'mainDiv';
    mainDiv.oncontextmenu = () => false;
    for (let i = 0; i < n; ++i) {
        let div = document.createElement('div');
        for (let j = 0; j < m; ++j) {
            let image = document.createElement('img');
            image.height = sizePX;
            image.width = sizePX;
            image.src = 'img/unopenedCell.png';
            image.id = i + ' ' + j;
            image.ondragstart = () => false;
            image.addEventListener('contextmenu', function () {
                if (!gameOver) {
                    if (firstClick) {
                        startTimer();
                        firstClick = false;
                    }
                    if (userField[i][j] == -2) {
                        userField[i][j] = -3;
                        --minesLeft;
                        // if (minesLeft < 0)
                        // minesLeft = 0;
                        showMinesLeft(minesLeft);
                        this.src = 'img/flaggedCell.png';
                    }
                    else if (userField[i][j] == -3) {
                        userField[i][j] = -2;
                        ++minesLeft;
                        showMinesLeft(minesLeft);
                        this.src = 'img/unopenedCell.png';
                    }
                }
            });
            image.addEventListener('dblclick', function () {
                if (userField[i][j] > 0) {
                    let minesNumberAround = 0;
                    for (let x = i - 1, count1 = 1; count1 <= 3; ++count1, ++x) {
                        for (let y = j - 1, count2 = 1; count2 <= 3; ++count2, ++y) {
                            if (!(x == i && y == j)) {
                                if (x >= 0 && x < n && j >= 0 && j < m) {
                                    if (userField[x][y] == -3) {
                                        ++minesNumberAround;
                                    }
                                }
                            }
                        }
                    }
                    if (minesNumberAround == userField[i][j]) {
                        for (let x = i - 1, count1 = 1; count1 <= 3; ++count1, ++x) {
                            for (let y = j - 1, count2 = 1; count2 <= 3; ++count2, ++y) {
                                if (!(x == i && y == j)) {
                                    if (x >= 0 && x < n && j >= 0 && j < m) {
                                        if (userField[x][y] == -2) {
                                            openCell(x, y, document.getElementById(x + ' ' + y), true);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            image.addEventListener('mousedown', function () {
                if (userField[i][j] == -2) {
                    this.src = 'img/emptyCell.png';
                    changeSmileImage('smileOps');
                }
            });
            image.addEventListener('mouseup', function (event) {
                if (userField[i][j] == -2 || userField[i][j] == -3) {
                    changeSmileImage('smileUp');
                    if (event.button == 0) {
                        if (!gameOver) {
                            if (firstClick) {
                                startTimer();
                                firstClick = false;
                            }
                            if (userField[i][j] == -2) {
                                openCell(i, j, this, false);
                            }
                        }
                    }
                }
            });
            image.addEventListener('mouseenter', function (event) {
                if (userField[i][j] == -2 && event.buttons == 1) {
                    this.src = 'img/emptyCell.png';
                }
            });
            image.addEventListener('mouseleave', function () {
                if (userField[i][j] == -2) {
                    this.src = 'img/unopenedCell.png';
                }
            });
            div.appendChild(image);
        }
        mainDiv.appendChild(div);
    }
    document.body.appendChild(mainDiv);
}

function openWholeUserField() { //game over
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (userField[i][j] == -3) {
                if (field[i][j] != -1) {
                    userField[i][j] = -5;
                    changeCellSrcById(i, j, 'crossedMine');
                }
            }
            else if (field[i][j] > 0) {
                if (userField[i][j] == -2) {
                    openNumber(i, j, document.getElementById(i + ' ' + j));
                }
            }
            else if (field[i][j] == 0) {
                if (userField[i][j] == -2) {
                    userField[i][j] = field[i][j];
                    changeCellSrcById(i, j, 'emptyCell');
                }
            }
            else if (field[i][j] == -1) {
                if (userField[i][j] == -2) {
                    userField[i][j] = -1;
                    changeCellSrcById(i, j, 'minedCell');
                }
            }
        }
    }
}

function openFlagsLeft() { //you win
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (userField[i][j] == -2) {
                userField[i][j] = -3;
                changeCellSrcById(i, j, 'flaggedCell');
            }
        }
    }
}

function openNumber(x, y, img) {
    userField[x][y] = field[x][y];
    img.src = 'img/' + field[x][y] + '.png';
}

function openCell(x, y, img, doubleClick) {
    if (field[x][y] > 0) {
        openNumber(x, y, img);
        ++cellsOpened;
    }
    else if (field[x][y] == -1) {
        stopTimer();
        gameOver = true;
        showResult('Game Over!');
        if (!doubleClick) {
            userField[x][y] = -4;
            img.src = 'img/redMine.png';
        }
        changeSmileImage('smileDead');
        openWholeUserField();
    }
    else if (field[x][y] == 0) {
        labels = new Array();
        for (let k = 0; k < n; ++k) {
            let arrLabels = new Array();
            for (let l = 0; l < m; ++l) {
                arrLabels.push(0);
            }
            labels.push(arrLabels);
        }
        dfs(x, y);
    }
    if (cellsOpened == cellsToOpen && !gameOver) {
        stopTimer();
        gameOver = true;
        minesLeft = 0;
        showMinesLeft(minesLeft);
        showResult('You Win!');
        changeSmileImage('smileWinner');
        openFlagsLeft();
    }
}

function dfs(i, j) {
    if (userField[i][j] == -2)
        ++cellsOpened;
    labels[i][j] = 1;
    userField[i][j] = field[i][j];
    if (userField[i][j] == 0) {
        changeCellSrcById(i, j, 'emptyCell');
        for (let x = i - 1, count1 = 1; count1 <= 3; ++count1, ++x) {
            for (let y = j - 1, count2 = 1; count2 <= 3; ++count2, ++y) {
                if (!(x == i && y == j)) {
                    if (x >= 0 && x < n && j >= 0 && j < m) {
                        if (labels[x][y] == 0) {
                            dfs(x, y);
                        }
                    }
                }
            }
        }
    }
    else {
        changeCellSrcById(i, j, userField[i][j]);
    }
}

function changeCellSrcById(i, j, name) {
    document.getElementById(i + ' ' + j).src = 'img/' + name + '.png';
}

function changeSmileImage(name) {
    document.getElementById('smileImage').src = 'img/' + name + '.png';
}

//field:
//1-8 числа
//0 пустая
//-1 бомба

//userField:
//1-8 числа+
//0 пустая+
//-1 бомба при проигрыше пассивная
//-2 не открытая
//-3 флажок 
//-4 бомба при проигрыше активная (нажали последней)
//-5 лишняя бомба при проигрыше