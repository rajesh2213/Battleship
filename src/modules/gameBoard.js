export function gameBoard(name) {
  let placementGrid = _createGrid();
  let ships = [];
  let owner = name

  function placeShip(ship, x, y, orientation) {
    if (!validatePosition(ship, x, y, orientation)) {
      console.log(`ship : ${ship.length} x: ${x} y: ${y} axis: ${orientation}`);
      throw new Error("Invalid ship placement");
    }
    let positions = [];
    // console.log('In gameBoard PlaceShip fn : '+ship)
    for (let i = 0; i < ship.length; i++) {
      if (orientation == "horizontal") {
        placementGrid[x][y + i] = "ship";
        positions.push([x, y + i]);
        ship.orientation = "horizontal"
      } else if (orientation == "vertical") {
        placementGrid[x + i][y] = "ship";
        positions.push([x + i, y]);
        ship.orientation = "vertical"
      }
    }
    // console.log('In gameBoard PlaceShip fn positions : '+positions)
    ship.position = positions;
    ships.push(ship);
    // console.log(ships)
  }

  function receiveAttack(x, y) {
    console.log(`receiveing attack x : ${x} and y : ${y}`)
    if (placementGrid[x][y] == "ship") {
      placementGrid[x][y] = "hit";
      const ship = ships.find((s) =>{ return s.position.some((pos) => { return pos[0] == x && pos[1] == y })});

      if (ship) {
        // commenting out the diagonal hit, seemed too OP
        // const diagonal = _getDiagonal(x, y, ship);
        // diagonal.forEach(([i, j]) => {
        //   placementGrid[i][j] == 0
        //     ? (placementGrid[i][j] = "m")
        //     : receiveAttack(i, j);
        // });
        ship.hit();
        if(allShipsSunk()) {
          console.log('ALL SHIPS SUNK')
          document.dispatchEvent(new CustomEvent("gameOver", {
            detail: {loser: owner}
          }))
        }
        console.log('hitting')
        return true
      }
    } else if (placementGrid[x][y] == 0) {
      placementGrid[x][y] = "miss";
      console.log('missing')
      return false
    }else if(placementGrid[x][y] == 'hit'){
      return true
    }
  }

  function _getDiagonal(x, y, ship) {
    const potentialDiagonals = [
      [x - 1, y - 1], // Top-left
      [x - 1, y + 1], // Top-right
      [x + 1, y - 1], // Bottom-left
      [x + 1, y + 1], // Bottom-right
    ];
    let diagonals = potentialDiagonals.filter(
      ([x, y]) =>
        x >= 0 &&
        x < 10 &&
        y >= 0 &&
        y < 10 &&
        placementGrid[x][y] != "miss" &&
        placementGrid != "hit"
    );
    return diagonals;
  }

  function allShipsSunk() {
    console.log('inininin')
    console.log(ships)
    return ships.every((ship) => ship.sunk == true);
  }

  function _createGrid() {
    return Array.from({ length: 10 }, () => Array(10).fill(0));
  }

  function resetBoard() {
    placementGrid.splice(0, placementGrid.length, ..._createGrid());
    ships.length = 0;
 }

  function validatePosition(ship, x, y, orientation) {
    // Ensure coordinates are within the grid
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      console.log(`Value out of bounds: (${x}, ${y})`);
      return false;
    }
    // Check horizontal placement
    if (orientation === "horizontal") {
      if (y + ship.length > 10) {
        console.log(
          `Horizontal ship placement exceeds grid: (${x}, ${y}) with length ${ship.length}`
        );
        return false;
      }
      for (let i = 0; i < ship.length; i++) {
        if (placementGrid[x][y + i] !== 0 && !ship.position.some((pos) => {
          return pos[0] == x && pos[1] == y + i;
        })) { 
          console.log(ship.position)
          console.log(`Horizontal collision at (${x}, ${y + i})`);
          return false;
        }
      }
      return true;
    }
    // Check vertical placement
    if (orientation === "vertical") {
      if (x + ship.length > 10) {
        console.log(
          `Vertical ship placement exceeds grid: (${x}, ${y}) with length ${ship.length}`
        );
        return false;
      }
      for (let i = 0; i < ship.length; i++) {
        if (placementGrid[x + i][y] !== 0) {
          console.log(`Vertical collision at (${x + i}, ${y})`);
          return false;
        }
      }
      return true;
    }
    return false;
  }

  return {
    placementGrid,
    ships,
    placeShip,
    resetBoard,
    receiveAttack,
    allShipsSunk,
    validatePosition,
  };
}
