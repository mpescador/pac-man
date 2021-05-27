const board = Array(19).fill(0).map(() => Array(19).fill(0))
const Thief = function () {
  this.posx = 9
  this.posy = 9
  this.direction = -1 // 1-up, 2-right, 3-down, 4-left
}
const Ghost = function (x, y) {
  this.posx = x
  this.posy = y
  this.direction = 1
  this.initx = x
  this.inity = y
  this.nextCell = 3
  this.contCell = 0
}
const POSX = 9
const POSY = 9
let moneyCounter = 0
let lifesCounter = 2
const newBoard = []
let audio = new Audio('src/assets/sounds/music1.mp3')
let interval
const thief = new Thief()
const ghost1 = new Ghost(1, 1)
const ghost2 = new Ghost(1, 17)
const ghost3 = new Ghost(17, 17)
const ghost4 = new Ghost(17, 1)
let lvl = 1
let speed = 300

const arrR = [[0, 19, 0], [0, 19, 18], [2, 5, 2], [6, 10, 2], [11, 17, 2], [2, 5, 4], [0, 5, 16], [8, 11, 16], [2, 5, 14], [6, 11, 4], [8, 11, 14], [12, 17, 4], [14, 17, 16], [8, 11, 6], [8, 11, 12]]
const arrC = [[0, 19, 0], [0, 19, 18], [6, 9, 2], [10, 13, 2], [5, 9, 4], [10, 13, 4], [5, 8, 6], [9, 15, 6], [7, 12, 10], [5, 10, 12], [11, 17, 12], [16, 18, 6], [6, 9, 14], [10, 15, 14], [6, 9, 16], [10, 15, 16], [8, 11, 8]]

// funciones
const wallsGeneratorC = function () {
  for (let i = 0; i < arrR.length; i++) {
    let cuenta = arrR[i][0]
    for (let j = arrR[i][0]; j < arrR[i][1]; j++) {
      const rowSelect = document.querySelector(`.row${cuenta + 1}`)
      const colSelect = rowSelect.querySelector(`.col${arrR[i][2] + 1}`)
      colSelect.classList.add('walls')
      board[cuenta][arrR[i][2]] = 1
      cuenta++
    }
  }
}
const wallsGeneratorR = function () {
  for (let i = 0; i < arrC.length; i++) {
    let cuenta = arrC[i][0]
    for (let j = arrC[i][0]; j < arrC[i][1]; j++) {
      const rowSelect = document.querySelector(`.row${arrC[i][2] + 1}`)
      const colSelect = rowSelect.querySelector(`.col${cuenta + 1}`)
      colSelect.classList.add('walls')
      board[arrC[i][2]][cuenta] = 1
      cuenta++
    }
  }
}
const coinGenerator = function () {
  let moneyTotal = 0
  board.forEach(function (row, r) {
    newBoard.push(row.map(function (col, c) {
      if (col === 0) {
        moneyTotal++
        return col + 3
      } else {
        return col
      }
    }))
  })
  moneyTotal-- // restamos la posicion de inicio de thief
  // board = newBoard
}
wallsGeneratorR()
wallsGeneratorC()
coinGenerator()

const changeDirection = function (code) {
  if (code === 'ArrowUp') thief.direction = 1
  if (code === 'ArrowRight') thief.direction = 2
  if (code === 'ArrowDown') thief.direction = 3
  if (code === 'ArrowLeft') thief.direction = 4
}
// 0 = path 1 = wall 2 = thief 3 = money 4 = ghost
const printBoard = function () {
  board.forEach(function (row, r) {
    row.forEach(function (col, c) {
      const rowSelect = document.querySelector(`.row${r + 1}`)
      const colSelect = rowSelect.querySelector(`.col${c + 1}`)
      if (board[r][c] === 2) {
        colSelect.classList.add('thief')
        colSelect.classList.remove('money', 'ghost')
      } else if (board[r][c] === 0) {
        colSelect.classList.remove('thief', 'money', 'ghost')
      } else if (board[r][c] === 3) {
        colSelect.classList.add('money')
        colSelect.classList.remove('ghost', 'thief')
      } else if (board[r][c] === 4) {
        colSelect.classList.add('ghost')
        colSelect.classList.remove('thief', 'money')
      }
    })
  })
}

