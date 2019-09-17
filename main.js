let app = void 0;
let chessPieces = { 
    king : {
        asset: 'Assets/chess-king.svg'
    },

    queen: {
        asset: 'Assets/chess-queen.svg'
    },

    rook: {
        asset: 'Assets/chess-rook.svg'

    },

    bishop: {
        asset: 'Assets/chess-bishop.svg',
    },

    knight: {
        asset: 'Assets/chess-knight.svg'
    },

    pawn: {
        asset: 'Assets/chess-pawn.svg'
    },

    figures: {

    }
}

class ChessGame {
    restart() {
        this.resetBoard()
        this.setBoard()
    }


    resetBoard() {
        document.querySelectorAll('.chess-board .figure-field').forEach((cell) => {
            while(cell.lastChild) {
                cell.removeChild(cell.lastChild)
            }
        })
    }

    setBoard() {
        document.querySelectorAll('.pieces-row .figure-field').forEach((tableDataElement) => {
                let figureColor = tableDataElement.parentElement.dataset.startcolor
                let figureType = tableDataElement.dataset.start
                let figureSelector = figureColor + '-' + figureType

                if(!['king', 'queen'].includes(figureType)) {
                    let id = `-${nodeListToArray(tableDataElement.parentElement.querySelectorAll(`[data-start="${figureType}"]`)).indexOf( tableDataElement )}`;
                    figureSelector += id
                    figureType += id
                }

                let figure = new Piece(figureType, figureColor)

                chessPieces.figures[figureSelector] = figure
                tableDataElement.appendChild(figure.getPieceElement)                
        })

    }

    figureClicked(figureClass, figureElement) {
        app.deactivateFigures()

        if(!figureClass.isActive && figureElement.classList.contains('active')) {  
            app.deactivateFigure(figureClass)
        } else {
            app.activateFigure(figureClass)
        }
    }

    tryMoveFigure(targetCords, availableMoves) {
        const   activeFigureElement = document.querySelector('.chess-figure.active')
                app.getFigure(activeFigureElement).move(targetCords)
                activeFigureElement.classList.remove('active')
    }

    deactivateFigures() {
        document.querySelectorAll('.chess-figure').forEach(singleElement => {
           app.deactivateFigure(app.getFigure(singleElement))
        })
    }

    deactivateFigure(figureClass) {
        if(figureClass.isActive){
            figureClass.isActive = false
            figureClass.getFigureDOMElement.classList.remove('active')
        }
    }

    activateFigure(figureClass) {
        if(!figureClass.isActive){
            figureClass.isActive = true
            figureClass.getFigureDOMElement.classList.add('active')
        }
    }

    getFigure(figureElement) {
        return chessPieces.figures[figureElement.dataset.color + '-' + figureElement.dataset.type] || false
    }

    getElementCords(element) {
        const rowElement = element.parentElement

        return {
            x: nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( element ),
            y: nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
        }

    }

    getElemenyByCords(cordsConfig) {
        return nodeListToArray(nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x] || false
    }

    getFigureByCords(cordsConfig) {
        const figureHTMLElement = nodeListToArray(nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x]
        let figure = void 0;

        if(figureHTMLElement.firstChild) {
            figure = this.getFigure(figureHTMLElement.firstChild) || false
        } else {
            return false
        }

        return figure
    }
}
class Piece extends ChessGame {
}