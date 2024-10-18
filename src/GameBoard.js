import "./GameBoard.css"
import {useEffect} from "react";

const margin = 20
const blockSize = 100

const blockBasicStyles = {
    width:  blockSize + "px",
    height: blockSize + "px",
    borderRadius: "6px",

    textAlign: "center",
    lineHeight: "100px",
    userSelect: "none",

    position: "absolute",
}

const BlockStyle ={
    0: {textColor: ""       , backgroundColor: "#CDC1B4"},
    2: {textColor: "#776E65", backgroundColor: "#EEE4DA"},
    4: {textColor: "#F9F6F2", backgroundColor: "#EDE0C8"}
}

function genBlockStyle(number, loc) {
    const row = Math.floor(loc / 4)
    const col = loc % 4
    return {
        ...blockBasicStyles,
        ...BlockStyle[number],
        top: margin + row * (margin + blockSize)
    }
}

function GameBlock({number, loc}) {
    return (
        <div style={genBlockStyle(number, loc)}>
            {number === 0 ? "" : number}
        </div>
    )
}

function GameBoard({numbers, spawnAnimation}) {
    const blocks = numbers.map(n => <GameBlock number={n} loc={n}/>)

    useEffect(() => {

    }, [spawnAnimation]);

    return (
        <div className="game-board">
            {blocks}
        </div>
    )
}

export default GameBoard;
