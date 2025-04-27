//index.js
import "./style.css";
import { delay, findShip } from "./modules/commonHandlers.js";
import { Player } from "./modules/player.js";
import { renderBoard } from "./modules/userInterface.js";
import { differenceInCalendarISOWeekYears } from "date-fns/fp";
import { da } from "date-fns/locale";

let user, bot;
let currentTurn = "user";
let playerName = prompt("Enter Player1 name");
user = new Player(playerName, false);
bot = new Player("bot", true);
user.randomizeShips();
bot.randomizeShips();

// user.gameBoard.placeShip(new Ship(2), 0,1, 'horizontal')

//const buttonContainer = document.querySelector('.button-container')
const buttonContainer = document.querySelectorAll(".game-button");
const computerBoard = document.querySelector(".computer-board");
const startBtn = document.querySelector("#gameStateToggle");
const randomBtn = document.querySelector("#randomPlacement");

computerBoard.classList.toggle("active", true);
renderBoard(user);
renderBoard(bot);

document.addEventListener("gameOver", (e) => {
  console.log(`the loser is ${e.detail.loser}`);
  console.log(
    `The winner is ${e.detail.loser === bot.name ? user.name : bot.name}`
  );
  const gameOverModal = document.querySelector(".game-over.modal");
  if (gameOverModal) {
    const winnerName = gameOverModal.querySelector(".winner-name");
    if (winnerName) {
      winnerName.textContent = `${
        e.detail.loser === bot.name ? user.name : bot.name
      }`;
    }
    gameOverModal.style.display = "flex";
  } else {
    console.log("Error in fetchinf Game Over modal");
  }
});
buttonContainer.forEach((button) => {
  button.addEventListener("click", (e) => {
    const id = e.target.id;
    switch (id) {
      case "randomPlacement":
        try {
          user.randomizeShips();
          console.log("check bfor render : ");
          console.log(user.gameBoard.placementGrid);
          renderBoard(user);
          renderBoard(bot);
        } catch (err) {
          console.log(err);
        }
        break;
      case "gameStateToggle":
        gameStateHandler();
        break;
      case "startNewGame":
        gameStateHandler();
        break;
    }
  });
});

computerBoard.addEventListener("click", (e) => {
  randomBtn.style.display = "none";
  let x = parseInt(e.target.dataset.row, 10);
  let y = parseInt(e.target.dataset.col, 10);
  if (currentTurn != "user") {
    console.log("Not your turn");
    return;
  }
  console.log(`attacking : ${x} and ${y}`);
  let isHitUser = user.attack(bot, x, y);
  renderBoard(bot);
  if (!isHitUser) {
    switchTurn();
  }
});

function gameStateHandler() {
  const gameOverModal = document.querySelector(".game-over.modal");
  if (gameOverModal) {
    gameOverModal.style.display = "none";
  }
  randomBtn.style.display = "inline-block";
  user = new Player(playerName, false);
  bot = new Player("bot", true);
  user.randomizeShips();
  bot.randomizeShips();
  computerBoard.classList.toggle("active", true);
  renderBoard(user);
  renderBoard(bot);
}

async function switchTurn() {
  const userBoard = document.querySelector(".user-board");
  const botBoard = document.querySelector(".computer-board");
  currentTurn = currentTurn == "user" ? "bot" : "user";
  if (currentTurn == "user") {
    currentTurn == "bot";
    userBoard.classList.toggle("active", false);
    botBoard.classList.toggle("active", true);
  } else if (currentTurn == "bot") {
    currentTurn == "user";
    userBoard.classList.toggle("active", true);
    botBoard.classList.toggle("active", false);
  }
  if (currentTurn == "bot") {
    await delay(2000);
    let isHitBot = bot.attack(user);
    renderBoard(user);
    while (isHitBot) {
      await delay(2000);
      isHitBot = bot.attack(user);
      renderBoard(user);
    }
    switchTurn();
  }
}

// document.addEventListener("dragstart", (e) => {
//   if (e.target.classList.contains("ship")) {
//     const row = parseInt(e.target.dataset.row, 10);
//     const col = parseInt(e.target.dataset.col, 10);
//     const shipData = findShip(user.gameBoard.ships, row, col);
//     if (!shipData) {
//       console.log("No valid shipData found at dragStart");
//       return;
//     }
//     e.dataTransfer.effectAllowed = "move";
//     const dragImg = document.createElement("div");
//     dragImg.classList.add("drag-image");
//     dragImg.style.display = "flex"
//     dragImg.style.flexDirection = shipData.orientation === 'horizontal' ? 'row' : 'column'

