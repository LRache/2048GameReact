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
let moveAnimationReady = []
function move_init() {
    isMerged = Array.from({length: 4}, () => Array(4).fill(false))
    spawnAnimationReady = []
    moveAnimationReady = []
}

function try_merge(fr, fc, tr, tc) {
    if (isMerged[tr][tc]) {
        return 0
    }
    if (numbers[fr][fc] === numbers[tr][tc]) {
        moveAnimationReady.push({
            n: numbers[fr][fc],
            fr: fr,
            fc: fc,
            tr: tr,
            tc: tc
        })
        spawnAnimationReady.push({
            row: tr,
            col: tc,
        })
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
    moveAnimationReady.push({
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
    if (moved) {
        spawnAnimationReady.push(random_spawn_number())
    }
    return [moved, incScore]
}

function move_down() {
    move_init()
    let moved = false
    let incScore = 0
    for (let row = 2; row >= 0; row--) {
        for (let col = 0; col < 4; col++) {
            if (numbers[row][col] === 0) { continue }

            let tr = row + 1
            while (tr < 4 && numbers[tr][col] === 0) { tr++ }

            if (tr === 4) {
                move_number(row, col, 3, col)
                moved = true
            } else {
                const s = try_merge(row, col, tr, col)
                if (s === 0) {
                    tr --;
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
    if (moved) {
        spawnAnimationReady.push(random_spawn_number())
    }
    return [moved, incScore]
}

function move_left() {
    move_init()
    let moved = false
    let incScore = 0
    for (let col = 1; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            if (numbers[row][col] === 0) { continue }

            let tc = col - 1
            while (tc >= 0 && numbers[row][tc] === 0) { tc-- }

            if (tc === -1) {
                move_number(row, col, row, 0)
                moved = true
            } else {
                const s = try_merge(row, col, row, tc)
                if (s === 0) {
                    tc ++
                    if (tc !== col) {
                        move_number(row, col, row, tc)
                        moved = true
                    }
                } else {
                    incScore += s
                    moved = true
                }
            }
        }
    }
    if (moved) {
        spawnAnimationReady.push(random_spawn_number())
    }
    return [moved, incScore]
}

function move_right() {
    move_init()
    let moved = false
    let incScore = 0
    for (let col = 2; col >= 0; col--) {
        for (let row = 0; row < 4; row++) {
            if (numbers[row][col] === 0) { continue }

            let tc = col + 1
            while (tc < 4 && numbers[row][tc] === 0) { tc++ }

            if (tc === 4) {
                move_number(row, col, row, 3)
                moved = true
            } else {
                const s = try_merge(row, col, row, tc)
                if (s === 0) {
                    tc --
                    if (tc !== col) {
                        move_number(row, col, row, tc)
                        moved = true
                    }
                } else {
                    incScore += s
                    moved = true
                }
            }
        }
    }
    if (moved) {
        spawnAnimationReady.push(random_spawn_number())
    }
    return [moved, incScore]
}

function is_game_end() {
    return false
}

function GameBoard({newGameTriggerred, onNewGameFinished, onSetScore}) {
    const [board, setBoard] = useState(gen_clean_board()) // The numbers that truly paint on the website
    const [moveAnimationArray, setMoveAnimationArray] = useState([])
    const [spawnAnimationArray, setSpawnAnimationArray] = useState([])

    // for elements key
    const moveCount = useRef(0)
    const spawnCount = useRef(0)
    const moveAnimationActive = useRef(false)
    const score = useRef(0)
    const undoStack = useRef([])

    function setScore(newScore) {
        score.current = newScore
        onSetScore(newScore)
    }

    function trigger_spawn_animation() {
        spawnCount.current++
        setBoard((prev) => {
            const next = structuredClone(prev)
            spawnAnimationReady.forEach((x) => {
                next[x.row][x.col] = numbers[x.row][x.col]
            })
            return next
        })
        setSpawnAnimationArray(spawnAnimationReady.slice())
    }

    function trigger_move_animation() {
        moveCount.current++
        setBoard((prev) => {
            const next = structuredClone(prev)
            moveAnimationReady.forEach((x) => {
                next[x.fr][x.fc] = 0
            })
            return next
        })
        moveAnimationActive.current = true
        setMoveAnimationArray(moveAnimationReady.slice())
    }

    function stop_animation() {
        setMoveAnimationArray((_) => [])
        setSpawnAnimationArray((_) => [])
        setBoard(structuredClone(numbers))
    }

    function new_game() {
        numbers = gen_clean_board()
        const t = []
        t.push(random_spawn_number())
        t.push(random_spawn_number())
        // for (let i = 0; i < 4; i++) {
        //     numbers[0][i] = 2
        //     t.push({row: 0, col: i})
        // }
        // for (let i = 0; i < 4; i++) {
        //     numbers[1][i] = 2
        //     t.push({row: 1, col: i})
        // }
        // for (let i = 0; i < 4; i++) {
        //     numbers[2][i] = 2
        //     t.push({row: 2, col: i})
        // }
        // for (let i = 0; i < 4; i++) {
        //     numbers[3][i] = 2
        //     t.push({row: 3, col: i})
        // }
        // let x = 1
        // for (let r = 0; r < 4; r ++) {
        //     if (r % 2 === 0) {
        //         for (let c = 0; c < 4; c++) {
        //             t.push({row: r, col: c})
        //             numbers[r][c] = Math.pow(2, x)
        //             x++
        //         }
        //     }
        //     else {
        //         for (let c = 3; c >= 0; c--) {
        //             t.push({row: r, col: c})
        //             numbers[r][c] = Math.pow(2, x)
        //             x++
        //         }
        //     }
        // }
        // numbers[0][0] = 4
        spawnAnimationReady = t;

        setBoard(gen_clean_board())
        trigger_spawn_animation()

        undoStack.current = []
        setScore(0)
    }

    function do_move(moveFun) {
        const oldBoard = structuredClone(numbers)
        const oldScore = score.current

        stop_animation()
        const [moved, incScore] = moveFun()
        if (moved) {
            undoStack.current.push([oldBoard, oldScore])
            if (undoStack.current.length === 1025) undoStack.current = undoStack.current.slice(1, 1025)
            trigger_move_animation()
        }
        setScore(score.current + incScore)
    }

    function handleKeyDown(event) {
        const mapMove = new Map([
            ["ArrowUp"   , move_up   ],
            ["ArrowDown" , move_down ],
            ["ArrowLeft" , move_left ],
            ["ArrowRight", move_right],
            ["w", move_up   ],
            ["s", move_down ],
            ["a", move_left ],
            ["d", move_right]
        ])
        const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d"]
        if (keys.includes(event.key)) {
            do_move(mapMove.get(event.key))
        } else if (event.key === "z") {
            if (undoStack.current.length !== 0) {
                const [oldBoard, oldScore] = undoStack.current.pop()
                setBoard((_) => oldBoard)
                numbers = oldBoard
                setScore(oldScore)
            }
        }
    }

    const touchDownX = useRef(0)
    const touchDownY = useRef(0)

    function handleTouchStart(event) {
        const firstTouch = event.touches[0]
        touchDownX.current = firstTouch.clientX
        touchDownY.current = firstTouch.clientY
    }

    function handleTouchMove(event) {
    }

    function handleTouchEnd(event) {
        const barrier = 75
        const firstTouch = event.changedTouches[0]
        const touchUpX = firstTouch.clientX
        const touchUpY = firstTouch.clientY
        const dx = touchUpX - touchDownX.current
        const dy = touchUpY - touchDownY.current
        const absdx = Math.abs(dx)
        const absdy = Math.abs(dy)
        if (absdx > absdy) {
            if (absdx > barrier) {
                if (dx > 0) {
                    do_move(move_right)
                } else {
                    do_move(move_left)
                }
            }
        } else {
            if (absdy > barrier) {
                if (dy > 0) {
                    do_move(move_down)
                } else {
                    do_move(move_up)
                }
            }
        }
    }

    useEffect(() => {
        function handleBeforeUnload() {
            window.localStorage.setItem("2048GameBoard", JSON.stringify([score.current, board]))
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [board])

    useEffect(() =>{
        const l = window.localStorage.getItem("2048GameBoard")
        if (l === null) {
            new_game()
        } else {
            const [s, newNumber] = JSON.parse(l)
            numbers = structuredClone(newNumber)
            const t = []
            numbers.forEach((row, rowIndex) => {
                row.forEach((num, colIndex) => {
                    if (num !== 0)  t.push({row: rowIndex, col:colIndex})
                })
            })
            spawnAnimationReady = t
            trigger_spawn_animation()
            setBoard(structuredClone(newNumber))
            setScore(s)
        }

        document.addEventListener("keydown", handleKeyDown, false)
        document.addEventListener("touchstart", handleTouchStart, false)
        document.addEventListener("touchmove", handleTouchMove, false)
        document.addEventListener("touchend", handleTouchEnd, false)
        return ()=>{
            document.removeEventListener("keydown", handleKeyDown, false)
            document.removeEventListener("touchstart", handleTouchStart, false)
            document.removeEventListener("touchmove", handleTouchMove, false)
            document.removeEventListener("touchend", handleTouchEnd, false)
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
        setSpawnAnimationArray((prev) => {
            return prev.filter((x) => (x.row !== row && x.col !== col))
        })
        setBoard((prev) => {
            const next = structuredClone(prev)
            next[row][col] = numbers[row][col]
            return next
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

    function handleMoveAnimationEnd(tr, tc, fr, fc) {
        setBoard((prev) => {
            const next = structuredClone(prev)
            next[tr][tc] = numbers[tr][tc]
            next[fr][fc] = 0
            return next
        })
        setMoveAnimationArray((array) => array.filter((x) => (x.fr !== fr && x.fc !== fc)))
    }

    useEffect(() => {
        if (moveAnimationActive && moveAnimationArray.length === 0) {
            moveAnimationActive.current = false
            trigger_spawn_animation()
        }
    }, [moveAnimationArray])

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
            {moveBlocks}
            {spawnBlocks}
        </div>
    )
}

export default GameBoard;
