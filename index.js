/* Feature Notes 
* mouseover event - add hover class
* click canvas to start, click again to stop, hover to draw
* Pen colors - black, rainbow, warm/cold?, erase, random, *colorpicker*, 
    sketch (increment darkness), transparent?
* BG colors - white, colorpicker, grid on/off
* Grid size (dynamic- square size changes)- 16x16? or 1x1? to 100x100(10,000), slider? user prompt? 
    click btn - different increments
* Clear grid button, on grid size change- reset board/zoom ?
* Other - darken, lighten, color grabber, *fill* 
*/

const drawing_pad = document.querySelector("#drawing_pad");
const squares = [];
let penColor = "black";
let bgColor = "yellow";

createBoard();

function createBoard(){
for(let i = 0; i < 100; i++){
    let square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("squareBorder");
    square.style.backgroundColor = bgColor;
    drawing_pad.append(square);
    squares.push(square);
    square.addEventListener("mouseover", draw);
}
}

function draw(){
    this.style.backgroundColor = penColor;
}

/*for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener("mouseover", d);
}*/

