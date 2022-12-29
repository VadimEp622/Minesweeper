'use strict'

const EASY = { matSize: 4, mineTotal: 2 }//N x N -> 4x4=16 (2 mines)
const MEDIUM = { matSize: 8, mineTotal: 14 }//N x N -> 8x8=64 (14 mines)
const HARD = { matSize: 12, mineTotal: 32 }//N x N -> 12x12=144 (32 mines)

const BOMB = '💣'
const FLAG = '🚩'
const START = '😀'
const LOSE = '😥'
const WIN = '😎'

// gBoard[i][j] = {
//     isBomb: false,
//     isFlag: false,
//     isClicked: false,
//     neighborBombs: null
// }

var gBoard
var gGame = {
    gameMode: EASY,
    isGameOn: false,
    timerInterval: null,
    bombsToFlagRemain: null,
    flagsRemain: null,
    livesRemain: null
}

////TODO: COLOR NUMBERS

function onInit() {
    gGame.isGameOn = true
    gGame.bombsToFlagRemain = gGame.gameMode.mineTotal
    gGame.flagsRemain = gGame.gameMode.mineTotal
    gBoard = createSquareBoard(gGame.gameMode.matSize)
    createBombs(gGame, gBoard)
    setBombCountAroundCell(gBoard)
    // console.log('gBoard', gBoard)

    renderBoard(gBoard)
    displayResult()
    renderFlagsRemain(gGame.flagsRemain)

}

//when cell clicked....
function onCellClicked(event, elCell) {
    // console.log('elCell', elCell)
    // console.log('event.button', event.button)//0=left click, 1=middle click, 2=right click
    if (!gGame.isGameOn) return
    else {
        var currPos = gPosFromId(elCell)
        // console.log('currPos', currPos)
        if (event.button === 0) {
            if (gBoard[currPos.i][currPos.j].isBomb) {

                ////TODO: Lives Remain////
                //renderLivesRemain(amount)
                renderCell(elCell, BOMB)
                gameOver('You Lose')
            }
            else if (gBoard[currPos.i][currPos.j].isFlag) return
            else cellReveal(currPos)
        }
        if (event.button === 2 && !gBoard[currPos.i][currPos.j].isClicked) {
            if (!gBoard[currPos.i][currPos.j].isFlag) {
                if (gGame.flagsRemain > 0) {
                    gBoard[currPos.i][currPos.j].isFlag = true
                    renderCell(elCell, FLAG)
                    renderFlagsRemain(--gGame.flagsRemain)
                    if (gBoard[currPos.i][currPos.j].isBomb) gGame.bombsToFlagRemain--
                    if (gGame.bombsToFlagRemain === 0) gameOver('You Win')
                }
            }
            else {
                gBoard[currPos.i][currPos.j].isFlag = false
                renderCell(elCell, '')
                renderFlagsRemain(++gGame.flagsRemain)
                if (gBoard[currPos.i][currPos.j].isBomb) gGame.bombsToFlagRemain++
            }
        }
    }
}


function cellReveal(currPos) {
    if (gBoard[currPos.i][currPos.j].isClicked) return
    var elCell = gCellFromId(currPos.i, currPos.j)
    console.log('elCell', elCell)
    // console.log(`gBoard[${currPos.i}][${currPos.j}].neighborBombs`, gBoard[currPos.i][currPos.j].neighborBombs)
    elCell.style.backgroundColor = 'lightgray'
    if (gBoard[currPos.i][currPos.j].neighborBombs === 0 && !gBoard[currPos.i][currPos.j].isClicked) cellRevealRunner(currPos)
    else renderCell(elCell, gBoard[currPos.i][currPos.j].neighborBombs)
    gBoard[currPos.i][currPos.j].isClicked = true
}

function cellRevealRunner(currPos) {
    gBoard[currPos.i][currPos.j].isClicked = true
    for (var i = currPos.i - 1; i <= currPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = currPos.j - 1; j <= currPos.j + 1; j++) {
            if (i === currPos.i && j === currPos.j) continue
            if (j < 0 || j >= gBoard[0].length) continue
            cellReveal({ i: i, j: j })
        }
    }

}


function gameOver(str) {
    gGame.isGameOn = false
    displayResult(str)//displays result of game
    gGame.timerInterval = null
}


function restart(str) {
    gGame.timerInterval = null
    displayResult()//hides last game result
    if (str === 'EASY') gGame.gameMode = EASY
    if (str === 'MEDIUM') gGame.gameMode = MEDIUM
    if (str === 'HARD') gGame.gameMode = HARD
    onInit()
}


function displayResult(str = 'Hidden Text') {
    var elResult = document.querySelector('.result')
    if (str === 'Hidden Text') elResult.style.visibility = 'hidden'
    else elResult.style.visibility = 'visible'
    elResult.innerText = str
}

function renderFlagsRemain(amount) {
    const elRemainingFlags = document.querySelector('.my-flags')
    var flagsStr = `(${amount} flags left)`
    for (var i = 0; i < amount; i++) flagsStr += FLAG
    elRemainingFlags.innerHTML = flagsStr
}

function renderLivesRemain(amount) {

}



