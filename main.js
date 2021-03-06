var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var Grid = new grid(canvas.width, canvas.height, 200);

function clearCanvas() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function checkColliding(clicks) {
    //this checks if a click position ends in any cell & retruns it.
    let clickX = clicks[0];
    let clickY = clicks[1];

    let cellList = Grid.getGrid();
    
    for (let y = 0; y < cellList.length; y++) {
        let Cell = cellList[y];
        if (
            Cell.getX() + Grid.getDim() > clickX &&
            Cell.getX() < clickX &&
            Cell.getY() + Grid.getDim() > clickY &&
            Cell.getY() < clickY
        ) {
            return Cell;
        } 
    } 
    alert("cell not found at position [" + clickX + ', ' + clickY + '].');
}

function LeftClick (Cell) {
    if (!Cell.isFlagged()) {
        if (Cell.hasBomb()) { //loose if you clicked a bomb.s
            Cell.revealBomb();
            Grid.showBombs();
            return;
        }
        console.log('clicked cell [' + Cell.getInnerCoords()[0] + ',' + Cell.getInnerCoords()[1] + ']');
                
        // WHEN A CELL IS CLICKED
        Cell.hide(false);
        Cell.draw();
        console.log(Cell.getNum());

        let toCheck = [Cell];
        function check (Cells) { //if a lot of cells are empty are together, it will reveal a big portion of the map 
            let toCheckNext = [];
            for (kk = 0; kk < Cells.length; kk++) {
                Cell = Cells[kk];
                let adj = Grid.getAdjacentCells(Cell, 1);
                for (j = 0; j < adj.length; j++) {
                        let cCell = adj[j];
                        if (cCell.ishidden() && cCell.getNum() == 0) {
                            toCheckNext.push(cCell);
                        }
                        if (cCell.ishidden()) {
                            cCell.hide(false);
                            cCell.draw();
                            console.log('drawn');
                        }
                }
            }
            console.log('hh')
            return toCheckNext;
        }
        if (Cell.getNum() == 0) { //this will keep revealing cells until it can't.
            while (toCheck.length > 0) {
                toCheck = check(toCheck);
            }
        }
    }
}

function RightClick (Cell) {
    console.log('right click'); //Right click, flags a cell.
    if (Cell.ishidden()) {
        Cell.flag();
        Cell.draw();
    }
}

function updateBoard() { //may be used in future for restarting a game, currently useless.
    clearCanvas()
    Grid.drawAllBoard();
}

function startGame () {  //function called at start
    Grid.drawAllBoard();
    Grid.setNumbers ();
}

function getCursorPosition(canvas, event) { //will return the position of the click on event.
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    let result = [x,y];
    return result;
}

canvas.addEventListener('mousedown', function(e) { // listener for right and left click.
    let x = checkColliding(getCursorPosition(canvas, e))
    if(e.button == 0) {
        LeftClick(x);
    }
    else if (e.button == 2) {
        RightClick(x);
    }
});

canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); }, false); // this prevents de default of the right click but the functionality is done in the previous function

startGame();