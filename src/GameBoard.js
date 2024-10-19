import "./GameBoard.css"
import GameBlock from "./GameBlock"
import {SpawnAnimationBlock} from "./GameBlock";
import {useEffect, useState} from "react";

function random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let numbers = Array(16).fill(0)
function random_spawn_number() {
    let t = random_int(0, 16)
    while (numbers[t] !== 0) {
        t = random_int(0, 16)
    }
    numbers[t] = Math.pow(2, random_int(1, 3))
    return t
}

let isMerged = Array(16).fill(false)
let spawnAnimation = []
let moveAnimation = []
function move_init() {
    isMerged = Array(16).fill(false)
    spawnAnimation = []
    moveAnimation = []
}

function try_merge(fr, fc, tr, tc) {
    if (isMerged[tr * 4 + tc]) {
        return 0
    }
    if (numbers[fr * 4 + fc] === numbers[tr * 4 + tc]) {
        numbers[tr * 4 + tc] *= 2
        numbers[fr * 4 + fc] = 0
        isMerged[tr * 4 + tc] = true
        return numbers[tr * 4 + tc] *= 2
    } else {
        return 0
    }
}

function move_number(fr, fc, tr, tc) {
    if (fr === tr && fc === tc) {return}
    numbers[tr * 4 + tc] = numbers[fr * 4 + fc]
    numbers[fr * 4 + fc] = 0
}

function move_up() {
    move_init()

    let incScore = 0
    for (let row = 1; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (numbers[row * 4 + col] === 0) { continue }

            let tr = row - 1
            while (tr >= 0 && numbers[tr * 4 + col] === 0) { tr-- }

            if (tr === -1) {
                move_number(row, col, 0, col)
            } else {
                let s = try_merge(row, col, tr, col)
                if (s === 0) {
                    tr ++
                    move_number(row, col, tr + 1, col)
                } else (
                    incScore += s
                )
            }
        }
    }
    return incScore
}

function GameBoard({newGameTriggerred, onNewGameFinished, onSetScore, initScore}) {
    const [numberState, setNumberState] = useState(Array(16).fill(0))
    const [spawnNumberAnimationArray, setSpawnNumberAnimationArray] = useState([])
    let score = initScore

    function new_game() {
        numbers = Array(16).fill(0)
        const t = []
        t.push(random_spawn_number())
        t.push(random_spawn_number())
        setNumberState(numbers)
        setSpawnNumberAnimationArray(t)
        onSetScore(0)
        score = 0
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowUp") {
            move_up()
            setNumberState(numbers)
            console.log(numbers)
        }
    }

    useEffect(() =>{
        new_game()
        document.addEventListener("keydown", handleKeyDown, false)
        return ()=>{
            document.removeEventListener("keydown", handleKeyDown, false)
        }
    }, [])

    useEffect(() => {
        if (newGameTriggerred) {
            new_game()
        }
        onNewGameFinished()
    }, [newGameTriggerred])

    const blocks = numberState.map(
        (n, index) => <GameBlock
            number = {n}
            index  = {index}
            key    = {"block" + index}
        />
    )

    spawnNumberAnimationArray.forEach((a) => {blocks.push(
        <SpawnAnimationBlock
            number = {numberState[a]}
            index  = {a}
            key    = {"spawnAnimationBlock" + a}
            onExited={() => {
                let t = spawnNumberAnimationArray.filter((x) => x !== a)
                setSpawnNumberAnimationArray(t)
            }}
        />
    )})

    return (
        <div className="game-board" onKeyDown={handleKeyDown}>
            {blocks}
        </div>
    )
}

export default GameBoard;
