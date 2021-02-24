/* Feature Notes 
* mouseover event - add hover class
* click canvas to start, click again to stop, hover to draw
* Pen colors -  transparent?,  add slot
* * 
* Other -  color grabber- already included, *fill* , zoom ?
*****
DONE:
Pen - black, erase, colorpicker, rainbow, warm/cold, random, sketch (increment darkness),
    darken, lighten,
BG - white, colorpicker,
Grid - on/off, clear
* Grid size (dynamic- square size changes)- 10x10,20,25,50,100x100(10,000), slider? user prompt? 
    click btn - different increments
    on grid size change- reset board/
*/

const drawing_pad = document.querySelector("#drawing_pad");
let squares = [];
let squareWasDrawn = false;
let penColor = "rgb(0, 0, 0)";
let bgColor = "rgb(255, 255, 255)";
let oldBgColor = "";
const rainbowColors = ["rgb(255, 0, 0)", "rgb(255, 255, 0)", "rgb(0, 0, 255)"];
let rIndex = 0;
const warmColors = ["rgb(255, 0, 0)", "rgb(255, 115, 0)", "rgb(255, 255, 0)"];
let wIndex = 0;
const coldColors = ["rgb(0, 0, 255)", "rgb(150, 150, 255)", "rgb(0, 255, 0)"];
let cIndex = 0;
let rRandom = 0;
let gRandom = 0;
let bRandom = 0;
let pensOn = {
    rainbowOn: false,
    warmOn: false,
    coldOn: false,
    randomOn: false,
    sketchOn: false,
    darkenOn: false,
    lightenOn: false,
};

setUpPens();
setUpFeatures();

createBoard();

function setUpPens() {

    let penBlack = document.querySelector("#pen_black");
    penBlack.addEventListener("click", setPen);

    let penRed = document.querySelector("#pen_red");
    penRed.addEventListener("click", setPen);

    let penErase = document.querySelector("#pen_erase");
    penErase.addEventListener("click", setPen);

    //let penPicker = document.querySelector("#pen_picker");
    //penPicker.addEventListener("click", setPen);

    let penPick = document.querySelector("#pen_pick");
    penPick.addEventListener("change", function () {
        turnPensOff();
        penColor = this.value;
        penColor = changeHexToRgb(penColor);
    });

    let penRainbow = document.querySelector("#pen_rainbow");
    penRainbow.addEventListener("click", function () {
        turnPensOff();
        pensOn.rainbowOn = true;
    });

    let penWarm = document.querySelector("#pen_warm");
    penWarm.addEventListener("click", function () {
        turnPensOff();
        pensOn.warmOn = true;
    });

    let penCold = document.querySelector("#pen_cold");
    penCold.addEventListener("click", function () {
        turnPensOff();
        pensOn.coldOn = true;
    });

    let penRandom = document.querySelector("#pen_random");
    penRandom.addEventListener("click", function () {
        turnPensOff();
        pensOn.randomOn = true;
    });

    let penSketch = document.querySelector("#pen_sketch");
    penSketch.addEventListener("click", function () {
        turnPensOff();
        pensOn.sketchOn = true;
    });

    let penDarken = document.querySelector("#pen_darken");
    penDarken.addEventListener("click", function () {
        turnPensOff();
        pensOn.darkenOn = true;
    });

    let penLighten = document.querySelector("#pen_lighten");
    penLighten.addEventListener("click", function () {
        turnPensOff();
        pensOn.lightenOn = true;
    });

}

function setUpFeatures() {
    let bgWhite = document.querySelector("#bg_white");
    bgWhite.addEventListener("click", setBg);

    let bgYellow = document.querySelector("#bg_yellow");
    bgYellow.addEventListener("click", setBg);

    // let bgPicker = document.querySelector("#bg_picker");
    //bgPicker.addEventListener("click", setBg);

    let bgPick = document.querySelector("#bg_pick");
    bgPick.addEventListener("change", function () {
        // change from hex to rgb
        oldBgColor = bgColor;
        bgColor = this.value;
        bgColor = changeHexToRgb(bgColor);
        updateBg();
    });

    let clearPadId = document.querySelector("#clear_pad");
    clearPadId.addEventListener("click", clearPad);

    
    let grid10x10 = document.querySelector("#g10");
    grid10x10.addEventListener("click", function(){
        setUpGrid(10);
    });

    let grid20x20 = document.querySelector("#g20");
    grid20x20.addEventListener("click", function(){
        setUpGrid(20);
    });

    let grid25x25 = document.querySelector("#g25");
    grid25x25.addEventListener("click", function(){
        setUpGrid(25);
    });

    let grid50x50 = document.querySelector("#g50");
    grid50x50.addEventListener("click", function(){
        setUpGrid(50);
    });

    let grid100x100 = document.querySelector("#g100");
    grid100x100.addEventListener("click", function(){
        setUpGrid(100);
    });

    let zoomInBtn = document.querySelector("#zoom_in");
    zoomInBtn.addEventListener("click", zoomIn);
}

let gridOn = document.querySelector("#grid_on");
    gridOn.addEventListener("click", toggleGrid);

function createBoard() {
    for (let i = 0; i < 625; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.style.width = "20px";
        square.style.height = "20px";
        square.classList.add("squareBorder");
        square.style.backgroundColor = bgColor;
        drawing_pad.append(square);
        squares.push(square);
        square.addEventListener("mouseover", draw);
    }
}

function zoomIn(){
     let length = squares.length;
     let size = squares[0].style.width;
     size = size.slice(0, -2);
    size = Number(size);
    size += 10;
    size += "px";
    for(let i = 0; i < length; i++){
        squares[i].style.width = size;
        squares[i].style.height = size;
    } 
}

