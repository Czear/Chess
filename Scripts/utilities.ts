import { chessPieces, Piece } from "../main"

export class Utility {
    static nodeListToArray(nodeList: NodeList) {
        return  Array.prototype.slice.call(nodeList)
    }

    static figureClicked(figureClass: Piece, figureElement: HTMLElement) {
        this.deactivateFigures()

        if(!figureClass.isActive && figureElement.classList.contains('active')) {  
            this.deactivateFigure(figureClass)
        } else {
            this.activateFigure(figureClass)
        }
    }

    static tryMoveFigure(targetCords: Cords, availableMoves=0) {
        const activeFigureElement = <HTMLElement>document.querySelector('.chess-figure.active')
        const figureToMove = this.getFigure(activeFigureElement)
        if(activeFigureElement && figureToMove) {
            figureToMove.move(targetCords)
            activeFigureElement.classList.remove('active')
        }
    }

    static deactivateFigures() {
        document.querySelectorAll('.chess-figure').forEach(singleElement => {
            const figureToDeactivate = this.getFigure(<HTMLElement>singleElement)
            
            if(figureToDeactivate) {
                this.deactivateFigure(figureToDeactivate)
            }
        })
    }

    static deactivateFigure(figureClass: Piece ): void {
        if(figureClass.isActive){
            figureClass.isActive = false
            figureClass.getFigureDOMElement.classList.remove('active')
        }
    }

    static activateFigure(figureClass: Piece ) {
        if(!figureClass.isActive){
            figureClass.isActive = true
            figureClass.getFigureDOMElement.classList.add('active')
        }
    }

    static getFigure(figureElement: HTMLElement): Piece | undefined {
        return chessPieces.figures[figureElement.dataset.color + '-' + figureElement.dataset.type]
    }

    static getElementCords(element: HTMLElement): Cords | undefined {
        const rowElement = element.parentElement || false

        if(rowElement && rowElement.parentElement) {
            return {
                x: this.nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( element ),
                y: this.nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
            }
        }
    }

    static getElemenyByCords(cordsConfig: Cords): HTMLElement  {
        return this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x]
    }

    static getFigureByCords(cordsConfig: Cords): Piece | undefined {
        const figureHTMLElement = this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x]

        let figure: Piece | undefined;

        if(figureHTMLElement.firstChild) {
            figure = this.getFigure(figureHTMLElement.firstChild)
        }

        return figure
    }

    static getStragightFields = (direction: Direction, axis: Axis, baseCords: Cords) => {
        let moveCors = []
        if(!((direction === 'up' && baseCords[axis] === 7) || (direction === 'down' && baseCords[axis] === 0))) {
            let conditionNumber = 8
            let operation = 1

            if(direction === 'down') {
                conditionNumber = -1
                operation = -1
            }

            for(let iteration = baseCords[axis]+operation; iteration !== conditionNumber;iteration = iteration + operation) {
                let possibleCords = {...baseCords}
                possibleCords[axis] = iteration

                const possibleFigure = Utility.getFigureByCords(possibleCords)
                const targetFigure = Utility.getFigureByCords(baseCords)

                if(possibleFigure && targetFigure) {
                    if(possibleFigure.color !== targetFigure.color) {
                        moveCors.push({
                            ...possibleCords,
                            isEnemy: true
                        })
                    }

                    break
                } else {
                    moveCors.push(possibleCords)
                }

                
            }
        }

        return moveCors
    }

    static getSlantFields = (direction: Direction, axis: Axis, baseCords: Cords): Cords[] => {
        let possibleMoves: Cords[] = [];

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

        for(let possibleX = baseCords.x+ Xincremeter, possibleY = baseCords.y + Yincremeter; (possibleX > -1 && possibleY > -1) && (possibleX < 8 && possibleY < 8); possibleX += Xincremeter, possibleY += Yincremeter) {
            const possibleCords = {
                x: possibleX,
                y: possibleY
            }
            const possibleFigure = Utility.getFigureByCords(possibleCords)
            const targetFigure = Utility.getFigureByCords(baseCords)

            if(targetFigure && possibleFigure) {
                if (possibleFigure.color !== targetFigure.color) {
                    possibleMoves.push({
                        ...possibleCords,
                        isEnemy: true
                    })
                }

                break;
            }

            if(!possibleFigure) {
                possibleMoves.push({
                    ...possibleCords
                })
            }

        }

        return possibleMoves
    }
}