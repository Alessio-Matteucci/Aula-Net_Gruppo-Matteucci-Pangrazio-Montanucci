import { useState, useEffect, useRef, useCallback } from 'react'

const CELL_SIZE = 20
const BOARD_WIDTH = 19
const BOARD_HEIGHT = 21

// Layout del labirinto (1=muro, 0=punto, 2=spazio vuoto, 3=pac-man, 4=fantasma)
const INITIAL_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

export default function PacManGame() {
  const [maze, setMaze] = useState(INITIAL_MAZE.map(row => [...row]))
  const [pacmanPos, setPacmanPos] = useState({ x: 9, y: 15 })
  const [ghosts, setGhosts] = useState([
    { x: 9, y: 9, color: '#FF0000', direction: 'right' },
    { x: 8, y: 9, color: '#00FFFF', direction: 'left' },
    { x: 10, y: 9, color: '#FFB8FF', direction: 'right' },
    { x: 9, y: 8, color: '#FFB8FF', direction: 'down' }
  ])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [direction, setDirection] = useState('right')
  
  const gameLoopRef = useRef(null)

  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => {
        let newX = ghost.x
        let newY = ghost.y
        
        // Movimento semplice dei fantasmi
        const directions = ['up', 'down', 'left', 'right']
        const randomDir = directions[Math.floor(Math.random() * directions.length)]
        
        switch (randomDir) {
          case 'up': newY--; break
          case 'down': newY++; break
          case 'left': newX--; break
          case 'right': newX++; break
        }
        
        // Controlla collisioni con i muri
        if (maze[newY] && maze[newY][newX] !== 1) {
          return { ...ghost, x: newX, y: newY, direction: randomDir }
        }
        
        return ghost
      })
    )
  }, [maze])

  const movePacman = useCallback(() => {
    if (gameOver) return
    
    setPacmanPos(prev => {
      let newX = prev.x
      let newY = prev.y
      
      switch (direction) {
        case 'up': newY--; break
        case 'down': newY++; break
        case 'left': newX--; break
        case 'right': newX++; break
      }
      
      // Controlla collisioni con i muri
      if (maze[newY] && maze[newY][newX] !== 1) {
        // Controlla se mangia un punto
        if (maze[newY][newX] === 0) {
          const newMaze = [...maze]
          newMaze[newY][newX] = 2
          setMaze(newMaze)
          setScore(s => s + 10)
        }
        return { x: newX, y: newY }
      }
      
      return prev
    })
  }, [direction, maze, gameOver])

  const checkCollisions = useCallback(() => {
    const collision = ghosts.some(ghost => 
      ghost.x === pacmanPos.x && ghost.y === pacmanPos.y
    )
    
    if (collision) {
      setGameOver(true)
      setGameStarted(false)
    }
  }, [ghosts, pacmanPos])

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return
    
    movePacman()
    moveGhosts()
    checkCollisions()
  }, [gameStarted, gameOver, movePacman, moveGhosts, checkCollisions])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return
      
      switch (e.key) {
        case 'ArrowUp': setDirection('up'); break
        case 'ArrowDown': setDirection('down'); break
        case 'ArrowLeft': setDirection('left'); break
        case 'ArrowRight': setDirection('right'); break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, 200)
      return () => clearInterval(gameLoopRef.current)
    }
  }, [gameStarted, gameOver, gameLoop])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setPacmanPos({ x: 9, y: 15 })
    setGhosts([
      { x: 9, y: 9, color: '#FF0000', direction: 'right' },
      { x: 8, y: 9, color: '#00FFFF', direction: 'left' },
      { x: 10, y: 9, color: '#FFB8FF', direction: 'right' },
      { x: 9, y: 8, color: '#FFB8FF', direction: 'down' }
    ])
    setMaze(INITIAL_MAZE.map(row => [...row]))
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setPacmanPos({ x: 9, y: 15 })
    setGhosts([
      { x: 9, y: 9, color: '#FF0000', direction: 'right' },
      { x: 8, y: 9, color: '#00FFFF', direction: 'left' },
      { x: 10, y: 9, color: '#FFB8FF', direction: 'right' },
      { x: 9, y: 8, color: '#FFB8FF', direction: 'down' }
    ])
    setMaze(INITIAL_MAZE.map(row => [...row]))
  }

  return (
    <div className="glass" style={{ padding: 20, textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#FFD700' }}>🎮 Pac-Man Admin Game 🎮</h3>
      
      <div style={{ marginBottom: 20 }}>
        <button 
          className="btn btn-primary" 
          onClick={gameStarted ? resetGame : startGame}
          style={{ marginRight: 10 }}
        >
          {gameStarted ? 'Riavvia' : 'Inizia Gioco'}
        </button>
        
        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#FFD700' }}>
          Punteggio: {score}
        </span>
      </div>

      {gameOver && (
        <div style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#FF0000', 
          marginBottom: 20,
          animation: 'blink 1s infinite'
        }}>
          💀 GAME OVER 💀
        </div>
      )}

      <div style={{ 
        display: 'inline-block', 
        border: '3px solid #FFD700', 
        borderRadius: 10,
        backgroundColor: '#000',
        position: 'relative'
      }}>
        <svg 
          width={BOARD_WIDTH * CELL_SIZE} 
          height={BOARD_HEIGHT * CELL_SIZE}
          style={{ display: 'block' }}
        >
          {maze.map((row, y) => 
            row.map((cell, x) => {
              if (cell === 1) {
                return (
                  <rect
                    key={`wall-${x}-${y}`}
                    x={x * CELL_SIZE}
                    y={y * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill="#0066CC"
                    stroke="#004499"
                    strokeWidth={1}
                  />
                )
              }
              if (cell === 0) {
                return (
                  <circle
                    key={`dot-${x}-${y}`}
                    cx={x * CELL_SIZE + CELL_SIZE / 2}
                    cy={y * CELL_SIZE + CELL_SIZE / 2}
                    r={2}
                    fill="#FFFF00"
                  />
                )
              }
              return null
            })
          )}

          {/* Pac-Man */}
          <circle
            cx={pacmanPos.x * CELL_SIZE + CELL_SIZE / 2}
            cy={pacmanPos.y * CELL_SIZE + CELL_SIZE / 2}
            r={CELL_SIZE / 2 - 2}
            fill="#FFFF00"
          >
            <animate
              attributeName="r"
              values={`${CELL_SIZE / 2 - 2};${CELL_SIZE / 2 - 1};${CELL_SIZE / 2 - 2}`}
              dur="0.3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Fantasmi */}
          {ghosts.map((ghost, index) => (
            <g key={`ghost-${index}`}>
              <circle
                cx={ghost.x * CELL_SIZE + CELL_SIZE / 2}
                cy={ghost.y * CELL_SIZE + CELL_SIZE / 2}
                r={CELL_SIZE / 2 - 2}
                fill={ghost.color}
              />
              <circle
                cx={ghost.x * CELL_SIZE + CELL_SIZE / 2}
                cy={ghost.y * CELL_SIZE + CELL_SIZE / 2 - 4}
                r={2}
                fill="#FFF"
              />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ marginTop: 20, fontSize: 14, color: '#888' }}>
        <strong>Controlli:</strong> Usa le frecce direzionali per muovere Pac-Man<br />
        <strong>Obiettivo:</strong> Raccogli tutti i punti senza essere catturato dai fantasmi!
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
