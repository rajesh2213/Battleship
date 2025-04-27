import { gameBoard } from "../modules/gameBoard";
import { Ship } from "../modules/ship.js";

describe("GameBoard", () => {
  let ship;
  let testBoard;
  beforeEach(() => {
    ship = new Ship(3);
    testBoard = gameBoard();
  });

  test("validating positions eg 2", () => {
    expect(() => testBoard.placeShip(ship, 0, 8, "horizontal")).toThrow(
      "Invalid ship placement"
    );
  });
});

describe("Placing ship", () => {
  let ship;
  let ship2;
  let ship3;
  let testBoard;
  ship = new Ship(3);
  ship2 = new Ship(5);
  ship3 = new Ship(2);
  testBoard = gameBoard();

  test("pasing at correct position", () => {
    expect(testBoard.placeShip(ship, 0, 1, "horizontal")).toBeUndefined();
  });
  test("pasing at correct position eg2", () => {
    expect(testBoard.placeShip(ship2, 3, 8, "vertical")).toBeUndefined();
  });
  test("pasing at correct position eg3", () => {
    expect(testBoard.placeShip(ship3, 3, 6, "horizontal")).toBeUndefined();
  });
  test("receive attack", () => {
    testBoard.receiveAttack(1, 8);
    testBoard.receiveAttack(4, 8);
    expect(testBoard.receiveAttack(5, 8)).toBeUndefined();
  });
});