const checkCell = function (colisionUp, colisionRight, colisionDown, colisionLeft, ghost) {
  const freePos = []
  if (colisionUp !== 1) {
    freePos.push(1)
  }
  if (colisionDown !== 1) {
    freePos.push(3)
  }
  if (colisionRight !== 1) {
    freePos.push(2)
  }
  if (colisionLeft !== 1) {
    freePos.push(4)
  }

  if (ghost.contCell !== 4) {
    ghost.contCell++
    for (let i = 0; i < freePos.length; i++) {
      if (ghost.direction === freePos[i]) return freePos[i]
    }
  } else {
    const indexRandom = Math.random() * (freePos.length)
    const indexFloor = Math.floor(indexRandom)
    ghost.contCell = 0
    return freePos[indexFloor]
  }
}

const colisionUpGhost = function (colisionUp, ghost) {
  if (board[ghost.posy - 1][ghost.posx] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  } else {
    board[ghost.posy][ghost.posx] = ghost.nextCell
    ghost.nextCell = colisionUp === 4 ? ghost.nextCell : colisionUp
    ghost.posy--
  }
}
const colisionRightGhost = function (colisionRight, ghost) {
  if (board[ghost.posy][ghost.posx + 1] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  } else {
    board[ghost.posy][ghost.posx] = ghost.nextCell
    ghost.nextCell = colisionRight === 4 ? ghost.nextCell : colisionRight
    ghost.posx++
  }
}
const colisionDownGhost = function (colisionDown, ghost) {
  if (board[ghost.posy + 1][ghost.posx] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  } else {
    board[ghost.posy][ghost.posx] = ghost.nextCell
    ghost.nextCell = colisionDown === 4 ? ghost.nextCell : colisionDown
    ghost.posy++
  }
}
const colisionLeftGhost = function (colisionLeft, ghost) {
  if (board[ghost.posy][ghost.posx - 1] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  } else {
    board[ghost.posy][ghost.posx] = ghost.nextCell
    ghost.nextCell = colisionLeft === 4 ? ghost.nextCell : colisionLeft
    ghost.posx--
  }
}
const moveGhost = function (ghost) {
  const colisionUp = board[ghost.posy - 1][ghost.posx]
  const colisionRight = board[ghost.posy][ghost.posx + 1]
  const colisionDown = board[ghost.posy + 1][ghost.posx]
  const colisionLeft = board[ghost.posy][ghost.posx - 1]

  ghost.direction = checkCell(colisionUp, colisionRight, colisionDown, colisionLeft, ghost)
  // 1-up, 2-right, 3-down, 4-left
  if (ghost.direction === 1 && colisionUp !== 1) {
    colisionUpGhost(colisionUp, ghost)
  } else if (ghost.direction === 2 && colisionRight !== 1) {
    colisionRightGhost(colisionRight, ghost)
  } else if (ghost.direction === 3 && colisionDown !== 1) {
    colisionDownGhost(colisionDown, ghost)
  } else if (ghost.direction === 4 && colisionLeft !== 1) {
    colisionLeftGhost(colisionLeft, ghost)
  }
  board[ghost.posy][ghost.posx] = 4
}

const moveThiefUp = function (colisionUp) {
  if (colisionUp === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  }
  if (colisionUp === 3) {
    moneyCounter++
    board[thief.posy][thief.posx] = 0
    thief.posy--
  }
  if (colisionUp === 0) {
    board[thief.posy][thief.posx] = 0
    thief.posy--
  }
}
const moveThiefRight = function (colisionRight) {
  if (colisionRight === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  }
  if (colisionRight === 3) {
    moneyCounter++
    board[thief.posy][thief.posx] = 0
    thief.posx++
  }
  if (colisionRight === 0) {
    board[thief.posy][thief.posx] = 0
    thief.posx++
  }
}
const moveThiefDown = function (colisionDown) {
  if (colisionDown === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  }
  if (colisionDown === 3) {
    moneyCounter++
    board[thief.posy][thief.posx] = 0
    thief.posy++
  }
  if (colisionDown === 0) {
    board[thief.posy][thief.posx] = 0
    thief.posy++
  }
}
const moveThiefLeft = function (colisionLeft) {
  if (colisionLeft === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionGhost()
  }
  if (colisionLeft === 3) {
    moneyCounter++
    board[thief.posy][thief.posx] = 0
    thief.posx--
  }
  if (colisionLeft === 0) {
    board[thief.posy][thief.posx] = 0
    thief.posx--
  }
}

