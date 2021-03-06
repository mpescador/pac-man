let board = Array(19).fill(0).map(() => Array(19).fill(0))
const Thief = function () {
  this.posx = 9
  this.posy = 8
  this.direction = -1 // 1-up, 2-right, 3-down, 4-left
}
const Cop = function (x, y) {
  this.posx = x
  this.posy = y
  this.direction = 1
  this.initx = x
  this.inity = y
  this.nextCell = 3
  this.contCell = 0
}
const POSX = 9
const POSY = 8
let moneyCounter = 0
let lifesCounter = 2
let newBoard = []
const audio = new Audio('src/assets/sounds/music1.mp3')
let interval
const thief = new Thief()
const cop1 = new Cop(1, 1)
const cop2 = new Cop(1, 17)
const cop3 = new Cop(17, 17)
const cop4 = new Cop(17, 1)
//const cop5 = new Cop(16, 1)
let lvl = 1
let speed = 300

const arrR = [[0, 19, 0], [0, 19, 18], [2, 6, 2], [8, 11, 2], [8, 11, 4], [8, 11, 6], [13, 16, 6], [12, 13, 5], [15, 16, 5], [13, 16, 4], [2, 6, 9], [2, 6, 13], [7, 11, 9], [7, 11, 13], [12, 17, 9], [2, 17, 15], [5, 14, 16], [8, 11, 17]]
const arrC = [[0, 7, 0], [8, 19, 0], [0, 7, 18], [8, 18, 18], [3, 7, 2], [3, 5, 5], [2, 7, 7], [2, 7, 12], [9, 14, 2], [9, 14, 5], [9, 14, 7], [9, 14, 10], [9, 14, 14], [4, 7, 4]]

const arrR2 = [[0, 19, 0], [0, 19, 18], [2, 5, 2], [6, 10, 2], [11, 17, 2], [2, 5, 4], [0, 5, 16], [8, 11, 16], [2, 5, 14], [6, 11, 4], [8, 11, 14], [12, 17, 4], [14, 17, 16], [8, 11, 6], [8, 11, 12]]
const arrC2 = [[0, 19, 0], [0, 19, 18], [6, 9, 2], [10, 13, 2], [5, 9, 4], [10, 13, 4], [5, 8, 6], [9, 15, 6], [7, 12, 10], [5, 10, 12], [11, 17, 12], [16, 18, 6], [6, 9, 14], [10, 15, 14], [6, 9, 16], [10, 15, 16], [8, 11, 8]]

const arrR3 = [[0, 19, 0], [0, 19, 18], [6, 9, 2], [10, 13, 2], [5, 9, 4], [10, 13, 4], [5, 8, 6], [9, 15, 6], [7, 12, 10], [5, 10, 12], [11, 17, 12], [16, 18, 6], [6, 9, 14], [10, 15, 14], [6, 9, 16], [10, 15, 16]]
const arrC3 = [[0, 19, 0], [0, 19, 18], [2, 5, 2], [6, 10, 2], [11, 17, 2], [2, 5, 4], [0, 5, 16], [8, 11, 16], [2, 5, 14], [6, 11, 4], [8, 11, 14], [12, 17, 4], [14, 17, 16], [8, 11, 6], [8, 11, 12]]

