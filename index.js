const fs = require("fs");
const { createCanvas, loadImage } = require("Canvas");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");

const saveLayer = (_canvas) => {
    
    fs.writeFileSync("./newImage.png", _canvas.toBuffer("image/png"));
    console.log("image created");
}

const drawLayer = async () => {
    const image = await loadImage("./input/body.png");
    ctx.drawImage(image, 0,0, 1000, 1000);
    console.log("Done");
    saveLayer(canvas);
};

drawLayer();