const moveThief = function () {
  // 1-up, 2-right, 3-down, 4-left
  const colisionUp = board[thief.posy - 1][thief.posx]
  const colisionRight = board[thief.posy][thief.posx + 1]
  const colisionDown = board[thief.posy + 1][thief.posx]
  const colisionLeft = board[thief.posy][thief.posx - 1]
  if (thief.direction === 1 && colisionUp !== 1) {
    moveThiefUp(colisionUp)
  } else if (thief.direction === 2 && colisionRight !== 1) {
    moveThiefRight(colisionRight)
  } else if (thief.direction === 3 && colisionDown !== 1) {
    moveThiefDown(colisionDown)
  } else if (thief.direction === 4 && colisionLeft !== 1) {
    moveThiefLeft(colisionLeft)
  }
  board[thief.posy][thief.posx] = 2
}
const winCondition = function () {
  document.getElementById('moneyCounter').innerText = moneyCounter
  if (moneyCounter === 20 && lvl === 3) {
    clearInterval(interval)
    let modal = document.getElementById('myModalWin')
    let span = document.getElementsByClassName('close')[0]
    modal.style.display = 'block'
    let audioWin = new Audio('src/assets/sounds/victoria.mp3')
    audio.pause()
    audioWin.play()
    lvl = 1
  }
}
const winLvl = function () {
  if (moneyCounter === 20 && lvl < 3) {
    lvl++
    let lvlGame = document.getElementById('lvl')
    lvlGame.innerText = lvl
    speed -= lvl * 10
    level()
  }
}
const loseCondition = function () {
  document.getElementById('lifeCounter').innerText = lifesCounter
  if (lifesCounter === 0) {
    clearInterval(interval)
    let modal = document.getElementById('myModalGameOver')
    let span = document.getElementsByClassName('close')[0]
    modal.style.display = 'block'
    let audioGameOver = new Audio('src/assets/sounds/gameover.mp3')
    audio.pause()
    audioGameOver.play()
  }
}

window.addEventListener('keydown', function (e) {
  changeDirection(e.code)
})

let closeWindow = document.getElementById('closeWindowGameOver')
closeWindow.addEventListener('click', function () {
  modal = document.getElementById('myModalGameOver')
  modal.style.display = "none";
})

let closeWindowWin = document.getElementById('closeWindowWin')
closeWindowWin.addEventListener('click', function () {
  modal = document.getElementById('myModalWin')
  modal.style.display = "none";
})

function fillBoard() {
  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      board[i][j] = newBoard[i][j]
    }
  }
}

const defaultValues = function () {
  if (lifesCounter <= 0) {
    lvl = 1
    speed = 300
  }
  ghost1.posx = 1
  ghost1.posy = 1
  ghost2.posx = 1
  ghost2.posy = 17
  ghost3.posx = 17
  ghost3.posy = 17
  ghost4.posx = 17
  ghost4.posy = 1
  ghost1.contCell = 0
  ghost2.contCell = 0
  ghost3.contCell = 0
  ghost4.contCell = 0
  moneyCounter = 0
  lifesCounter = 2
  thief.posy = POSY
  thief.posx = POSX
  thief.direction = -1
}
function level () {
  defaultValues()
  fillBoard()
  clearInterval(interval)
  interval = setInterval(game, speed)
}
function startGame () {
  let lvlGame = document.getElementById('lvl')
  lvlGame.innerText = 1
  defaultValues()
  fillBoard()
  clearInterval(interval)
  audio.play()
  interval = setInterval(game, speed)
}
// ejecucion del juego
const game = function () {
  moveThief()
  moveGhost(ghost1)
  moveGhost(ghost2)
  moveGhost(ghost3)
  moveGhost(ghost4)
  winLvl()
  winCondition()
  loseCondition()
  printBoard()
}

const btnStartGame = document.getElementById('btnPlay')
btnStartGame.addEventListener('click', startGame)

function soundColisionGhost() {
  const audioColisionGhost = new Audio('src/assets/sounds/choquefantasma.mp3')
  audioColisionGhost.play()
}
window.onload = function () {
  const windowIni = document.getElementById('modalIniGame')
  const tableGame = document.getElementsByTagName('table')[0]
  tableGame.style.display = 'none'
  windowIni.style.display = 'block'
  setTimeout(function () {
    windowIni.style.display = 'none'
    tableGame.style.display = 'inline-block'
  }, 3000)
}