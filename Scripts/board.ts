import { gameConfig } from './gameConfig'
import { Piece } from '../main'

export class Board {
    static restart(): void {
        Board.resetBoard();
        Board.setBoard();
    }


    static resetBoard(): void {
        document.querySelectorAll('.chess-board .figure-field').forEach((cell): void => {
            while(cell.lastChild) {
                cell.removeChild(cell.lastChild)
            }
        })
    }

    static setBoard(): void {
        Object.entries(gameConfig.chessPieces).forEach(pieceData => {
            const pieceName = pieceData[0];
            const pieceConfig = pieceData[1] as IPieceConfig;

            if(pieceName !== 'figures') {
                Object.entries(pieceConfig.startingPositions).forEach((pieceConfig): void => {
                    const pieceColor = pieceConfig[0] as Color;
                    pieceConfig[1].forEach((pieceDetails): void => {
                        const pieceID = pieceColor + '-' + pieceName + '-' + pieceDetails.id;
                        new Piece(pieceName as PieceType, pieceColor, pieceDetails.cords, pieceID);
                    })
                })
            }
        })
    }
}