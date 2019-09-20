import { Utility } from '@Scripts/utilities'
import { Board } from '@Scripts/board'

require('./main.scss')

export let chessPieces: chessPieces = { 
    king : {
        asset: 'Assets/chess-king.svg',
        getAvailableMoves: cordsConfig => {
            let moveCors = []
            const targetFigure = Utility.getFigureByCords(cordsConfig)

            for(let Xindex = -1; Xindex < 2; Xindex++) {
                for(let Yindex = -1; Yindex < 2; Yindex++) {
                    if(Xindex || Yindex){
                        let moveCords: Cords = {x: 0, y: 0};

                        
                        moveCords.x = cordsConfig.x + Xindex
                        moveCords.y = cordsConfig.y + Yindex
    
                        if(moveCords.x >= 0 && moveCords.x < 8 && moveCords.y >= 0 && moveCords.y < 8){
                            const cordsFigure = Utility.getFigureByCords(moveCords)

                                if(targetFigure && cordsFigure && cordsFigure.color !== targetFigure.color) {
                                    moveCords.isEnemy = true
                                }

                                if(!cordsFigure || (targetFigure && cordsFigure && cordsFigure.color !== targetFigure.color)) {
                                    moveCors.push(moveCords)
                                }     
                        }
                    }
                }
            }
            
            return moveCors
        }
    },

    queen: {
        asset: 'Assets/chess-queen.svg',
        getAvailableMoves: cordsConfig => {
            return [cordsConfig]
        }
    },

    rook: {
        asset: 'Assets/chess-rook.svg',
        getAvailableMoves: cordsConfig => {
            const targetFigure = Utility.getFigureByCords(cordsConfig)
            
            const getStragightFields = (direction: Direction, axis: Axis) => {
                let moveCors = []
                if(!((direction === 'up' && cordsConfig[axis] === 7) || (direction === 'down' && cordsConfig[axis] === 0))) {
                    let conditionNumber = 8
                    let operation = 1

                    if(direction === 'down') {
                        conditionNumber = -1
                        operation = -1
                    }

                    for(let iteration = cordsConfig[axis]+operation; iteration !== conditionNumber;iteration = iteration + operation) {
                        let possibleCords = {...cordsConfig}
                        possibleCords[axis] = iteration

                        let possibleFigure = Utility.getFigureByCords(possibleCords)

                        if(possibleFigure && targetFigure) {
                            if(possibleFigure.color !== targetFigure.color) {
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

            const getFields = (checkingAxis: 'x' | 'y') => {
                const moveCors = [ ...getStragightFields('up', checkingAxis), ...getStragightFields('down', checkingAxis)]
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
        getAvailableMoves: cordsConfig => {
            return [cordsConfig]
        }
    },

    knight: {
        asset: 'Assets/chess-knight.svg',
        getAvailableMoves: cordsConfig => {
            return [cordsConfig]
        }
    },

    pawn: {
        asset: 'Assets/chess-pawn.svg',
        getAvailableMoves: (cordsConfig: Cords) => {
            let moveCors = []
            const targetFigure = Utility.getFigureByCords(cordsConfig)

                if(targetFigure) {
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
            }

            return moveCors
        }
    },

    figures: {

    }
}

window.addEventListener('DOMContentLoaded', () => {
    bindUserUIActions()
    Board.setBoard()
})

function bindUserUIActions() {
    const newGameButton = document.querySelector('.mian-nav .new-game') || false
    const boardsElement = document.querySelector('.chess-board') || false

    if(newGameButton) {
        newGameButton.addEventListener('click', () => {
            Board.restart()
        })
    }

    if(boardsElement) {
        boardsElement.addEventListener('click', event => {
            const target = <HTMLElement>event.target || false
            if(target && target.parentElement) {
                let activeFigureClass: Piece | undefined;
                let availableMoves: Cords[] | boolean = false
                const activeFigureElement = <HTMLElement>document.querySelector('.chess-figure.active')
                const figureElement = <HTMLElement>(target.classList.contains('figure-field') ? target.cloneNode(true) : target.parentElement).cloneNode(true)
                const cordsConfig = Utility.getElementCords(target)
                const targetFigureClass = Utility.getFigure(figureElement)
        
                if(activeFigureElement) {
                    activeFigureClass = Utility.getFigure(activeFigureElement)
                    if(activeFigureClass && activeFigureClass.getFigureCords) {
                        availableMoves = activeFigureClass.getAvailableMoves(activeFigureClass.getFigureCords)
                    }
                }
        
                if(target.tagName === 'IMG' && targetFigureClass) {
                    Utility.figureClicked(targetFigureClass, figureElement)
                }
        
                if(cordsConfig && activeFigureElement && availableMoves && availableMoves.filter(move => JSON.stringify(move) === JSON.stringify(cordsConfig)).length){
                    Utility.tryMoveFigure(cordsConfig)
                }
            }
        })
    }
}

export class Piece {
    [x: string]: any
    public getAvailableMoves: availableMoves
    constructor(public pieceType: PieceType, public color: Color) {
        this.getAvailableMoves = chessPieces[this.getPieceLabel].getAvailableMoves
    }

    logFigure() {
        console.log(this)
    }

    move(cordsConfig: Cords) {
        const figureCords = this.getFigureCords
        if(figureCords) {
            const figureElement = this.getFigureDOMElement
            const finishMoveSequence = () => {
                const figureElement = <HTMLElement>this.getFigureDOMElement
                if(figureElement) {
                    figureElement.style.transform = ''
                    figureElement.classList.remove('transforming')
                    Utility.getElemenyByCords(cordsConfig).appendChild(figureElement)
                    figureElement.removeEventListener('transitionend', finishMoveSequence)
                }
            }
    
            figureElement.addEventListener('transitionend', finishMoveSequence)
    
            this.getFigureDOMElement.classList.add('transforming')
            this.getFigureDOMElement.style.transform = `translateY(${100 * (figureCords.y - cordsConfig.y)}%) translateX(${100 * (cordsConfig.x - figureCords.x)}%)`
        }
    }

    get getPieceLabel(): PieceType {
        return <PieceType>this.pieceType.replace(/-\d/, '')
    }

    get getPieceElement(): HTMLDivElement {
        let pieceElement = document.createElement('div')
        let pieceImg = document.createElement('img')

        pieceElement.className = 'chess-figure '
        pieceElement.dataset.color = this.color
        pieceElement.dataset.type = this.pieceType

        pieceImg.src = chessPieces[this.pieceType] ? chessPieces[this.pieceType].asset : chessPieces[this.getPieceLabel].asset
        pieceElement.appendChild(pieceImg)

        return pieceElement
    }

    get getFigureDOMElement (): HTMLElement {
        return  document.querySelector(`[data-color="${this.color}"][data-type="${this.pieceType}"]`) || document.body
    }

    get getFigureCords(): Cords | undefined {
        if(this.getFigureDOMElement) {
            const rowElement:HTMLElement = this.getFigureDOMElement.closest('.chess-row') || document.body

            if(rowElement.parentElement) {
                return {
                    x: Utility.nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( this.getFigureDOMElement.parentElement ),
                    y: Utility.nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
                }
            }
        }
    }
}