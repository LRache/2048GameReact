import "./MainBoard.css"
import {ScoreLabel} from "./ScoreLabel"
import {useEffect, useState} from "react";
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
        setBestScore((prev) => prev < newScore ? newScore : prev)
    }

    useEffect(() => {
        function handleBeforeUnload() {
            window.localStorage.setItem("2048GameBest", bestScore.toString())
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [bestScore])

    useEffect(() => {
        const l = window.localStorage.getItem("2048GameBest")
        let bs = 0
        if (l !== null) {
            bs = parseInt(l)
        }
        setBestScore(bs)
    }, [])

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
            <div className="bottomNote">
                2048Game demo by <i>Freedom</i>
            </div>
        </div>
    )
}

export default MainBoard;
