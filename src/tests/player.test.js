import { Player } from "../modules/player.js";
import { gameBoard } from "../modules/gameBoard";
import { Ship } from "../modules/ship.js";

describe('Player Test',()=>{
    let player1 = new Player('rocky',  false)
    let player2 = new Player('Bot',  true)
    player1.gameBoard.placeShip(new Ship(2), 2,3, 'horizontal')
    player2.gameBoard.placeShip(new Ship(4), 2,3, 'vertical')
    test('player attack bot',()=>{
        expect(player1.attack(player2, 2,3)).toBeUndefined();
    })
    test('bot attack player',()=>{
        expect(player2.attack(player1)).toBeUndefined();
    })
})
