interface Cords {
    isEnemy?: boolean
    x: number,
    y: number,
}

interface Piece {
    isActive: boolean
    pieceType: PieceType
    color: Color
    getPieceLabel: PieceType
    getPieceElement: HTMLDivElement
    getFigureDOMElement: HTMLElement
    getFigureCords: Cords | undefined
    getAvailableMoves: availableMoves
    logFigure: () => void
    move: (cordsConfig: Cords) => void
}

interface chessPieces {
    king: PieceConfig
    queen: PieceConfig
    rook: PieceConfig
    knight: PieceConfig
    bishop: PieceConfig
    pawn: PieceConfig
    figures: {
        [element: string]: Piece
    }
}

interface PieceConfig {
    asset: string,
    getAvailableMoves: availableMoves
}


type availableMoves = (cords: Cords) => Cords[]
type Axis = 'x' | 'y'
type Color = 'black' | 'white'
type Direction = 'up' | 'down'
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'