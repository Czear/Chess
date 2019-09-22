import { chessPieces, Piece } from "../main"

export class Utility {
    static nodeListToArray(nodeList: NodeList) {
        return  Array.prototype.slice.call(nodeList)
    }

    static selfFigureClicked(figureClass: Piece) {
        if(figureClass.isActive) {  
            this.deactivateFigure(figureClass)
        } else {
            this.deactivateFigures()
            this.activateFigure(figureClass)
        }
    }

    static deactivateFigures() {
        document.querySelectorAll('.chess-figure').forEach(singleElement => {
            const figureToDeactivate = this.getFigureByFigureField(<HTMLElement>singleElement.parentElement)
            
            if(figureToDeactivate) {
                this.deactivateFigure(figureToDeactivate)
            }
        })
    }

    static deactivateFigure(figureClass: Piece ): void {
        const figure = figureClass.getFigureDOMElement
        if(figureClass.isActive && figure){
            figureClass.isActive = false
            figure.classList.remove('active')
        }
    }

    static activateFigure(figureClass: Piece ) {
        const figure = figureClass.getFigureDOMElement
        if(!figureClass.isActive && figure){
            figureClass.isActive = true
            figure.classList.add('active')
        }
    }

    static getFigureByFigureField(figureElement: HTMLElement): Piece | undefined {
        const chessFiugreElement = <HTMLElement>figureElement.firstChild
        if(chessFiugreElement) {
            return chessPieces.figures[chessFiugreElement.dataset.color + '-' + chessFiugreElement.dataset.type]
        }
    }

    static getElementCords(element: HTMLElement): Cords | undefined {
        const rowElement = element.parentElement

        if(rowElement && rowElement.parentElement) {
            return {
                x: this.nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( element ),
                y: this.nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement )
            }
        }
    }

    static getFigureFieldOfElement = (element: HTMLElement): HTMLElement | undefined => {
        let elementToReturn: HTMLElement | undefined;


        if(element.classList.contains('figure-field')) {
            elementToReturn = <HTMLElement>element
        } else if(element.classList.contains('chess-figure')) {
            elementToReturn = <HTMLElement>element.parentElement
        } else if (element.nodeName === 'IMG') {
            if(element.parentElement) {
                elementToReturn = <HTMLElement>element.parentElement.parentElement
            }
        }
 
        return elementToReturn
    }

    static getElemenyByCords(cordsConfig: Cords): HTMLElement  {
        return this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x]
    }

    static getFigureByCords(cordsConfig: Cords): Piece {
        const figureHTMLElement = this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x]

        let figure: Piece | undefined;

        if(figureHTMLElement) {
            figure = this.getFigureByFigureField(figureHTMLElement)
        }

        return <Piece>figure
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
                            ...possibleCords
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
                        ...possibleCords
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