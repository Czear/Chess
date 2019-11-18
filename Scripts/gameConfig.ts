import pawnSVG from '@Assets/chess-pawn.svg'
import rookSVG from '@Assets/chess-rook.svg'
import knightSVG from '@Assets/chess-knight.svg'
import bishopSVG from '@Assets/chess-bishop.svg'
import queenSVG from '@Assets/chess-queen.svg'
import kingSVG from '@Assets/chess-king.svg'
import { Utility } from './utilities'

class FigureSetup {
    constructor(public id: number, public cords: ICords) {

    }
}

class GameConfig {
    public chessPieces: IChessPieces;
    public figures: IIngameFigures;
    constructor() {
        this.chessPieces = {
            king : {
                asset: kingSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {
                    let moveCors = [];
                    const targetFigure = Utility.getFigureByCords(cordsConfig);

                    for(let Xindex = -1; Xindex < 2; Xindex++) {
                        for(let Yindex = -1; Yindex < 2; Yindex++) {
                            if(Xindex || Yindex){
                                let moveCords: ICords = {x: 0, y: 0};

                                moveCords.x = cordsConfig.x + Xindex;
                                moveCords.y = cordsConfig.y + Yindex;

                                if(moveCords.x >= 0 && moveCords.x < 8 && moveCords.y >= 0 && moveCords.y < 8){
                                    const cordsFigure = Utility.getFigureByCords(moveCords);

                                        if(!cordsFigure || (targetFigure && cordsFigure && cordsFigure._color !== targetFigure._color)) {
                                            moveCors.push(moveCords)
                                        }
                                }
                            }
                        }
                    }

                    return moveCors
                },
                startingPositions: {
                    'white': [new FigureSetup(0, {x: 4, y: 0})],
                    'black': [new FigureSetup(0, {x: 4, y: 7})]
                }
            },

            queen: {
                asset: queenSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {
                    const getFields = (checkingAxis: Axis): ICords[] => {
                        let moveCors: ICords[] = [];

                            const moveFunctions = [Utility.getStraightFields, Utility.getSlantFields];
                            moveFunctions.forEach(moveFunction => {
                                moveCors.push(...moveFunction('up', checkingAxis, cordsConfig), ...moveFunction('down', checkingAxis, cordsConfig))
                            });
                        return moveCors
                    };
                    return [
                        ...getFields('x'),
                        ...getFields('y')
                    ]
                },
                startingPositions: {
                    'white': [new FigureSetup(0, {x: 3, y: 0})],
                    'black': [new FigureSetup(0, {x: 3, y: 7})]
                }
            },
            rook: {
                asset: rookSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {
                    const getFields = (checkingAxis: Axis): ICords[] => [ ...Utility.getStraightFields('up', checkingAxis, cordsConfig), ...Utility.getStraightFields('down', checkingAxis, cordsConfig)];
                    return [
                        ...getFields('x'),
                        ...getFields('y')
                    ]
                },
                startingPositions: {
                    'white': [new FigureSetup(0, {x: 0, y: 0}), new FigureSetup(1, {x: 7, y: 0})],
                    'black': [new FigureSetup(0, {x: 0, y: 7}), new FigureSetup(1, {x: 7, y: 7})]
                }
            },

            bishop: {
                asset: bishopSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {
                    const getFields = (checkingAxis: Axis): ICords[] =>  [ ...Utility.getSlantFields('up', checkingAxis, cordsConfig), ...Utility.getSlantFields('down', checkingAxis, cordsConfig)];

                    return [
                        ...getFields('x'),
                        ...getFields('y')
                    ]
                },
                startingPositions: {
                    'white': [new FigureSetup(0, {x: 2, y: 0}), new FigureSetup(1, {x: 5, y: 0})],
                    'black': [new FigureSetup(0, {x: 2, y: 7}), new FigureSetup(1, {x: 5, y: 7})]
                }
            },

            knight: {
                asset: knightSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {

                    const validateJumpCords = (jumpCords: ICords[]): ICords[] | [] => {
                        let validCords: ICords[] = [];

                        jumpCords.forEach((possibleCords: ICords) => {
                            if(possibleCords.x > -1 && possibleCords.x < 8 && possibleCords.y > -1 && possibleCords.y < 8){
                                const targetPiece = Utility.getFigureByCords(cordsConfig);
                                const possiblePiece = Utility.getFigureByCords(possibleCords);

                                if(!possiblePiece || (possiblePiece._color !== targetPiece._color)) {
                                    validCords.push(possibleCords)
                                }

                            }
                        });

                        return validCords
                    };

                    const getKnightFields = (direction: Direction, axis: Axis): ICords[] => {
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

                        return validateJumpCords([{
                            x: cordsConfig.x + Xincremeter,
                            y: cordsConfig.y + Yincremeter * 2
                        },{
                            x: cordsConfig.x + Xincremeter * 2,
                            y: cordsConfig.y + Yincremeter
                        }]);
                    };

                    const getFields = (checkingAxis: Axis) => [ ...getKnightFields('up', checkingAxis), ...getKnightFields('down', checkingAxis)];

                    return [
                        ...getFields('x'),
                        ...getFields('y')
                    ]
                },
                startingPositions: {
                    'white': [new FigureSetup(0, {x: 1, y: 0}), new FigureSetup(1, {x: 6, y: 0})],
                    'black': [new FigureSetup(0, {x: 1, y: 7}), new FigureSetup(1, {x: 6, y: 7})]
                }
            },

            pawn: {
                asset: pawnSVG,
                getAvailableMoves: (cordsConfig: ICords): ICords[] => {
                    let moveCors: ICords[] = [];
                    const targetFigure = Utility.getFigureByCords(cordsConfig);

                        if(targetFigure) {
                            const addValue = targetFigure._color === 'white' ? 1 : -1;
                            const nextFieldCords: ICords = {
                                ...cordsConfig,
                                y : cordsConfig.y + addValue
                            };

                            const potentialEnemiesSpots = [{
                                ...nextFieldCords,
                                x: nextFieldCords.x-1
                            },{
                                ...nextFieldCords,
                                x: nextFieldCords.x+1
                            }];

                            if(!Utility.getFigureByCords(nextFieldCords)) {
                                moveCors.push(nextFieldCords)
                            }

                            potentialEnemiesSpots.forEach(possibleEnemyCords => {
                                const possibleEnemyPiece = Utility.getFigureByCords(possibleEnemyCords);

                                if(possibleEnemyPiece && possibleEnemyPiece._color !== targetFigure._color) {
                                    moveCors.push(possibleEnemyCords)
                                }
                            });

                            if((targetFigure._color === 'black' && cordsConfig.y === 6) || (targetFigure._color === 'white' && cordsConfig.y === 1)) {
                                moveCors.push({
                                    ...cordsConfig,
                                    y : cordsConfig.y + 2 * addValue
                                })
                            }
                        }

                    return moveCors
                },
                startingPositions: {
                    'white': [
                        new FigureSetup(0, {x: 0, y: 1}),
                        new FigureSetup(1, {x: 1, y: 1}),
                        new FigureSetup(2, {x: 2, y: 1}),
                        new FigureSetup(3, {x: 3, y: 1}),
                        new FigureSetup(4, {x: 4, y: 1}),
                        new FigureSetup(5, {x: 5, y: 1}),
                        new FigureSetup(6, {x: 6, y: 1}),
                        new FigureSetup(7, {x: 7, y: 1})
                    ],
                    'black': [
                        new FigureSetup(0, {x: 0, y: 6}),
                        new FigureSetup(1, {x: 1, y: 6}),
                        new FigureSetup(2, {x: 2, y: 6}),
                        new FigureSetup(3, {x: 3, y: 6}),
                        new FigureSetup(4, {x: 4, y: 6}),
                        new FigureSetup(5, {x: 5, y: 6}),
                        new FigureSetup(6, {x: 6, y: 6}),
                        new FigureSetup(7, {x: 7, y: 6})
                    ]
                }
            }
        };

        this.figures = {

        }
    }
}

export const gameConfig = new GameConfig();