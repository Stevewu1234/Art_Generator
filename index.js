const fs = require("fs");
const { createCanvas, loadImage } = require("Canvas");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const { layers, width, height } = require("./input/input.js");
// const { EEXIST } = require("constants");
const edition = 3;

// metadata generator
var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];

const saveLayer = (_canvas, _edition) => { 
    fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"));
}

const saveMetadata = (_edition) => {
    // fs.readFile("./output/_metadata.json", (err, data) => {
    //     if(err) throw err;
    try{
        fs.writeFileSync(`./output/metadata/${_edition}.json`, JSON.stringify(metadata));
        metadata = [];
    } catch (e) {
        console.log("Cannot write file", e);
    }
    // });
}

const addMetadata = (_edition) => {
    let dataTime = Date.now();
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        edition: _edition,
        date: dataTime,
        attributes: attributes
    }
    
    metadata.push(tempMetadata);

    // clear all added data(init the metadata array)
    attributes = [];
    hash = [];
    decodedHash = [];
}

const addAttributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rartiy: _element.rartiy
    }
    

    attributes.push(tempAttr);
    hash.push(_layer.id);
    decodedHash.push({[_layer.id]: _element.id});
}

const drawLayer = async (_layer, _edition) => {
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(
        image, 
        _layer.position.x, 
        _layer.position.y, 
        _layer.size.width, 
        _layer.size.height
    );
    saveLayer(canvas, _edition);
};

for(let i = 1; i <= edition; i++) {
    layers.forEach((layer) => {
        drawLayer(layer, i);
    })
    addMetadata(i);
    console.log("create edition" + i);
    saveMetadata(i);
}



