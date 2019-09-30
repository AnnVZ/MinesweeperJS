let sizePX = 40;

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
    loadField();
}

function setType(id) {
    clearTimer();
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

function loadField() {
    document.getElementById("minesNumber").innerHTML = minesNumber;
    document.getElementById('result').innerHTML = '';
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

    let mainDiv = document.createElement('div');
    mainDiv.id = 'mainDiv';
    mainDiv.oncontextmenu = () => false;
    mainDiv.width = m * sizePX;
    for (let i = 0; i < n; ++i) {
        let div = document.createElement('div');
        div.id = 'div ' + i;
        for (let j = 0; j < m; ++j) {
            let image = document.createElement('img');
            image.height = sizePX;
            image.width = sizePX;
            image.src = 'img/unopenedCell.png';
            image.id = i + ' ' + j;
            // image.ondragstart = () => false;
            image.addEventListener('click', function () {
                if (!gameOver) {
                    if (firstClick) {
                        startTimer();
                        firstClick = false;
                    }
                    let idArr = this.id.split(" ");
                    let x = Number(idArr[0]);
                    let y = Number(idArr[1]);
                    if (userField[x][y] == -2) {
                        openCell(x, y, this, false);
                    }
                }
            });
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
                        document.getElementById("minesNumber").innerHTML = minesLeft;
                        this.src = 'img/flaggedCell.png';
                    }
                    else if (userField[i][j] == -3) {
                        userField[i][j] = -2;
                        ++minesLeft;
                        document.getElementById("minesNumber").innerHTML = minesLeft;
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
                                            currentImage = document.getElementById(x + ' ' + y);
                                            openCell(x, y, currentImage, true);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            let mouseEntered = false;
            image.addEventListener('mouseenter', function () {
                if (userField[i][j] == -2) {
                    this.src = 'img/emptyCell.png';
                    mouseEntered = true;
                }
            });
            image.addEventListener('mouseleave', function () {
                if (mouseEntered && userField[i][j] == -2) {
                    this.src = 'img/unopenedCell.png';
                    mouseEntered = false;
                }
            });
            div.appendChild(image);
        }
        mainDiv.appendChild(div);
    }
    document.body.appendChild(mainDiv);
}

function openWholeUserField() {
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (userField[i][j] == -3) {
                if (field[i][j] != -1) {
                    userField[i][j] = -5;
                    document.getElementById(i + ' ' + j).src = 'img/crossedMine.png';
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
                    document.getElementById(i + ' ' + j).src = 'img/emptyCell.png';
                }
            }
            else if (field[i][j] == -1) {
                if (userField[i][j] == -2) {
                    userField[i][j] = -1;
                    document.getElementById(i + ' ' + j).src = 'img/minedCell.png';
                }
            }
        }
    }
}

function openFlagsLeft() {
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (userField[i][j] == -2) {
                userField[i][j] = -3;
                document.getElementById(i + ' ' + j).src = 'img/flaggedCell.png';
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
        document.getElementById('result').innerHTML = 'Game Over!';
        if (!doubleClick) {
            userField[x][y] = -4;
            img.src = 'img/redMine.png';
        }
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
        document.getElementById('minesNumber').innerHTML = '0';
        document.getElementById('result').innerHTML = 'You Win!';
        openFlagsLeft();
    }
}

function dfs(i, j) {
    if (userField[i][j] == -2)
        ++cellsOpened;
    labels[i][j] = 1;
    userField[i][j] = field[i][j];
    if (userField[i][j] == 0) {
        document.getElementById(i + ' ' + j).src = 'img/emptyCell.png';
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
        document.getElementById(i + ' ' + j).src = 'img/' + userField[i][j] + '.png';
    }
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