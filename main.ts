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
            const getFields = (checkingAxis: Axis): Cords[] => {
                let moveCors: Cords[] = []

                    const moveFunctions = [Utility.getStragightFields, Utility.getSlantFields]

                    moveFunctions.forEach(moveFunction => {
                        moveCors.push(...moveFunction('up', checkingAxis, cordsConfig), ...moveFunction('down', checkingAxis, cordsConfig))
                    })

                return moveCors
            }

            return [
                ...getFields('x'),
                ...getFields('y')
            ]
        }
    },

    rook: {
        asset: 'Assets/chess-rook.svg',
        getAvailableMoves: cordsConfig => {
            const getFields = (checkingAxis: Axis): Cords[] => {
                const moveCors = [ ...Utility.getStragightFields('up', checkingAxis, cordsConfig), ...Utility.getStragightFields('down', checkingAxis, cordsConfig)]
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
            const getFields = (checkingAxis: Axis): Cords[] => {
                const moveCors = [ ...Utility.getSlantFields('up', checkingAxis, cordsConfig), ...Utility.getSlantFields('down', checkingAxis, cordsConfig)]
                return moveCors
            }

            return [
                ...getFields('x'),
                ...getFields('y')
            ]
        }
    },

    knight: {
        asset: 'Assets/chess-knight.svg',
        getAvailableMoves: cordsConfig => {

            const validateJumpCords = (jumpCords: Cords[]): Cords[] | [] => {
                let validCords: Cords[] = []

                jumpCords.forEach((possibleCords: Cords) => {
                    if(possibleCords.x > -1 && possibleCords.x < 8 && possibleCords.y > -1 && possibleCords.y < 8){
                        const targetPiece = Utility.getFigureByCords(cordsConfig)
                        const possiblePiece = Utility.getFigureByCords(possibleCords)

                        if(!possiblePiece || (possiblePiece.color !== targetPiece.color)) {
                            validCords.push(possibleCords)
                        }

                    }
                });

                return validCords
            }

            const getKnightFields = (direction: Direction, axis: Axis): Cords[] => {
                let Yincremeter = 0
                let Xincremeter = 0

                if(direction === 'up') {
                    Yincremeter++
                } else {
                    Yincremeter--
                }

                if((direction === 'up' && axis === 'x') || (direction === 'down' && axis === 'y')){
                    Xincremeter++
                } else {
                    Xincremeter--
                }

                const possibleJumpMoves = validateJumpCords([{
                    x: cordsConfig.x + Xincremeter,
                    y: cordsConfig.y + Yincremeter * 2
                },{
                    x: cordsConfig.x + Xincremeter * 2,
                    y: cordsConfig.y + Yincremeter
                }])

                return possibleJumpMoves
            }

            const getFields = (checkingAxis: Axis) => {
                const moveCors = [ ...getKnightFields('up', checkingAxis), ...getKnightFields('down', checkingAxis)]
                return moveCors
            }

            return [
                ...getFields('x'),
                ...getFields('y')
            ]
        }
    },

    pawn: {
        asset: 'Assets/chess-pawn.svg',
        getAvailableMoves: (cordsConfig: Cords) => {
            let moveCors = []
            const targetFigure = Utility.getFigureByCords(cordsConfig)

                if(targetFigure) {
                    const addValue = targetFigure.color === 'white' ? 1 : -1
                    const nextFieldCords: Cords = {
                        ...cordsConfig,
                        y : cordsConfig.y + addValue
                    }

                    const potentialEnemiesSpots = [{
                        ...nextFieldCords,
                        x: nextFieldCords.x-1
                    },{
                        ...nextFieldCords,
                        x: nextFieldCords.x+1
                    }]

                    if(!Utility.getFigureByCords(nextFieldCords)) {
                        moveCors.push(nextFieldCords)
                    }

                    potentialEnemiesSpots.forEach(possibleEnemyCords => {
                        const possibleEnemyPiece = Utility.getFigureByCords(possibleEnemyCords)

                        if(possibleEnemyPiece && possibleEnemyPiece.color !== targetFigure.color) {
                            moveCors.push(possibleEnemyCords)
                        }
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
    bindUIActions()
    Board.setBoard()
})

function bindUIActions() {
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
            const targetFigureField =  <HTMLElement>Utility.getFigureFieldOfElement(target)
            const targetCords = targetFigureField ? <Cords>Utility.getElementCords(targetFigureField) : false
            if(targetCords) {
                const activeFigureElement = <HTMLElement>document.querySelector('.chess-figure.active')
                const activeFigure = activeFigureElement && activeFigureElement.parentElement ? Utility.getFigureByFigureField(activeFigureElement.parentElement) : false
                const activeFigureCords = activeFigure ? activeFigure.getFigureCords : false
                const activeFigureAvailableMoves = activeFigure ? activeFigure.getAvailableMoves(<Cords>activeFigure.getFigureCords) : []
                const targetFigure = Utility.getFigureByCords(targetCords)   
    
                if((!activeFigureElement && targetFigureField.firstChild) || (activeFigure && JSON.stringify(activeFigure.getFigureCords) === JSON.stringify(targetCords))) {
                    Utility.selfFigureClicked(Utility.getFigureByCords(targetCords))
                }
    
                if(activeFigureElement && activeFigure && activeFigureAvailableMoves.filter(move => JSON.stringify(move) === JSON.stringify(targetCords)).length) {
                    if(targetFigure && activeFigure.color !== targetFigure.color) {
                        //enemy piece in the way
                    } else {
                        activeFigure.move(targetCords)
                    }
                } else if (activeFigure && targetFigure && activeFigure.color === targetFigure.color && JSON.stringify(targetCords) !== JSON.stringify(activeFigureCords)) {
                    Utility.deactivateFigure(activeFigure)
                    Utility.activateFigure(targetFigure)
                }
            }
        })
    }
}

export class Piece {
    [x: string]: any
    public getAvailableMoves: availableMoves
    constructor(public pieceType: PieceType, public color: Color, public isActive = false) {
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
                    figureElement.removeAttribute('style');
                    figureElement.classList.remove('transforming')
                    Utility.getElemenyByCords(cordsConfig).appendChild(figureElement)
                    figureElement.removeEventListener('transitionend', finishMoveSequence)
                    Utility.getFigureByCords(cordsConfig).isActive = false
                }
            }

            if(figureElement) {
                figureElement.addEventListener('transitionend', finishMoveSequence)
    
                figureElement.classList.add('transforming')
                figureElement.classList.remove('active')

                figureElement.style.transform = `translateY(${100 * (figureCords.y - cordsConfig.y)}%) translateX(${100 * (cordsConfig.x - figureCords.x)}%)`
            }

        }
    }

    remove() {
        const elementToRemove = this.getFigureDOMElement

        if(elementToRemove) {
                const finishRemoveSequence = () => {
                    const figureElement = <HTMLElement>this.getFigureDOMElement
                    if(figureElement) {
                        figureElement.removeAttribute('style');
                        figureElement.classList.remove('transforming')
                        figureElement.removeEventListener('transitionend', finishRemoveSequence)
                        elementToRemove.remove()
                    }
                }

                elementToRemove.addEventListener('transitionend', finishRemoveSequence)
                elementToRemove.classList.add('transforming')
                elementToRemove.style.opacity = '0' 
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

    get getFigureDOMElement (): HTMLElement | undefined {
        return  <HTMLElement>document.querySelector(`[data-color="${this.color}"][data-type="${this.pieceType}"]`) || undefined
    }

    get getFigureCords(): Cords | undefined {
        if(this.getFigureDOMElement) {
            const rowElement = <HTMLElement>this.getFigureDOMElement.closest('.chess-row')

            if(rowElement.parentElement) {
                return {
                    x: Utility.nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( this.getFigureDOMElement.parentElement ),
                    y: Utility.nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
                }
            }
        }
    }
}