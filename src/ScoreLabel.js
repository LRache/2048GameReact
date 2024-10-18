import "./MainBoard.css"

export function ScoreLabel({score, bestScore}) {
    return (
        <div>
            <div className="scoreLabel">
                <div className="scoreLabelText">SCORE</div>
                <div className="scoreLabelNumber">{score}</div>
            </div>
            <div className="scoreLabel">
                <div className="scoreLabelText">BEST</div>
                <div className="scoreLabelNumber">{bestScore}</div>
            </div>
        </div>
    )
}
