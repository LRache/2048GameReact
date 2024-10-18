import "./GameBoard.css"
import {useEffect} from "react";

const blockBasicStyles = {
    width:  "100px",
    height: "100px",
    borderRadius: "6px",

    textAlign: "center",
    lineHeight: "100px",
    userSelect: "none",
}

const BlockStyle ={
    2: {textColor: "#776E65", backgroundColor: "#EEE4DA"},
    4: {textColor: "#F9F6F2", backgroundColor: "#EDE0C8"},
}

function genBlockStyle(number) {
    return {
        ...blockBasicStyles,
        ...BlockStyle[number],
    }
}

function GameBlock({number}) {
    return (
        <div className="game-block mt-2 border-2 shadow-sm" style={genBlockStyle(number)}>
            {number === 0 ? "" : number}
        </div>
    )
}

function GameBoard({numbers, spawnAnimation}) {
    const blocks = numbers.map(n => <GameBlock number={n}/>)

    useEffect(() => {

    }, [spawnAnimation]);

    return (
        <div className="game-board">
            {blocks}
        </div>
    )
}

export default GameBoard;
