let app = void 0;
let chessPieces = { 
    king : {
        asset: 'Assets/chess-king.svg',
        getAvailableMoves: (cordsConfig) => {
            let moveCors = []
            const targetFigure = app.getFigureByCords(cordsConfig)

            for(let Xindex = -1; Xindex < 2; Xindex++) {
                for(let Yindex = -1; Yindex < 2; Yindex++) {
                    if(Xindex || Yindex){
                        let moveCords = {}

                        
                        moveCords.x = cordsConfig.x + Xindex
                        moveCords.y = cordsConfig.y + Yindex
    
                        if(moveCords.x >= 0 && moveCords.x < 8 && moveCords.y >= 0 && moveCords.y < 8){
                            const cordsFigure = app.getFigureByCords(moveCords)

                                if(cordsFigure && cordsFigure.color !== targetFigure.color) {
                                    moveCords.isEnemy = true
                                }

                                if(cordsFigure.color !== targetFigure.color || !cordsFigure) {
                                    moveCors.push(moveCords)
                                }       
                        }
                    }
                }
            }
            
            if(moveCors.length){
                return moveCors
            } else {
                return false
            }
        }
    },

    queen: {
        asset: 'Assets/chess-queen.svg'
    },

    rook: {
        asset: 'Assets/chess-rook.svg',
        getAvailableMoves: (cordsConfig) => {
            const targetFigure = app.getFigureByCords(cordsConfig)
            
            const getStragightFields = (direction, axis) => {
                let moveCors = []
                if(!((direction === 'up' && cordsConfig[axis] === 7) || (direction === 'down' && cordsConfig[axis] === 0))) {
                    let conditionNumber = 8
                    let operation = 1

                    if(direction === 'down') {
                        conditionNumber = -1
                        operation = -1
                    }

                   

                    for(iteration = cordsConfig[axis]+operation; iteration !== conditionNumber;iteration = iteration + operation) {
                        let possibleCords = {...cordsConfig}
                        possibleCords[axis] = iteration

                        let possiebleFigure = app.getFigureByCords(possibleCords)

                        if(possiebleFigure) {
                            if(possiebleFigure.color !== targetFigure.color) {
                                possibleCords.isEnemy = true
                                moveCors.push(possibleCords)
                            }

                            break
                        } else {
                            moveCors.push(possibleCords)
                        }

                        
                    }
                }

                return moveCors
            }

            const getFields = (checkingAxis) => {
                moveCors = [ ...getStragightFields('up', checkingAxis), ...getStragightFields('down', checkingAxis)]
                return moveCors
            }

            return [
                ...getFields('x'),
                ...getFields('y')
            ]
            
        }

    },

    bishop: {
        asset: 'Assets/chess-bishop.svg',
    },

    knight: {
        asset: 'Assets/chess-knight.svg'
    },

    pawn: {
        asset: 'Assets/chess-pawn.svg',
        getAvailableMoves: (cordsConfig) => {
            let moveCors = []
            const targetFigure = app.getFigureByCords(cordsConfig)
            const addValue = targetFigure.color === 'white' ? 1 : -1

            moveCors.push({
                ...cordsConfig,
                y : cordsConfig.y + addValue
            })


            if((targetFigure.color === 'black' && cordsConfig.y === 6) || (targetFigure.color === 'white' && cordsConfig.y === 1)) {
                moveCors.push({
                    ...cordsConfig,
                    y : cordsConfig.y + 2 * addValue
                })
            }

            return moveCors
        }
    },

    figures: {

    }
}

window.addEventListener('DOMContentLoaded', () => {
    bindUserUIActions()
    app = new ChessGame
    app.setBoard()
})

function nodeListToArray(nodeList) {
    return  Array.prototype.slice.call(nodeList)
}

function bindUserUIActions() {
    document.querySelector('.mian-nav .new-game').addEventListener('click', () => {
        app.restart()
    })

    document.querySelector('.chess-board').addEventListener('click', (event) => {
        let activeFigureClass = void (0)
        let availableMoves = void (0)
        const activeFigureElement = document.querySelector('.chess-figure.active')
        const target = event.target
        const figureElement = (target.classList.contains('figure-field') ? target.cloneNode(true) : target.parentElement).cloneNode(true)
        const cordsConfig = app.getElementCords(target)
        const targetFigureClass = app.getFigure(figureElement)

        if(activeFigureElement) {
            activeFigureClass = app.getFigure(activeFigureElement)
            availableMoves = activeFigureClass ? activeFigureClass.getAvailableMoves(activeFigureClass.getFigureCords) : false
        }

        if(target.tagName === 'IMG') {
            app.figureClicked(targetFigureClass, figureElement)
        }

        //console.log(typeof availableMoves, availableMoves)


        if(activeFigureElement && availableMoves && availableMoves.filter(move => JSON.stringify(move) === JSON.stringify(cordsConfig)).length){
            app.tryMoveFigure(cordsConfig)
        }
    })
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