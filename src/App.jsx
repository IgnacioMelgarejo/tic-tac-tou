/* eslint-disable react/prop-types */
import { useState } from 'react'
import './App.css'
import confetti from "canvas-confetti"


/*
Representan la x y la o correspondientes en el juego
*/
const TURNS = {
  X: "×",
  O: "o"
}

/*
Square: representa el tablero, es cada una de las posiciones dentro del board.Este tiene 4 argumentos que seran pasados como props.
children: es el valor que tendra dentro cada cuadrado en el tablero, que puede ser x u o.
isSelected: indica si el casillero correspondiente es seleccionado.
updateBoard: su funcionalidad es actualizar el tablero.
index:indica el indice del casillero presionado.
handleClick: dependiendo de un evento, en este caso un (onClick) ejecuta la funcion actualizadora "upDateBoard".
 */
const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected ' : ''} `

  const handleClick = () => {
    updateBoard(index)
  }

  return (<div onClick={handleClick} className={className}>
    {children}


  </div>)
}
/*
WINNER_COMBOS: representa todos los combos ganadores que puede haber en la partida 
 */
const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]


function App() {

  /*
  board: como estado inicial llenará cada posición del tablero con un el valor null y este se volverá a renderizar cada vez que cambie algún valor. 
  setBoard: dependiendo un parametro, el cúal sera el indice correspondiente del casillero presionado, cambiara el el estado de éste a X u O dependiendo el turno. 
  */
  const [board, setBoard] = useState(Array(9).fill(null))

  /*
  turns: representara el valor del turno actual que inicialmente sera "TURNS.X"
  setTurn: seteara el turno haciedno un toggle entre X e O 
   */
  const [turn, setTurn] = useState(TURNS.X)
  /* null es que no hay un ganador y false es que hay un empate */
  const [winner, setWinner] = useState(null)

  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]) {
        return boardToCheck[a]
      }

    }
    return null
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)// si todas las posiciones son diferentes a null, significa que termino el juego 
  }

  /*
  updateBoard: función cuyo fin es actualizar el estado del casillero presionado. El cual recibe por parametro el indice del casillero.
  Explicación: Dentro de "newBoard" guardaremos el tablero completo, luego le setearemos el valor que haya dentro de turn, que en el primer caso será "x" y luego utilizamos "setBoard" para renderizar el tablero en la aplicación con el nuevo valor. 
  Por último, mediante el operador ternario, si el último valor fue "x", éste sera cambiado a "o", se guardará en la variable "newTurn" y seteara su valor.
  La finalidad del "newBoard" es para no sobrescribir el board, ya que este y cualquier estado debe permanecer inmutable
  */
  const updateBoard = (index) => {

    if (board[index] || winner) return// si en el indice hay algo no se actualiza.Esto evita que se sobrescriba al presionar nuevamente.
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    console.log(newTurn);
    setTurn(newTurn)
    // revisar si hay un ganador 
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }


  return (
    <main className='board'>
      <h1>Ulises se la come doblada</h1>

      <button onClick={resetGame}>Resetear juego</button>

      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })}

      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}> {TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}> {TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className='winner'>
          <div className='text'>
            <h2>
              {
                winner === false
                  ? "Empate"
                  : "Ganó"
              }
            </h2>
            <header className='win'>
              {winner && <Square>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>

        </section>
      )}
    </main>
  )

}

export default App
