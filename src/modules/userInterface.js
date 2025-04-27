import { Resolver } from "webpack";
import { findShip } from "../modules/commonHandlers.js";

export function renderBoard(player) {
  const ships = player.gameBoard.ships;
  const placementArray = player.gameBoard.placementGrid

  const board = (player.bot) ? document.querySelector(".computer-board") : document.querySelector(".user-board")
  board.innerHTML = ''
  const header = document.createElement("h2");
  header.textContent = `${(player.name).charAt(0).toUpperCase() + (player.name).slice(1)}'s Board`
  board.appendChild(header)

  const tempBoard = document.createDocumentFragment();
  const letterRow = document.createElement("div");
  letterRow.classList.add("row-cell");

  const emptyCell = document.createElement("div");
  emptyCell.classList.add("header-cell");
  letterRow.appendChild(emptyCell);

  for (let i = 0; i < 10; i++) {
    const letterCell = document.createElement("div");
    letterCell.classList.add("header-cell");
    letterCell.textContent = `${String.fromCharCode(65 + i)}`;
    letterRow.appendChild(letterCell);
  }
  tempBoard.appendChild(letterRow);
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.classList.add("row-cell");
    row.dataset.row = i;
    const numberCell = document.createElement("div");
    numberCell.classList.add("header-cell");
    numberCell.textContent = i + 1;
    row.appendChild(numberCell);

    for (let j = 0; j < 10; j++) {
      const col = document.createElement("div");
      col.classList.add("col-cell");
      
      col.dataset.row = i;
      col.dataset.col = j;
      
    //   if (
    //     ships.some((ship) => ship.position.some(([x, y]) => x == i && y == j))
    //   ) {
    //     col.classList.add("ship");
    //   }
        switch(placementArray[i][j]){
            case 'ship':
                col.classList.add("ship");
                if(!player.bot){
                  col.setAttribute("draggable",true)
                }
                col.id = `Ship${findShip(ships,i,j).length}`
                break;
            case 'hit':
                col.classList.add("hit");
                break;
            case 'm':
                col.classList.add("mark");
                break;
            case 'miss':
                col.classList.add("miss");
                break;
        }
      row.appendChild(col);
    }
    tempBoard.appendChild(row);
  }
  board.appendChild(tempBoard);
}
