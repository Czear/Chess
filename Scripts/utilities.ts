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
}