// funciones
const wallsGeneratorC = function (arrR) {
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
const wallsGeneratorR = function (arrC) {
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

const changeDirection = function (code) {
  if (code === 'ArrowUp') thief.direction = 1
  if (code === 'ArrowRight') thief.direction = 2
  if (code === 'ArrowDown') thief.direction = 3
  if (code === 'ArrowLeft') thief.direction = 4
}
// 0 = path 1 = wall 2 = thief 3 = money 4 = cop
const printBoard = function () {
  board.forEach(function (row, r) {
    row.forEach(function (col, c) {
      const rowSelect = document.querySelector(`.row${r + 1}`)
      const colSelect = rowSelect.querySelector(`.col${c + 1}`)
      if (board[r][c] === 2) {
        colSelect.classList.add('thief')
        colSelect.classList.remove('money', 'cop')
      } else if (board[r][c] === 0) {
        colSelect.classList.remove('thief', 'money', 'cop', 'walls')
      } else if (board[r][c] === 3) {
        colSelect.classList.add('money')
        colSelect.classList.remove('cop', 'thief', 'walls')
      } else if (board[r][c] === 4) {
        colSelect.classList.add('cop')
        colSelect.classList.remove('thief', 'money')
      } else if (board[r][c] === 1) {
        colSelect.classList.add('walls')
        colSelect.classList.remove('money', 'thief', 'cop')
      }
    })
  })
}

const checkCell = function (colisionUp, colisionRight, colisionDown, colisionLeft, cop) {
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

  if (cop.contCell !== 3) {
    cop.contCell++
    for (let i = 0; i < freePos.length; i++) {
      if (cop.direction === freePos[i]) return freePos[i]
    }
  } else {
    const indexRandom = Math.random() * (freePos.length)
    const indexFloor = Math.floor(indexRandom)
    cop.contCell = 0
    return freePos[indexFloor]
  }
}

const colisionUpCop = function (colisionUp, cop) {
  if (board[cop.posy - 1][cop.posx] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
  } else {
    board[cop.posy][cop.posx] = cop.nextCell
    cop.nextCell = colisionUp === 4 ? cop.nextCell : colisionUp
    cop.posy--
  }
}
const colisionRightCop = function (colisionRight, cop) {
  if (board[cop.posy][cop.posx + 1] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
  } else {
    board[cop.posy][cop.posx] = cop.nextCell
    cop.nextCell = colisionRight === 4 ? cop.nextCell : colisionRight
    cop.posx++
  }
  if (cop.posx === 18 && cop.posy === 7) {
    console.log('if2')
    board[cop.posy][cop.posx] = 0
    cop.posx = 0
    cop.posy = 7
  }
}
const colisionDownCop = function (colisionDown, cop) {
  if (board[cop.posy + 1][cop.posx] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
  } else {
    board[cop.posy][cop.posx] = cop.nextCell
    cop.nextCell = colisionDown === 4 ? cop.nextCell : colisionDown
    cop.posy++
  }
}
const colisionLeftCop = function (colisionLeft, cop) {
  if (board[cop.posy][cop.posx - 1] === 2) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
  } else {
    board[cop.posy][cop.posx] = cop.nextCell
    cop.nextCell = colisionLeft === 4 ? cop.nextCell : colisionLeft
    cop.posx--
  }
  if (cop.posx === 0 && cop.posy === 7) {
    console.log(board)
    board[cop.posy][cop.posx] = 0
    cop.posx = 18
    cop.posy = 7
  }
}
const moveCop = function (cop) {
  const colisionUp = board[cop.posy - 1][cop.posx]
  const colisionRight = board[cop.posy][cop.posx + 1]
  const colisionDown = board[cop.posy + 1][cop.posx]
  const colisionLeft = board[cop.posy][cop.posx - 1]

  cop.direction = checkCell(colisionUp, colisionRight, colisionDown, colisionLeft, cop)
  // 1-up, 2-right, 3-down, 4-left
  if (cop.direction === 1 && colisionUp !== 1) {
    colisionUpCop(colisionUp, cop)
  } else if (cop.direction === 2 && colisionRight !== 1) {
    colisionRightCop(colisionRight, cop)
  } else if (cop.direction === 3 && colisionDown !== 1) {
    colisionDownCop(colisionDown, cop)
  } else if (cop.direction === 4 && colisionLeft !== 1) {
    colisionLeftCop(colisionLeft, cop)
  }
  board[cop.posy][cop.posx] = 4
}

const moveThiefUp = function (colisionUp) {
  if (colisionUp === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
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
    soundColisionCop()
  }
  if (colisionRight === 3) {
    moneyCounter++
    board[thief.posy][thief.posx] = 0
    thief.posx++
  }
  if (colisionRight === 0) {
    console.log('if1')
    board[thief.posy][thief.posx] = 0
    thief.posx++
  }
  if (thief.posx === 18 && thief.posy === 7) {
    console.log('if2')
    board[thief.posy][thief.posx] = 0
    thief.posx = 0
    thief.posy = 7
  }
}
const moveThiefDown = function (colisionDown) {
  if (colisionDown === 4) {
    lifesCounter--
    board[thief.posy][thief.posx] = 0
    thief.posy = POSY
    thief.posx = POSX
    thief.direction = -1
    soundColisionCop()
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
    soundColisionCop()
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
  if (thief.posx === 0 && thief.posy === 7) {
    console.log(board)
    board[thief.posy][thief.posx] = 0
    thief.posx = 18
    thief.posy = 7
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
    modal.style.display = 'block'
    const audioWin = new Audio('src/assets/sounds/victoria.mp3')
    audio.pause()
    audioWin.play()
    lvl = 1
    speed = 300
    newBoard = []
    board = Array(19).fill(0).map(() => Array(19).fill(0))
  }
}
const winLvl = function () {
  if (moneyCounter === 20 && lvl < 3) {
    lvl++
    let lvlGame = document.getElementById('lvl')
    lvlGame.innerText = lvl
    speed -= lvl * 50
    newBoard = []
    board = Array(19).fill(0).map(() => Array(19).fill(0))
    if (lvl === 2) {
      level(arrR2, arrC2)
    } else {
      level(arrR3, arrC3)
    }
    const audioWin = new Audio('src/assets/sounds/level.mp3')
    audioWin.play()
  }
}
const loseCondition = function () {
  document.getElementById('lifeCounter').innerText = lifesCounter
  if (lifesCounter === 0) {
    clearInterval(interval)
    let modal = document.getElementById('myModalGameOver')
    modal.style.display = 'block'
    let audioGameOver = new Audio('src/assets/sounds/gameover.mp3')
    audio.pause()
    audioGameOver.play()
    newBoard = []
    board = Array(19).fill(0).map(() => Array(19).fill(0))
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
  cop1.posx = 1
  cop1.posy = 1
  cop2.posx = 1
  cop2.posy = 17
  cop3.posx = 17
  cop3.posy = 17
  cop4.posx = 17
  cop4.posy = 1
  cop1.contCell = 0
  cop2.contCell = 0
  cop3.contCell = 0
  cop4.contCell = 0
  moneyCounter = 0
  lifesCounter = 2

  thief.posy = POSY
  thief.posx = POSX
  thief.direction = -1
}
function level(arrrows, arrcolum) {
  defaultValues()
  wallsGeneratorR(arrrows)
  wallsGeneratorC(arrcolum)
  coinGenerator()
  fillBoard()
  clearInterval(interval)
  // transport
  board[7][18] = 0
  board[7][0] = 0
  interval = setInterval(game, speed)
}
function startGame() {

  let modal = document.getElementById('myModalGameOver')
  modal.style.display = 'none'
  let modal1 = document.getElementById('myModalWin')
  modal1.style.display = 'none'
  newBoard = []
  board = Array(19).fill(0).map(() => Array(19).fill(0))
  printBoard()
  wallsGeneratorR(arrR)
  wallsGeneratorC(arrC)
  coinGenerator()
  let lvlGame = document.getElementById('lvl')
  lvlGame.innerText = 1
  lvl = 1
  speed = 300
  defaultValues()
  fillBoard()
  board[5][14] = 0
  board[5][13] = 0
  board[11][3] = 0
  board[11][4] = 0
  board[10][3] = 0
  board[10][4] = 0
  board[12][3] = 0
  board[12][4] = 0
  board[11][8] = 0
  board[11][9] = 0
  board[10][8] = 0
  board[10][9] = 0
  board[12][8] = 0
  board[12][9] = 0
  // transport
  board[7][18] = 0
  board[7][0] = 0
  clearInterval(interval)
  audio.play()
  interval = setInterval(game, speed)
}
// ejecucion del juego
const game = function () {
  moveThief()
  moveCop(cop1)
  moveCop(cop2)
  moveCop(cop3)
  moveCop(cop4)
  winLvl()
  winCondition()
  loseCondition()
  printBoard()
}

const btnStartGame = document.getElementById('btnPlay')
btnStartGame.addEventListener('click', startGame)

function soundColisionCop() {
  const audioColisionCop = new Audio('src/assets/sounds/choquefantasma.mp3')
  audioColisionCop.play()
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
