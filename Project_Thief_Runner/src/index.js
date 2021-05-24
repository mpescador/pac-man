const board = Array(19).fill(1).map(() => Array(19).fill(1))
console.log(board)
const Thief = function () {
  this.posx = 9
  this.posy = 9
  this.direction = 1 // 1-up, 2-right, 3-down, 4-left
}

const thief = new Thief()

// funciones
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
  board[thief.posx][thief.posy] = 0
  if (this.direction === 1) { thief.posx--}
  else if (this.direction === 2) { thief.posy++ }
  else if (this.direction === 3) { thief.posx++ }
  else if (this.direction === 4) { thief.posy-- }
  board[thief.posx][thief.posy] = 2
}

const game = function () {
  printBoard()
  moveThief()
  console.log(thief.posy)
}

// ejecucion del juego

setInterval(game, 1000)

window.addEventListener('keydown', function (e) {
  changeDirection(e.code)
})
