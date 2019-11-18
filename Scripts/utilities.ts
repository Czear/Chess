import { Piece } from "../main"
import { gameConfig } from "./gameConfig"

export class Utility {
    static nodeListToArray(nodeList: NodeList): Element[] {
        return  Array.prototype.slice.call(nodeList)
    }

    static selfFigureClicked(figureClass: Piece) {
        if(figureClass._isActive) {
            this.deactivateFigure(figureClass)
        } else {
            this.deactivateFigures();
            this.activateFigure(figureClass)
        }
    }

    static deactivateFigures() {
        document.querySelectorAll('.chess-figure').forEach(singleElement => {
            const figureToDeactivate = this.getFigureByFigureField(singleElement.parentElement as HTMLElement);

            if(figureToDeactivate) {
                this.deactivateFigure(figureToDeactivate)
            }
        })
    }

    static deactivateFigure(figureClass: Piece ): void {
        const figure = figureClass.DOMElement;
        if(figureClass._isActive && figure){
            figureClass._isActive = false;
            figure.classList.remove('active')
        }
    }

    static activateFigure(figureClass: Piece ) {
        const figure = figureClass.DOMElement;
        if(!figureClass._isActive && figure){
            figureClass._isActive = true;
            figure.classList.add('active')
        }
    }

    static getFigureByFigureField(figureElement: HTMLElement): Piece | undefined  {
        const chessFigureElement = figureElement.firstChild as HTMLElement;

        return chessFigureElement ? gameConfig.figures[chessFigureElement.id] as Piece : undefined
    }

    static getElementCords(element: HTMLElement): ICords {
        const rowElement = element.parentElement as HTMLElement;

        return {
            x: this.nodeListToArray(rowElement.querySelectorAll('.figure-field')).indexOf( element ),
            y: rowElement.parentElement ? this.nodeListToArray(rowElement.parentElement.querySelectorAll('.chess-row')).reverse().indexOf( rowElement ) : 0
        }
    }

    static getFigureFieldOfElement = (element: HTMLElement): HTMLElement | undefined => {
        let elementToReturn: HTMLElement | undefined;


        if(element.classList.contains('figure-field')) {
            elementToReturn = element as HTMLElement
        } else if(element.classList.contains('chess-figure')) {
            elementToReturn = element.parentElement as HTMLElement
        } else if (element.nodeName === 'IMG') {
            if(element.parentElement) {
                elementToReturn = element.parentElement.parentElement as HTMLElement
            }
        }

        return elementToReturn
    };

    static getElementByCords(cordsConfig: ICords): HTMLElement  {
        return this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x] as HTMLElement;
    }

    static getFigureByCords(cordsConfig: ICords): Piece {
        const figureHTMLElement = this.nodeListToArray(this.nodeListToArray(document.querySelectorAll('.chess-row')).reverse()[cordsConfig.y].querySelectorAll('.figure-field'))[cordsConfig.x] as HTMLElement;

        let figure: Piece | undefined;

        if(figureHTMLElement) {
            figure = this.getFigureByFigureField(figureHTMLElement)
        }

        return figure as Piece
    }

    static getStraightFields = (direction: Direction, axis: Axis, baseCords: ICords) => {
        let moveCors: ICords[] = [];
        if(!((direction === 'up' && baseCords[axis] === 7) || (direction === 'down' && baseCords[axis] === 0))) {
            let conditionNumber = 8;
            let operation = 1;

            if(direction === 'down') {
                conditionNumber = -1;
                operation = -1;
            }

            for(let iteration = baseCords[axis]+operation; iteration !== conditionNumber;iteration = iteration + operation) {
                let possibleCords = { ...baseCords };
                possibleCords[axis] = iteration;

                const possibleFigure = Utility.getFigureByCords(possibleCords);
                const targetFigure = Utility.getFigureByCords(baseCords);

                if(possibleFigure && targetFigure) {
                    if(possibleFigure._color !== targetFigure._color) {
                        moveCors.push({...possibleCords})
                    }
                    break;
                } else {
                    moveCors.push(possibleCords)
                }
            }
        }

        return moveCors
    };

    static getSlantFields = (direction: Direction, axis: Axis, baseCords: ICords): ICords[] => {
        let possibleMoves: ICords[] = [];

        let Yincremeter = 0;
        let Xincremeter = 0;

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
            };
            const possibleFigure = Utility.getFigureByCords(possibleCords);
            const targetFigure = Utility.getFigureByCords(baseCords);

            if(targetFigure && possibleFigure) {
                if (possibleFigure._color !== targetFigure._color) {
                    possibleMoves.push({...possibleCords })
                }

                break;
            }

            if(!possibleFigure) {
                possibleMoves.push({...possibleCords})
            }

        }

        return possibleMoves
    }
}