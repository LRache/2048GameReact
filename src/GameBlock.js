import {useState, useEffect} from "react";

const Margin = 10
const BlockSize = 100

const BlockBasicStyle = {
    width:  `${BlockSize}px`,
    height: `${BlockSize}px`,
    borderRadius: "6px",
    position: "absolute",

    textAlign: "center",
    lineHeight: `${BlockSize}px`,
    userSelect: "none",
}

const BlockNumberStyle ={
    0:      {color: ""       , backgroundColor: "#CDC1B4", fontSize: "40px"},
    2:      {color: "#776E65", backgroundColor: "#EEE4DA", fontSize: "40px"},
    4:      {color: "#776E65", backgroundColor: "#EDE0C8", fontSize: "40px"},
    8:      {color: "#F9F6F2", backgroundColor: "#F2B179", fontSize: "40px"},
    16:     {color: "#F9F6F2", backgroundColor: "#F59563", fontSize: "40px"},
    32:     {color: "#F9F6F2", backgroundColor: "#F67C5F", fontSize: "40px"},
    64:     {color: "#F9F6F2", backgroundColor: "#F65E3B", fontSize: "40px"},
    128:    {color: "#F9F6F2", backgroundColor: "#EDCF72", fontSize: "40px"},
    256:    {color: "#F9F6F2", backgroundColor: "#EDCC61", fontSize: "40px"},
    512:    {color: "#F9F6F2", backgroundColor: "#EDC850", fontSize: "40px"},
    1024:   {color: "#F9F6F2", backgroundColor: "#EDC53F", fontSize: "36px"},
    2048:   {color: "#F9F6F2", backgroundColor: "#EDC42D", fontSize: "36px"},
    4096:   {color: "#F9F6F2", backgroundColor: "#BAD770", fontSize: "36px"},
    8192:   {color: "#F9F6F2", backgroundColor: "#C6DA5D", fontSize: "36px"},
    16384:  {color: "#F9F6F2", backgroundColor: "#6AB7F1", fontSize: "32px"},
    32768:  {color: "#F9F6F2", backgroundColor: "#42A4F7", fontSize: "32px"},
    65536:  {color: "#F9F6F2", backgroundColor: "#2A8DDE", fontSize: "32px"},
    131072: {color: "#F9F6F2", backgroundColor: "#9773CF", fontSize: "28px"},
}

function get_position(t) {
    return Margin + t * (Margin * 2 + BlockSize)
}

function gen_block_style(number, row, col) {
    return {
        ...BlockBasicStyle,
        ...BlockNumberStyle[number],
        top:  get_position(row),
        left: get_position(col),
    }
}

function gen_spawn_animation_style(number, row, col) {
    const blockStyle= gen_block_style(number, row, col)
    const transitionStyle = {
        transition: "all 120ms ease-in-out"
    }
    return {
        0: blockStyle,
        1: {
            ...transitionStyle,
            ...blockStyle,
            transform: "scale(1.02)",
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
    }
    const end = {
        ...gen_block_style(number, tr, tc),
        transition: "all 150ms ease-in-out",
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

    useEffect(() => {
        setState(1)
        setTimeout(() => {setState(2)}, 120)
        setTimeout(() => {onEnd()}, 240)
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