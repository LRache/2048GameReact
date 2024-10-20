import "./GameBoard.css"
import GameBlock, {MoveAnimationBlock, SpawnAnimationBlock} from "./GameBlock"
import {useEffect, useRef, useState} from "react";

function random_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function gen_clean_board () {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
}

let numbers = gen_clean_board()
function random_spawn_number() {
    let row = random_int(0, 4)
    let col = random_int(0, 4)
    while (numbers[row][col] !== 0) {
        row = random_int(0, 4)
        col = random_int(0, 4)
    }
    numbers[row][col] = Math.pow(2, random_int(1, 3))
    return {
        row: row,
        col: col
    }
}

let isMerged = Array(16).fill(false)
let spawnAnimationReady = []
let moveAnimation = []
function move_init() {
    isMerged = Array.from({length: 4}, () => Array(4).fill(false))
    spawnAnimationReady = []
    moveAnimation = []
}

function try_merge(fr, fc, tr, tc) {
    if (isMerged[tr][tc]) {
        return 0
    }
    if (numbers[fr][fc] === numbers[tr][tc]) {
        numbers[tr][tc] *= 2
        numbers[fr][fc] = 0
        isMerged[tr][tc] = true
        return numbers[tr][tc]
    } else {
        return 0
    }
}

function move_number(fr, fc, tr, tc) {
    numbers[tr][tc] = numbers[fr][fc]
    numbers[fr][fc] = 0
    moveAnimation.push({
        n: numbers[tr][tc],
        fr: fr,
        fc: fc,
        tr: tr,
        tc: tc,
    })
}

function move_up() {
    move_init()
    let moved = false

    let incScore = 0
    for (let row = 1; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (numbers[row][col] === 0) { continue }

            let tr = row - 1
            while (tr >= 0 && numbers[tr][col] === 0) { tr-- }

            if (tr === -1) {
                move_number(row, col, 0, col)
                moved = true
            } else {
                let s = try_merge(row, col, tr, col)
                if (s === 0) {
                    tr ++
                    if (tr !== row) {
                        move_number(row, col, tr, col)
                        moved = true
                    }
                } else {
                    incScore += s
                    moved = true
                }
            }
        }
    }
    console.log(numbers)
    return [moved, incScore]
}

function GameBoard({newGameTriggerred, onNewGameFinished, onSetScore, initScore}) {
    const [board, setBoard] = useState(gen_clean_board()) // The numbers that truly paint on the website
    const [moveAnimationArray, setMoveAnimationArray] = useState([])
    const [spawnAnimationArray, setSpawnAnimationArray] = useState([])

    // for elements key
    const moveCount = useRef(0)
    const spawnCount = useRef(0)

    function trigger_spawn_animation() {
        spawnCount.current++
        setSpawnAnimationArray(spawnAnimationReady.slice())
    }

    function trigger_move_animation() {
        moveCount.current++
        setBoard((prev) => {
            const next = structuredClone(prev)
            moveAnimation.forEach((x) => {
                next[x.fr][x.fc] = 0
            })
            return next
        })
        setMoveAnimationArray(moveAnimation.slice())
    }

    function new_game() {
        numbers = gen_clean_board()
        const t = []
        // t.push(random_spawn_number())
        // t.push(random_spawn_number())
        t.push({row: 1, col: 0})
        t.push({row: 1, col: 1})
        t.push({row: 1, col: 2})
        t.push({row: 1, col: 3})
        t.push({row: 2, col: 0})
        t.push({row: 2, col: 1})
        t.push({row: 2, col: 2})
        t.push({row: 2, col: 3})
        t.push({row: 3, col: 0})
        t.push({row: 3, col: 1})
        t.push({row: 3, col: 2})
        t.push({row: 3, col: 3})
        for (let i = 0; i < 4; i++) {
            numbers[1][i] = 2
        }
        for (let i = 0; i < 4; i++) {
            numbers[2][i] = 4
        }
        for (let i = 0; i < 4; i++) {
            numbers[3][i] = 8
        }
        spawnAnimationReady = t;
        trigger_spawn_animation()

        setBoard(gen_clean_board())
        onSetScore(0)
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowUp") {
            move_up()
            trigger_move_animation()
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
            onNewGameFinished()
        }
    }, [newGameTriggerred])

    const blocks = []
    board.forEach((row, rowIndex) => {
        row.forEach((number, colIndex) => {
            blocks.push(
                <GameBlock
                    number={number}
                    row = {rowIndex}
                    col = {colIndex}
                    key = {"GameBlock" + rowIndex + colIndex}
                />
            )
        })
    })

    function handleSpawnAnimationEnd(row, col) {
        setBoard((prev) => {
            const next = structuredClone(prev)
            next[row][col] = numbers[row][col]
            return next
        })
        setSpawnAnimationArray((prev) => {
            console.log(prev)
            return prev.filter((x) => (x.row !== row && x.col !== col))
        })
    }

    const spawnBlocks = []
    spawnAnimationArray.forEach((a) => {
        const key = "SpawnAnimationBlock" + spawnCount.current + a.row + a.col
        spawnBlocks.push(
            <SpawnAnimationBlock
                number = {numbers[a.row][a.col]}
                row    = {a.row}
                col    = {a.col}
                onEnd  = {() => handleSpawnAnimationEnd(a.row, a.col)}
                key    = {key}
            />
        )
    })

    function handleMoveAnimationEnd(tr, tc, fr, fc, num) {
        setBoard((prev) => {
            const next = structuredClone(prev)
            next[tr][tc] = numbers[tr][tc]
            next[fr][fc] = numbers[fr][fc]
            return next
        })
        setMoveAnimationArray((array) => array.filter((x) => (x.fr !== fr && x.fc !== fc)))
    }

    const moveBlocks = []
    moveAnimationArray.forEach((a) => {
        const key = "MoveAnimationBlock" + moveCount.current + a.fr + a.fc
        moveBlocks.push(
            <MoveAnimationBlock
                number = {a.n}
                fr     = {a.fr}
                fc     = {a.fc}
                tr     = {a.tr}
                tc     = {a.tc}
                onEnd  = {() => (handleMoveAnimationEnd(a.tr, a.tc, a.fr, a.fc, a.n))}
                key    = {key}
            />
        )
    })

    return (
        <div className="game-board">
            {blocks}
            {spawnBlocks}
            {moveBlocks}
        </div>
    )
}

export default GameBoard;
