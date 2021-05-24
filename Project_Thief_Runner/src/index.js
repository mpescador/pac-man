let board = Array(19).fill(0).map(() => Array(19).fill(0))
const Thief = function () {
  this.posx = 9
  this.posy = 9
  this.direction = 1 // 1-up, 2-right, 3-down, 4-left

}
let moneyCounter = 0
const thief = new Thief()
const arrR = [[0, 19, 0], [0, 19, 18], [0,4,2], [5,17,2], [3,5,4], [0,11,16], [3,5,13], [6,11,4], [6,11,14], [12,16,4], [12,16,15], [8,11,6], [8,11,12] ]
const arrC = [[0, 19, 0], [0, 19, 18], [6,12,2], [5,13,4], [5,14,6], [7,12,10], [5,15,12], [6,14,14], [6,14,16]]
board[8][3] = 3


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
const changeDirection = function (code) {
  if (code === 'ArrowUp') this.direction = 1
  if (code === 'ArrowRight') this.direction = 2
  if (code === 'ArrowDown') this.direction = 3
  if (code === 'ArrowLeft') this.direction = 4
}
// 0 = path 1 = wall 2 = thief 3 = money
const printBoard = function () {
  board.forEach(function (row, r) {
    row.forEach(function (col, c) {
      const rowSelect = document.querySelector(`.row${r + 1}`)
      const colSelect = rowSelect.querySelector(`.col${c + 1}`)
      if (board[r][c] === 2) {
        colSelect.classList.add('thief')
      } else if (board[r][c] === 0) {
        colSelect.classList.remove('thief', 'money')
      }
      else if (board[r][c] === 3) {
        colSelect.classList.add('money')
      }
    })
  })
}

const moveThief = function () {
  // 1-up, 2-right, 3-down, 4-left
  if (this.direction === 1 && board[thief.posy - 1][thief.posx] !== 1) {
    if (board[thief.posy - 1][thief.posx] === 3) {
      moneyCounter++
    }
    board[thief.posy][thief.posx] = 0
    thief.posy--
  } else if (this.direction === 2 && board[thief.posy][thief.posx + 1] !== 1) {
    if (board[thief.posy][thief.posx + 1] === 3) {
      moneyCounter++
    }
    board[thief.posy][thief.posx] = 0
    thief.posx++
  } else if (this.direction === 3 && board[thief.posy + 1][thief.posx] !== 1) {
    if (board[thief.posy + 1][thief.posx] === 3) {
      moneyCounter++
    }
    board[thief.posy][thief.posx] = 0
    thief.posy++
  } else if (this.direction === 4 && board[thief.posy][thief.posx - 1] !== 1) {
    if (board[thief.posy][thief.posx - 1] === 3) {
      moneyCounter++
    }
    board[thief.posy][thief.posx] = 0
    thief.posx--
  }
  document.getElementById('moneyCounter').innerText = moneyCounter
  board[thief.posy][thief.posx] = 2
}

const game = function () {
  moveThief()
  printBoard()
}

// ejecucion del juego

setInterval(game, 200)

window.addEventListener('keydown', function (e) {
  changeDirection(e.code)
})

wallsGeneratorR()
wallsGeneratorC()
let newBoard = []

board.forEach(function (row, r) {
  newBoard.push(row.map(function (col, c) {
    if (col === 0) {
      return col + 3
    } else {
      return col
    }
  }))
})
board = newBoard
console.log(board)