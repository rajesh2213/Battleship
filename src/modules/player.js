import { gameBoard } from "../modules/gameBoard";
import { Ship } from "../modules/ship.js";

export class Player {
  constructor(name, bot = false) {
    this.name = name;
    this.bot = bot;
    this.gameBoard = gameBoard(this.name);
    this.currentTurn = 'user'
  }
  

  attack(opponent, x=false, y=false){
    console.log(`x and y : ${x} , ${y}`)
    console.log(typeof(x))
    if(x === false && y === false){
        [x, y]  = this._generateBotMoves(opponent)
        console.log(`bot attacking : x : ${x} and y : ${y}`)
    }
    return opponent.gameBoard.receiveAttack(x,y)
  }

  _generateBotMoves(opponent){
    if(this.bot){
        let x, y;
        do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        } while (opponent.gameBoard.placementGrid[x][y] == "hit");
        return [x,y];
    }else{
        throw new Error('Player is not a bot')
    }
  }

    randomizeShips() {
      console.log('Randomizing ships...');
      if(this.bot == false){
        this.gameBoard.resetBoard()
      }
      let placed = new Set();
      const shipSizes = [2, 3, 4, 5]; 
      for (let size of shipSizes) {
          let ship = new Ship(size);
          let validPositions = [];
          // Precompute all valid positions instead of random guessing
          for (let x = 0; x < 10; x++) {
              for (let y = 0; y < 10; y++) {
                  if (this.gameBoard.validatePosition(ship, x, y, "horizontal")) {
                      validPositions.push({ x, y, orientation: "horizontal" });
                  }
                  if (this.gameBoard.validatePosition(ship, x, y, "vertical")) {
                      validPositions.push({ x, y, orientation: "vertical" });
                  }
              }
          }
          if (validPositions.length === 0) {
              console.error(`No valid positions left for ship of size ${size}.`);
              return;
          }
          let { x, y, orientation } = validPositions[Math.floor(Math.random() * validPositions.length)];
          try {
              this.gameBoard.placeShip(ship, x, y, orientation);
              placed.add(`${x},${y}`);
          } catch (err) {
              console.error(`Error placing ship:, err`);
          }
      }
  }

}