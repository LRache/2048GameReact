import "./MainBoard.css"

function NewGameButton({handleNewGame}) {
    return (
        <button className="newGameButton" onClick={handleNewGame}>
            New Game
        </button>
    )
}

export default NewGameButton;
