const board = Array(19).fill(0).map(() => Array(19).fill(0))
console.log(board)
const Thief = function () {
  this.posx = 9
  this.posy = 9
  this.direction = 1 // 1-up, 2-right, 3-down, 4-left
}

const thief = new Thief()
const arrR = [[18, 19, 1], [5, 9, 2]]
const arrC = [[4,8,1],[6,12,4]]

// funciones
const wallsGeneratorR = function () {
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
const wallsGeneratorC = function () {
  for (let i = 0; i < arrC.length; i++) {
    let cuenta = arrC[i][0]
    console.log(arrC)
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
// 0 = path 1 = wall 2 = thief
const printBoard = function () {
  board.forEach(function (row, r) {
    row.forEach(function (col, c) {
      const rowSelect = document.querySelector(`.row${r + 1}`)
      const colSelect = rowSelect.querySelector(`.col${c + 1}`)
      if (board[r][c] === 2) {
        colSelect.classList.add('thief')
      } else if (board[r][c] === 0) {
        colSelect.classList.remove('thief')
      }
    })
  })
}

const moveThief = function () {
  // 1-up, 2-right, 3-down, 4-left
  if (this.direction === 1 && board[thief.posy - 1][thief.posx] !== 1) {
    console.log(board[thief.posy - 1][thief.posx])
    board[thief.posy][thief.posx] = 0
    thief.posy--
  } else if (this.direction === 2 && board[thief.posy][thief.posx + 1] !== 1) {
    board[thief.posy][thief.posx] = 0
    thief.posx++
  } else if (this.direction === 3 && board[thief.posy + 1][thief.posx] !== 1) {
    board[thief.posy][thief.posx] = 0
    thief.posy++
  } else if (this.direction === 4 && board[thief.posy][thief.posx - 1] !== 1) {
    board[thief.posy][thief.posx] = 0
    thief.posx--
  }
  board[thief.posy][thief.posx] = 2
}

const game = function () {
  moveThief()
  printBoard()
  console.log(thief.posy)
}

// ejecucion del juego

setInterval(game, 600)

window.addEventListener('keydown', function (e) {
  changeDirection(e.code)
})

wallsGeneratorR()
wallsGeneratorC()