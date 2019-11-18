import { Utility } from "@Scripts/utilities";
import { Board } from "@Scripts/board";
import { gameConfig } from "@Scripts/gameConfig"

require("./main.scss");

window.addEventListener("DOMContentLoaded", (): void => {
    bindUIActions();
    Board.setBoard();
});

function bindUIActions(): void {
    const newGameButton = document.querySelector(".main-nav .new-game") as HTMLElement;
    const boardsElement = document.querySelector(".chess-board") as HTMLElement;

    newGameButton.addEventListener("click", Board.restart);

    boardsElement.addEventListener("click", (event): void => {
        const target = event.target as HTMLElement;
        const targetFigureField = Utility.getFigureFieldOfElement(target);
        const targetCords = targetFigureField ? Utility.getElementCords(targetFigureField) as ICords : false;

        if (targetCords && targetFigureField) {
            const activeFigureElement = document.querySelector(".chess-figure.active") as HTMLElement;
            const activeFigure = activeFigureElement && activeFigureElement.parentElement ? Utility.getFigureByFigureField(activeFigureElement.parentElement) : false;
            const activeFigureCords = activeFigure ? activeFigure._cords : false;
            const activeFigureAvailableMoves = activeFigure ? activeFigure.getAvailableMoves(activeFigure._cords) : [];
            const targetFigure = Utility.getFigureByCords(targetCords);

            if ((!activeFigureElement && targetFigureField.firstChild) ||(activeFigure && JSON.stringify(activeFigure._cords) === JSON.stringify(targetCords))) {
                Utility.selfFigureClicked(Utility.getFigureByCords(targetCords));
            }

            if (activeFigureElement && activeFigure &&activeFigureAvailableMoves.filter((move): boolean => JSON.stringify(move) === JSON.stringify(targetCords)).length) {
                activeFigure.cords = targetCords;
                if (targetFigure && activeFigure._color !== targetFigure._color) {
                    targetFigure.remove();
                }
            } else if (activeFigure && targetFigure && activeFigure._color === targetFigure._color && JSON.stringify(targetCords) !== JSON.stringify(activeFigureCords)) {
                Utility.deactivateFigure(activeFigure);
                Utility.activateFigure(targetFigure);
            }
        }
    });
}

export class Piece {
    public getAvailableMoves: availableMoves;

    constructor(
        public _pieceType: PieceType,
        public _color: Color,
        public _cords: ICords,
        public _ID: string,
        public _isActive = false
    ) {
        this.getAvailableMoves = gameConfig.chessPieces[this._pieceType].getAvailableMoves;
        gameConfig.figures[this._ID] = this;

        this.createFigure();
    }

    logFigure(): void {
        console.log(this);
    }

    createFigure(): void {
        Utility.getElementByCords(this._cords).appendChild(this.pieceElement);
    }

    set cords(newCords: ICords) {
        const figureElement = this.DOMElement;
        const finishMoveSequence = (): void => {
            const figureElement = this.DOMElement as HTMLElement;
            if (figureElement) {
                figureElement.removeAttribute("style");
                figureElement.classList.remove("transforming");
                Utility.getElementByCords(newCords).appendChild(figureElement);
                figureElement.removeEventListener("transitionend", finishMoveSequence);
                Utility.getFigureByCords(newCords)._isActive = false;
            }
        };

        if (figureElement) {
            figureElement.addEventListener("transitionend", finishMoveSequence);
            figureElement.classList.add("transforming");
            figureElement.classList.remove("active");
            figureElement.style.transform = `translateY(${100 * (this._cords.y - newCords.y)}%) translateX(${100 *(newCords.x - this._cords.x)}%)`;
        }

        this._cords = newCords;
    }

    remove(): void {
        const elementToRemove = this.DOMElement;

        if (elementToRemove) {
            const finishRemoveSequence = () => {
                const figureElement = this.DOMElement as HTMLElement;
                if (figureElement) {
                    figureElement.removeAttribute("style");
                    figureElement.classList.remove("transforming");
                    figureElement.removeEventListener("transitionend", finishRemoveSequence);
                    elementToRemove.remove();
                    delete gameConfig.figures[this._ID]
                }
            };

            elementToRemove.addEventListener("transitionend", finishRemoveSequence);
            elementToRemove.classList.add("transforming");
            elementToRemove.style.opacity = "0";
        }
    }

    get pieceElement(): HTMLDivElement {
        let pieceElement = document.createElement("div");
        let pieceImg = document.createElement("img");

        pieceElement.id = this._ID;
        pieceElement.classList.add("chess-figure", `${this._color}-figure`);

        pieceImg.src = gameConfig.chessPieces[this._pieceType] ? gameConfig.chessPieces[this._pieceType].asset : gameConfig.chessPieces[this._pieceType].asset;
        pieceElement.appendChild(pieceImg);

        return pieceElement;
    }

    get DOMElement(): HTMLElement {
        return document.querySelector("#" + this._ID) as HTMLElement;
    }
}
