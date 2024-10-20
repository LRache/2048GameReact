import {useRef, useState, useEffect} from "react";
import {Transition} from "react-transition-group";

const Margin = 10
const BlockSize = 100

const blockBasicStyle = {
    borderRadius: "6px",
    position: "absolute",

    textAlign: "center",
    lineHeight: "100px",
    userSelect: "none",
    fontSize: "40px",
}

const BlockStyle ={
    0:  {color: ""       , backgroundColor: "#CDC1B4"},
    2:  {color: "#776E65", backgroundColor: "#EEE4DA"},
    4:  {color: "#776E65", backgroundColor: "#EDE0C8"},
    8:  {color: "#F9F6F2", backgroundColor: "#F2B179"},
    16: {color: "#F9F6F2", backgroundColor: "#FFFFFF"},
}

function get_position(t) {
    return Margin + t * (Margin * 2 + BlockSize)
}

function gen_block_style(number, row, col) {
    return {
        ...blockBasicStyle,
        ...BlockStyle[number],
        width:  BlockSize + "px",
        height: BlockSize + "px",
        top:  get_position(row),
        left: get_position(col),
    }
}

function gen_spawn_animation_style(number, row, col) {
    const blockStyle= gen_block_style(number, row, col)
    const transitionStyle = {
        transition: "all 150ms linear"
    }
    return {
        0: blockStyle,
        1: {
            ...transitionStyle,
            ...blockStyle,
            transform: "scale(1.05)",
        },
        2: {
            ...transitionStyle,
            ...blockStyle,
            transform: "scale(1)",
        },
    }
}

function gen_move_animation_style(number, fr, fc, tr, tc) {
    const start = {
        ...gen_block_style(number, fr, fc),
        // transition: "all 1s linear 0s",
    }
    const end = {
        ...gen_block_style(number, tr, tc),
        transition: "all 200ms linear 0s",
    }

    return [start, end]
}

function GameBlock({number, row, col}) {
    const text = number === 0 ? "" : number

    return (
        <div style={gen_block_style(number, row, col)}>
            {text}
        </div>
    )
}

export function SpawnAnimationBlock({number, row, col, onEnd}) {
    const [state, setState] = useState(0)
    const styles = gen_spawn_animation_style(number, row, col)
    console.log("Paint spawn animation")

    useEffect(() => {
        setState(1)
        setTimeout(() => {setState(2)}, 100)
        setTimeout(() => {onEnd()}, 200)
    }, [])

    if (number === 0) {
        return (
            <div style={gen_block_style(0, row, col)}>
                {number}
            </div>
        )
    }

    return (
        <div style={styles[state]}>
            {number}
        </div>
    )
}

export function MoveAnimationBlock({number, fr, fc, tr, tc, onEnd}) {
    const [active, setActive] = useState(false)
    const [startStyle, endStyle] = gen_move_animation_style(number, fr, fc, tr, tc)

    useEffect(() => {
        setTimeout(() => {onEnd()}, 150)
        setActive(true)
    }, [])

    return (
        <div style={active ? endStyle : startStyle}>
            {number}
        </div>
    )
}

export default GameBlock;