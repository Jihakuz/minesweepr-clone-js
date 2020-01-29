const cells = [];
const hiderCells = [];
const flagCells = [];

let bombs = [];

const cols = 4;
const rows = 4;
const sqrSize = 200

let debug_y = rows * sqrSize;
let debug_sqrSize = 200 / flagCells.length;
	
const numBombs = 5;
let numFlags = 0;

let playing = true;
const debug = true;

let finish_text = "";

class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.center = [x + (sqrSize / 2), y + (sqrSize / 2)];
		this.touching = 0;
		

		this.display = () => {
			if (this.bomb){
				fill('red');
				square(this.x, this.y, sqrSize);
			} else {

				fill('white');			
				square(this.x, this.y, sqrSize);

				textSize(sqrSize / 4);
				fill('black');
				text(this.touching, this.center[0], this.center[1]);
			
			}	
		}

		this.updateNeighbours = () => {
			const checkCells = [[1,-1], [1,0], [1,1], [0,-1], [0,1], [-1,-1], [-1,0], [-1,1]];
			checkCells.forEach((yx) => {
				let lookY = (this.y / sqrSize) + yx[0]
				let lookX = (this.x / sqrSize) + yx[1]


				if (lookY > -1 && lookY < cells.length && lookX > -1 && lookX < cells[0].length) {
					cells[lookY][lookX].touching += 1;
				}
			});
		}
	}
}



function setup() {

	createCanvas(cols * sqrSize, rows * sqrSize + 200);	

	let placedBombs = 0

	for (i = 0; i < cols * rows; i++) {
		if (placedBombs < numBombs) {
			bombs.push(true);
			placedBombs ++;
		} else {
			bombs.push(false);
		}
	}

	tbombs = shuffle(bombs);
	bombs = [];
	
	while(tbombs.length) bombs.push(tbombs.splice(0,rows)); 

	console.log(bombs);


	for (y = 0; y < rows; y++) {
		let row = [];
		let rowH = [];
		let rowF = [];
		for (x = 0; x < cols; x++) {
			let c = new Cell(x * sqrSize, y * sqrSize);
			
			c.bomb = bombs[y][x];

			c.display();

			row.push(c);
			rowH.push(true);
			rowF.push(false);
		}
		cells.push(row);
		hiderCells.push(rowH);
		flagCells.push(rowF);
	}

	cells.forEach((row) => {
		row.forEach((cell) => {
			if (cell.bomb) {
				cell.updateNeighbours();
			}
		});
	});
}

function draw() {
	
	document.getElementById('numBombs').innerHTML = `Bombs: ${numBombs}`;
	document.getElementById('numFlags').innerHTML = `Flags: ${numFlags}`;

	background(255);

	if (playing)
	{
		for (y = 0; y < rows; y ++) {
			for (x = 0; x < cols; x ++) {
				if (flagCells[y][x]) {
					fill('blue');
					square(x * sqrSize, y * sqrSize, sqrSize);
				}else if (hiderCells[y][x]) {
					fill('green');
					square(x * sqrSize, y * sqrSize, sqrSize);
				} else {
					cells[y][x].display();
				}
			}
		}
		

	
		let same = true;
	
		for (y = 0; y < rows; y ++) {
			for (x = 0; x < cols; x ++) {
				if (bombs[y][x] == !flagCells[y][x])
				{
					same = false;
				}
			}
		}
	
		if (same) {
			playing = false;
			finish_text = "Win";
		}
	
		if (debug)
		{
		
			for (y = 0; y < rows; y ++) {
				for (x = 0; x < cols; x ++) {
					if (flagCells[y][x]){
						fill("blue");
					} else {
						fill("red");
					}
		
					square(x * debug_sqrSize, y * debug_sqrSize + debug_y, debug_sqrSize);
				}
			}
		
		
			for (y = 0; y < rows; y ++) {
				for (x = 0; x < cols; x ++) {
					if (bombs[y][x]){
						fill("red");
					} else {
						fill("blue");
					}
		
					square(x * debug_sqrSize + (debug_sqrSize * cols + 50), y * debug_sqrSize + debug_y, debug_sqrSize);
				}
			}
		}
	} else {
		document.getElementById("status").innerHTML = finish_text;
	}
}
	
	
function mousePressed() {
	console.log(`mouseX: ${mouseX}\tmouseY: ${mouseY}`);

	let mouseYX = [Math.floor(mouseY / sqrSize), Math.floor(mouseX / sqrSize)];

	if (mouseButton == LEFT && mouseX > 0 && mouseX < cols * sqrSize && mouseY > 0 && mouseY < rows * sqrSize)
	{
		const clickedCell = cells[mouseYX[0]][mouseYX[1]];
		const clickedHCell = hiderCells[mouseYX[0]][mouseYX[1]];
		
		console.log(clickedCell);

		if (clickedCell.bomb) {
			playing = false;
			finish_text = "Lose";
		} else if (clickedHCell) {
			hiderCells[mouseYX[0]][mouseYX[1]] = false;
		}



	} else if (mouseButton == CENTER) {
		flagCells[mouseYX[0]][mouseYX[1]] = !flagCells[mouseYX[0]][mouseYX[1]];
		numFlags += 1;
	}




}