//     shipData.position.forEach(([x, y]) => {
//       const shipCell = document.createElement("div");
//       shipCell.classList.add("ship", "dragging");
//       dragImg.appendChild(shipCell);
//     });
//     document.body.appendChild(dragImg);
//     e.dataTransfer.setDragImage(dragImg, 0, 0);

//     document.body.setAttribute("tabindex", "0")
//     document.body.focus()

//     function rotateOnKeyDown(e){
//         if(e.key === 'r' || e.key === 'R'){
//             e.preventDefault()
//             shipData.orientation = shipData.orientation == 'horizontal' ? 'vertical' : 'horizontal'
//             console.log(`roatating : ${shipData.orientation}`) // still the dragImg is not rotatting while i press r and even this console log is not printing
//             dragImg.style.flexDirection = shipData.orientation === 'horizontal' ? 'row' : 'column'
//         }
//     }
//     console.log('adding keydown')
//     document.addEventListener('keydown', rotateOnKeyDown)

//     // setTimeout(() => document.body.removeChild(dragImg), 0);
//     e.dataTransfer.setData("application/json", JSON.stringify(shipData));

//     e.target.addEventListener('dragend', ()=>{
//         console.log('removing keydown')
//         document.removeEventListener('keydown', rotateOnKeyDown)
//         document.body.removeChild(dragImg)
//     }, {once: true})
//   }
// });
// window.addEventListener('keydown', (e)=>{
//     console.log('key pressed : ', e.key)
// })
// document.addEventListener("dragstart", (e) => {
//     console.log('drag started')
//     if (e.target.classList.contains("ship")) {
//         console.log('ship drag started')
//       const row = parseInt(e.target.dataset.row, 10);
//       const col = parseInt(e.target.dataset.col, 10);
//       const shipData = findShip(user.gameBoard.ships, row, col);
//       if (!shipData) return;
  
//       const dragImg = document.createElement("div");
//       dragImg.classList.add("drag-image");
//       dragImg.style.display = "flex";
//       dragImg.style.flexDirection = shipData.orientation === 'horizontal' ? 'row' : 'column';
//       dragImg.id = 'current-drag-image';
  
//       shipData.position.forEach(([x, y]) => {
//         const shipCell = document.createElement("div");
//         shipCell.classList.add("ship", "dragging");
//         dragImg.appendChild(shipCell);
//       });
  
//       document.body.appendChild(dragImg);
//       e.dataTransfer.setDragImage(dragImg, 0, 0);
  
//       // Track if we're currently dragging
//       window.isDragging = true;
  
//       const cleanup = () => {
//         console.log('drag ended')
//         window.isDragging = false;
//         const dragImage = document.getElementById('current-drag-image');
//         if (dragImage && dragImage.parentNode) {
//           dragImage.parentNode.removeChild(dragImage);
//         }
//       };
  
//       e.target.addEventListener('dragend', cleanup, { once: true });
//       window.addEventListener('dragend', cleanup, { once: true });
  
//       e.dataTransfer.setData("application/json", JSON.stringify(shipData));
//       e.dataTransfer.effectAllowed = "move";
//     }
//   });
  
//   // Handle rotation using document-level keyboard event
//   document.addEventListener('keydown', (e) => {
//     if (!window.isDragging) return;
    
//     console.log('Key pressed while dragging:', e.key);
    
//     if (e.key.toLowerCase() === 'r') {
//       e.preventDefault();
//       console.log('Rotating ship');
      
//       const currentDragImg = document.getElementById('current-drag-image');
//       if (currentDragImg) {
//         const currentOrientation = currentDragImg.style.flexDirection;
//         const newOrientation = currentOrientation === 'row' ? 'column' : 'row';
//         currentDragImg.style.flexDirection = newOrientation;
//         console.log(`Rotated to ${newOrientation}`);
//       }
//     }
//   });

// window.isDragging = false;
// window.currentShipData = null;

// document.addEventListener("dragstart", (e) => {
//     if (e.target.classList.contains("ship")) {
//         console.log('ship drag started');
        
//         // Set dragging state FIRST
//         window.isDragging = true;

//         document.body.setAttribute("tabindex", "-1")
//         document.body.focus()
        
//         const row = parseInt(e.target.dataset.row, 10);
//         const col = parseInt(e.target.dataset.col, 10);
//         const shipData = findShip(user.gameBoard.ships, row, col);
//         if (!shipData) return;
        
//         // Store shipData globally so rotation handler can access it
//         window.currentShipData = shipData;

