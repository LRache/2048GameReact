import "./MainBoard.css"
import {ScoreLabel} from "./ScoreLabel"
import {useEffect, useState} from "react";
import NewGameButton from "./NewGameButton";
import GameBoard from "./GameBoard";

function random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function random_spawn_number(numbers) {
    let t = random_int(0, 16)
    while (numbers[t] !== 0) {
        t = random_int(0, 16)
    }
    numbers[t] = Math.pow(2, random_int(1, 3))
    return t
}

function MainBoard() {
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [numbers, setNumbers] = useState(Array(16).fill(0))

    const [spawnAnimation, setSpawnAnimation] = useState([])
    
    function onNewGame() {
        if (score > bestScore) {
            setBestScore(score)
        }
        let newNumbers = Array(16).fill(0)
        const loc1 = random_spawn_number(newNumbers)
        const loc2 = random_spawn_number(newNumbers)
        setNumbers(newNumbers)
        setSpawnAnimation([loc1, loc2])
    }

    useEffect(() => {
        onNewGame()
    }, []);

    return (
        <div className="mainBoard">
            <div className="topBox">
                <div className="title">2048Game</div>
                <div className="rightTopBox">
                    <ScoreLabel score={score} bestScore={bestScore}/>
                    <NewGameButton handleNewGame={onNewGame}/>
                </div>
            </div>
            <GameBoard numbers={numbers} spawnAnimation={spawnAnimation}/>
        </div>
    )
}

export default MainBoard;