// 5, 20, 25, 50, 100
function setUpGrid(gridSize){
    // remove old grid
    for(let i = 0; i < squares.length; i++){
        squares[i].removeEventListener("mouseover", draw);
        squares[i].classList.remove("square");
        squares[i].classList.remove("squareBorder");
        squares[i].remove();
    }
    squares = [];

    let grid = gridSize * gridSize;
    let squareWidth = drawing_pad.clientWidth / gridSize + "px";
    let squareHeight = drawing_pad.clientHeight / gridSize + "px";
    for(let i = 0; i < grid; i++){
        let square = document.createElement("div");
        square.classList.add("square");
        // change height and width
        square.style.width = squareWidth;
        square.style.height = squareHeight;  
        // if grid on
        if(gridOn.checked){
        square.classList.add("squareBorder");
        }
        square.style.backgroundColor = bgColor;
        drawing_pad.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
        drawing_pad.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";
        drawing_pad.append(square);
        squares.push(square);
        square.addEventListener("mouseover", draw);
    }
}

function draw() {
    if (pensOn.rainbowOn) {
        drawRainbow();
    } else if (pensOn.warmOn) {
        drawWarm();
    } else if (pensOn.coldOn) {
        drawCold();
    } else if (pensOn.randomOn) {
        drawRandom();
    } else if (pensOn.sketchOn) {
        let tempBg = this.style.backgroundColor;
        drawSketch(tempBg);
    } else if (pensOn.darkenOn) {
        let tempBg = this.style.backgroundColor;
        drawDarken(tempBg);
    } else if (pensOn.lightenOn) {
        let tempBg = this.style.backgroundColor;
        drawLighten(tempBg);
    }
    this.style.backgroundColor = penColor;
}

function drawRainbow() {
    penColor = rainbowColors[rIndex];
    rIndex++;
    if (rIndex > rainbowColors.length - 1) {
        rIndex = 0;
    }
}

function drawWarm() {
    penColor = warmColors[wIndex];
    wIndex++;
    if (wIndex > warmColors.length - 1) {
        wIndex = 0;
    }
}

function drawCold() {
    penColor = coldColors[cIndex];
    cIndex++;
    if (cIndex > coldColors.length - 1) {
        cIndex = 0;
    }
}

function drawRandom() {
    rRandom = Math.floor((Math.random() * 255));
    gRandom = Math.floor((Math.random() * 255));
    bRandom = Math.floor((Math.random() * 255));
    penColor = "rgb(" + rRandom + ", " + gRandom + ", " + bRandom + ")";
}

function drawSketch(tempBg) {
    let rgb = tempBg.substring(4, tempBg.length - 1).split(', ');
    if (rgb[0] !== rgb[1] || rgb[1] !== rgb[2] || rgb[2] !== rgb[0]) {
        penColor = "rgb(245, 245, 245)";
    } else {
        let sketchValue = rgb[0];
        if (sketchValue > 10) {
            sketchValue -= 10;
        }
        penColor = "rgb(" + sketchValue + ", " + sketchValue + ", " + sketchValue + ")";
    }
}

function drawDarken(tempBg) {
    let rgb = tempBg.substring(4, tempBg.length - 1).split(', ');
    for (let i = 0; i < rgb.length; i++) {
        if (rgb[i] > 10) {
            rgb[i] -= 10;
        }
    }
    penColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

function drawLighten(tempBg) {
    let rgb = tempBg.substring(4, tempBg.length - 1).split(', ');
    for (let i = 0; i < rgb.length; i++) {
        if (rgb[i] < 245) {
            let color = Number(rgb[i]);
            color += 10;
            rgb[i] = color;
        }
    }
    penColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

function setPen() {
    turnPensOff();
    if (this.value === "erase") {
        penColor = bgColor;
         } else {
        penColor = this.value;
    }
}

function turnPensOff() {
    for (let pen in pensOn) {
        pensOn[pen] = false;
    }
}

function setBg() {
    oldBgColor = bgColor;
    bgColor = this.value;
    updateBg();
}

function updateBg() {
    for (let i = 0; i < squares.length; i++) {
              if (squares[i].style.backgroundColor === oldBgColor) {
            squares[i].style.backgroundColor = bgColor;
        }
    }
}

function clearPad() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = "rgb(255, 255, 255)";
    }
}

function toggleGrid() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.toggle('squareBorder');
    }
}

let hexCodes = {'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15 };
function changeHexToRgb(color) {
    // slice off #
    color = color.slice(1);

    // split into 2 digits each
    let colors = [];
    colors[0] = color[0] + color[1];
    colors[1] = color[2] + color[3];
    colors[2] = color[4] + color[5];

    // convert from 16 to 255 - num * 16 + num2
    for (let i = 0; i < colors.length; i++) {
        let hex = colors[i];
        let num1 = hex[0];
        let num2 = hex[1];
        let num3 = 0;

        // convert
        if (!isNum(num1)) {
            num1 = returnHexNum(num1)
        }

        if (isNum(num2)) {
            num2 = Number(num2);
        } else {
            // convert
            num2 = returnHexNum(num2);
        }

        //if num1 is digit, * 16
        num1 *= 16;
        //if num2 is digit, add to num1
        num3 = num1 + num2;
        colors[i] = num3;

    }

    // join back together with rgb( , , )
    let newColor = "rgb(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ")";
    // return new str
    return newColor;
}

function isNum(num) {
    return !isNaN(parseInt(num));
}

function returnHexNum(num) {
    num = num.toLowerCase();
    let hexNum = 0;
    if (hexCodes.hasOwnProperty(num)) {
        hexNum = hexCodes[num];
    }
    return hexNum;
}
/*for(let i = 0; i < squares.length; i++){
    squares[i].addEventListener("mouseover", d);
}*/

