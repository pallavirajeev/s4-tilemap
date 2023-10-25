import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//note: trying to implement this class?? not sure how to go about it
//but there are things not working

//create a flyweight class
class TileFlyweight {
  private image: HTMLImageElement;

  constructor(imageSource: string) {
    this.image = new Image();
    this.image.src = imageSource;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    ctx.drawImage(this.image, x, y, width, height);
  }
}

//creating the tilemap nested array
// let tilemap: HTMLImageElement[][] = new Array(numTiles);

let tilemap: TileFlyweight[][] = new Array(numTiles);

for (let i = 0; i < numTiles; i++) {
  let row = new Array(numTiles);
  for (let j = 0; j < numTiles; j++) {
    // row[j] = new Image();
    // row[j].src = "/tile1.png";
    row[j] = new TileFlyweight("/tile1.png");
  }
  tilemap[i] = row;
}

//track the selected tile
let currentTile = "/tile1.png";

//draw the initial canvases
redrawTilemap();
drawSelectCanvas();

//Function that draws a texture to a specific canvas ctx
// function drawTexture(row: number, col: number, ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, cellSize: number) {
//     image.onload = () => {
//         ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
//     };
//     ctx.drawImage(image, row * cellSize, col * cellSize, width, height)
// }

//change this function:
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  tile: TileFlyweight,
  cellSize: number
) {
  //image.onload = () => { //figure this out, this is why the image doesn't load without clicking
  tile.draw(ctx, row * cellSize, col * cellSize, cellSize, cellSize);
  // }
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      // drawTexture(i, j, gridCtx, tilemap[i][j], gridCanvas.width / numTiles, gridCanvas.height / numTiles, tileSize);
      drawTexture(i, j, gridCtx, tilemap[i][j], tileSize);
    }
  }
}

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const selectableImage = new Image();
    selectableImage.src = imageUrls[i];
    // drawTexture(0, i, selectCtx, selectableImage, selectCanvas.width, selectHeight, 64);
    drawTexture(
      0,
      i,
      selectCtx,
      new TileFlyweight(imageUrls[i]),
      selectCanvas.width / numSelectables
    );
  }
}

gridCanvas.addEventListener("click", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  // tilemap[coordX][coordY].src = currentTile;
  tilemap[coordX][coordY] = new TileFlyweight(currentTile);
  redrawTilemap();
});

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = imageUrls[coordY];
});
