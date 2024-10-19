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

const BlockTransitionStyle = {
    transition: "all 100ms linear"
}

const BlockStyle ={
    0: {textColor: ""       , backgroundColor: "#CDC1B4"},
    2: {textColor: "#776E65", backgroundColor: "#EEE4DA"},
    4: {textColor: "#F9F6F2", backgroundColor: "#EDE0C8"}
}

function get_row_and_col_from_index(index) {
    return [Math.floor(index / 4), index % 4]
}

function gen_block_style(number, index) {
    const [row, col] = get_row_and_col_from_index(index)
    return {
        ...blockBasicStyle,
        ...BlockStyle[number],
        width:  BlockSize + "px",
        height: BlockSize + "px",
        top:  Margin + row * (Margin * 2 + BlockSize),
        left: Margin + col * (Margin * 2 + BlockSize),
    }
}

function gen_block_spawn_animation_style(number, index) {
    return {
        entering: {
            ...BlockTransitionStyle,
            ...gen_block_style(number, index),
            transform: "scale(1.05)",
        },
        entered:  {
            ...BlockTransitionStyle,
            ...gen_block_style(number, index),
            transform: "scale(1.05)",
        },
        exiting: {
            ...BlockTransitionStyle,
            ...gen_block_style(number, index),
            transform: "scale(1)",
        },
        exited: {
            ...BlockTransitionStyle,
            ...gen_block_style(number, index),
            transform: "scale(1)",
        },
    }
}

function GameBlock({number, index}) {
    const text = number === 0 ? "" : number

    return (
        <div style={gen_block_style(number, index)}>
            {text}
        </div>
    )
}

export function SpawnAnimationBlock({number, index, onExited}) {
    const [inProp, setInProp] = useState(true)
    const nodeRef = useRef(null)

    return (
        <Transition
            in={inProp}
            nodeRef={nodeRef}
            timeout={100}
            onEntered={() => setInProp(false)}
            onExited={onExited}
            unmountOnExit
            appear
        >
            {state => {
                return (
                    <div
                        ref={nodeRef}
                        style={gen_block_spawn_animation_style(number, index)[state]}
                    >
                        {number}
                    </div>
                )
            }}
        </Transition>
    )
}

export default GameBlock;