//         const dragImg = document.createElement("div");
//         dragImg.classList.add("drag-image");
//         dragImg.style.display = "flex";
//         dragImg.style.flexDirection = shipData.orientation === 'horizontal' ? 'row' : 'column';
//         dragImg.id = 'current-drag-image';

//         shipData.position.forEach(([x, y]) => {
//             const shipCell = document.createElement("div");
//             shipCell.classList.add("ship", "dragging");
//             dragImg.appendChild(shipCell);
//         });

//         document.body.appendChild(dragImg);
//         e.dataTransfer.setDragImage(dragImg, 0, 0);

//         const cleanup = () => {
//             console.log('drag ended');
//             window.isDragging = false;
//             window.currentShipData = null;
//             const dragImage = document.getElementById('current-drag-image');
//             if (dragImage && dragImage.parentNode) {
//                 dragImage.parentNode.removeChild(dragImage);
//             }
//         };

//         e.target.addEventListener('dragend', cleanup, { once: true });
//         window.addEventListener('dragend', cleanup, { once: true });

//         e.dataTransfer.setData("application/json", JSON.stringify(shipData));
//         e.dataTransfer.effectAllowed = "move";
//     }
// });

// // Handle rotation using document-level keyboard event
// window.addEventListener('keydown', (e) => {
//     console.log('Key pressed:', e.key, 'isDragging:', window.isDragging); // this log is only logging when i am not dragging, the eventListener seem to get into effect whn i am not dragging
    
//     if (!window.isDragging || !window.currentShipData) return;
    
//     if (e.key.toLowerCase() === 'r') {
//         e.preventDefault();
//         console.log('Rotating ship');
        
//         // Update the shipData orientation
//         window.currentShipData.orientation = 
//             window.currentShipData.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        
//         // Update the drag image
//         const currentDragImg = document.getElementById('current-drag-image');
//         if (currentDragImg) {
//             currentDragImg.style.flexDirection = 
//                 window.currentShipData.orientation === 'horizontal' ? 'row' : 'column';
//             console.log(`Rotated to ${window.currentShipData.orientation}`);
//         }
//     }
// });

// document.addEventListener("dragover", (e) => {
//   if (e.target.classList.contains("col-cell")) {
//     e.preventDefault(); 
//     e.dataTransfer.dropEffect = "move"; 
//   }
// });

// document.addEventListener("drop", (e) => {
//   e.preventDefault();
//   if (!e.target.classList.contains("col-cell")) return;
//   const data = e.dataTransfer.getData("application/json");
//   if (!data) {
//     console.log("undefined data passed to drop event");
//     return;
//   }
//   const ship = JSON.parse(data);
//   const oldRow = ship.position[0][0];
//   const oldCol = ship.position[0][1];
//   const shipIdx = user.gameBoard.ships.findIndex((s) => {
//     return s.position.some((pos) => {
//       return pos[0] == oldRow && pos[1] == oldCol;
//     });
//   });
//   const shipPositions = ship.position;
//   const shipOrientation = ship.orientation;

//   const targetCell = e.target.closest(".col-cell"); // Ensure correct element
//   if (!targetCell) {
//     console.error("Drop target is not a valid cell:", e.target);
//     return;
//   }

//   const newRow = parseInt(targetCell.dataset.row, 10);
//   const newCol = parseInt(targetCell.dataset.col, 10);

//   try {
//     user.gameBoard.placeShip(ship, newRow, newCol, shipOrientation);
//   } catch (err) {
//     console.log("ERROR : " + err);
//     return;
//   }
//   user.gameBoard.ships.splice(shipIdx, 1);
//   shipPositions.forEach(([x, y]) => {
//     if (
//       !user.gameBoard.ships
//         .find((s) => s.length == ship.length)
//         .position.some((pos) => {
//           return pos[0] == x && pos[1] == y;
//         })
//     ) {
//       user.gameBoard.placementGrid[x][y] = 0;
//     }
//   });
//   renderBoard(user);
// });

const gameState = {
    isDragging: false,
    currentShipData: null
};

// Utility function to create drag image
function createDragImage(shipData) {
    const dragImg = document.createElement("div");
    dragImg.classList.add("drag-image");
    dragImg.style.display = "flex";
    dragImg.style.flexDirection = shipData.orientation === 'horizontal' ? 'row' : 'column';
    dragImg.id = 'current-drag-image';

    shipData.position.forEach(() => {
        const shipCell = document.createElement("div");
        shipCell.classList.add("ship", "dragging");
        dragImg.appendChild(shipCell);
    });

    return dragImg;
}

