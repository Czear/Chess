import { Utility } from './utilities'
import { Piece, chessPieces } from '../main'

export class Board {
    static restart() {
        this.resetBoard()
        this.setBoard()
    }


    static resetBoard() {
        document.querySelectorAll('.chess-board .figure-field').forEach(cell => {
            while(cell.lastChild) {
                cell.removeChild(cell.lastChild)
            }
        })
    }

    static setBoard() {
        document.querySelectorAll('.pieces-row .figure-field').forEach(tableDataElement => {
            if(tableDataElement.parentElement) {
                let figureColor = <Color>tableDataElement.parentElement.dataset.startcolor
                let figureType = (<HTMLElement>tableDataElement).dataset.start
                let figureSelector = figureColor + '-' + figureType

                if(figureType) {
                    if(!['king', 'queen'].includes(figureType)) {
                        let id = `-${Utility.nodeListToArray(tableDataElement.parentElement.querySelectorAll(`[data-start="${figureType}"]`)).indexOf( tableDataElement )}`;
                        figureSelector += id
                        figureType += id
                    }

                    let figure = new Piece(<PieceType>figureType, figureColor)

                    chessPieces.figures[figureSelector] = figure
                    tableDataElement.appendChild(figure.getPieceElement)
                }
            }
        })

    }
}