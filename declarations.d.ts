interface ICords {
    x: number,
    y: number,
}

interface IPiece {
    _isActive: boolean
    _pieceType: PieceType
    _cords: ICords
    _color: Color
    _ID: string

    cords: ICords
    pieceElement: HTMLDivElement
    DOMElement: HTMLElement | undefined
    getAvailableMoves: availableMoves
    remove: () => void
    logFigure: () => void
    createFigure: () => void
}

interface IChessPieces {
    [key: string]: IPieceConfig
}

interface IIngameFigures {
    [key: string]: IPiece
}

interface IPieceConfig {
    asset: string,
    getAvailableMoves: availableMoves,
    startingPositions: {
        [K in Color]: Array<{
            id: number,
            cords: ICords
        }>
    }
}


type availableMoves = (cords: ICords) => ICords[]
type Axis = 'x' | 'y'
type Color = 'black' | 'white'
type Direction = 'up' | 'down'
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

declare module "*.svg" {
    const content: any;
    export default content;
}