// Cleanup function for drag operations
function cleanupDrag() {
    console.log('drag ended');
    gameState.isDragging = false;
    gameState.currentShipData = null;
    const dragImage = document.getElementById('current-drag-image');
    if (dragImage && dragImage.parentNode) {
        dragImage.parentNode.removeChild(dragImage);
    }
}

// Handle ship rotation
function handleShipRotation(e) {
    console.log('Keyboard event:', e.key, 'isDragging:', gameState.isDragging, 'shipData:', !!gameState.currentShipData);
    
    if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        
        // Even if we're not dragging, log this to verify the handler is working
        console.log('R key pressed');
        
        if (!gameState.isDragging || !gameState.currentShipData) {
            console.log('Not currently dragging or no ship data');
            return;
        }
        
        console.log('Rotating ship');
        
        // Update the shipData orientation
        gameState.currentShipData.orientation = 
            gameState.currentShipData.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        
        // Update the drag image
        const currentDragImg = document.getElementById('current-drag-image');
        if (currentDragImg) {
            currentDragImg.style.flexDirection = 
                gameState.currentShipData.orientation === 'horizontal' ? 'row' : 'column';
            console.log(`Rotated to ${gameState.currentShipData.orientation}`);
        } else {
            console.log('Could not find drag image element');
        }
    }
}

// Initialize drag and drop handlers
document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("ship")) {
        console.log('ship drag started');
        
        // Set dragging state
        gameState.isDragging = true;
        
        const row = parseInt(e.target.dataset.row, 10);
        const col = parseInt(e.target.dataset.col, 10);
        const shipData = findShip(user.gameBoard.ships, row, col);
        if (!shipData) return;
        
        // Store shipData in game state
        gameState.currentShipData = shipData;

        // Create and append drag image
        const dragImg = createDragImage(shipData);
        document.body.appendChild(dragImg);
        e.dataTransfer.setDragImage(dragImg, 0, 0);

        // Set up cleanup listeners
        e.target.addEventListener('dragend', cleanupDrag, { once: true });
        window.addEventListener('dragend', cleanupDrag, { once: true });

        // Set transfer data
        e.dataTransfer.setData("application/json", JSON.stringify(shipData));
        e.dataTransfer.effectAllowed = "move";
    }
});

// Handle rotation using document-level keyboard event
// Add the event listener with capture phase to ensure it gets the event first
document.addEventListener('keydown', handleShipRotation, true);

// Also add the handler to the drag image itself
document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains("ship")) {
        // Add keydown handler to the document during drag
        const keyHandler = (e) => {
            handleShipRotation(e);
        };
        document.addEventListener('keydown', keyHandler);
        
        // Remove it when drag ends
        const cleanup = () => {
            document.removeEventListener('keydown', keyHandler);
            cleanupDrag();
        };
        
        e.target.addEventListener('dragend', cleanup, { once: true });
        window.addEventListener('dragend', cleanup, { once: true });
    }
});

document.addEventListener("dragover", (e) => {
    if (e.target.classList.contains("col-cell")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }
});

document.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!e.target.classList.contains("col-cell")) return;
    
    const data = e.dataTransfer.getData("application/json");
    if (!data) {
        console.log("undefined data passed to drop event");
        return;
    }
    
    // Get the ship data and update it with any rotation that occurred during drag
    const ship = JSON.parse(data);
    if (gameState.currentShipData) {
        ship.orientation = gameState.currentShipData.orientation;
    }
    
    const oldRow = ship.position[0][0];
    const oldCol = ship.position[0][1];
    const shipIdx = user.gameBoard.ships.findIndex((s) => {
        return s.position.some((pos) => pos[0] === oldRow && pos[1] === oldCol);
    });
    
    const shipPositions = ship.position;
    const targetCell = e.target.closest(".col-cell");
    
    if (!targetCell) {
        console.error("Drop target is not a valid cell:", e.target);
        return;
    }

    const newRow = parseInt(targetCell.dataset.row, 10);
    const newCol = parseInt(targetCell.dataset.col, 10);

    try {
        user.gameBoard.placeShip(ship, newRow, newCol, ship.orientation);
    } catch (err) {
        console.log("ERROR : " + err);
        return;
    }

    // Update game board state
    user.gameBoard.ships.splice(shipIdx, 1);
    shipPositions.forEach(([x, y]) => {
        const newShip = user.gameBoard.ships.find((s) => s.length === ship.length);
        if (!newShip.position.some((pos) => pos[0] === x && pos[1] === y)) {
            user.gameBoard.placementGrid[x][y] = 0;
        }
    });
    
    renderBoard(user);
});