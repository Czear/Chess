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
    constructor(pieceType, color) {
        super();
        this.pieceType = pieceType
        this.color = color
        this.isActive = true
        this.getAvailableMoves = chessPieces[pieceType.replace(/-\d/, '')].getAvailableMoves
    }

    logFigure() {
        console.log(this)
    }

    move(cordsConfig) {
        const figureElement = this.getFigureDOMElement
        const figureCords = this.getFigureCords
        const finishMoveSequence = () => {
            this.getFigureDOMElement.style.transform = ''
            this.getFigureDOMElement.classList.remove('transforming')
            app.getElemenyByCords(cordsConfig).appendChild(this.getFigureDOMElement)
            figureElement.removeEventListener('transitionend', finishMoveSequence)
        }

        figureElement.addEventListener('transitionend', finishMoveSequence)

        this.getFigureDOMElement.classList.add('transforming')
        this.getFigureDOMElement.style.transform = `translateY(${100 * (figureCords.y - cordsConfig.y)}%) translateX(${100 * (cordsConfig.x - figureCords.x)}%)`
    }

    get getPieceElement() {
        let pieceElement = document.createElement('div')
        let pieceImg = document.createElement('img')

        pieceElement.className = 'chess-figure '
        pieceElement.dataset.color = this.color
        pieceElement.dataset.type = this.pieceType

        pieceImg.src = chessPieces[this.pieceType] ? chessPieces[this.pieceType].asset : chessPieces[this.pieceType.replace(/-[0-9]*/, '')].asset
        pieceElement.appendChild(pieceImg)

        return pieceElement
    }

    get getFigureDOMElement () {
        return  document.querySelector(`[data-color="${this.color}"][data-type="${this.pieceType}"]`);
    }

    get getFigureCords() {
        const rowElement = this.getFigureDOMElement.parentElement.parentElement

        return {
            x: nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( this.getFigureDOMElement.parentElement ),
            y: nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
        }
    }
}