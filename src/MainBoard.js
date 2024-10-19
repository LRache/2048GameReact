import "./MainBoard.css"
import {ScoreLabel} from "./ScoreLabel"
import {useState} from "react";
import NewGameButton from "./NewGameButton";
import GameBoard from "./GameBoard";

function MainBoard() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)

    const [newGameTriggerred, setNewGameTriggerred] = useState(false)
    
    function handleNewGame() {
        setNewGameTriggerred(true)
    }

    function handleNewGameFinished() {
        setNewGameTriggerred(false)
    }
    
    function handleSetScore(newScore) {
        setScore(newScore)
        if (newScore > bestScore) {
            setBestScore(newScore)
        }
    }

    return (
        <div className="mainBoard">
            <div className="topBox">
                <div className="title">2048Game</div>
                <div className="rightTopBox">
                    <ScoreLabel score={score} bestScore={bestScore}/>
                    <NewGameButton handleNewGame={handleNewGame}/>
                </div>
            </div>
            <GameBoard
                newGameTriggerred={newGameTriggerred}
                onNewGameFinished={handleNewGameFinished}
                onSetScore={handleSetScore}
            />
        </div>
    )
}

export default MainBoard;
