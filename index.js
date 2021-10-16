const fs = require("fs");
const { createCanvas, loadImage } = require("Canvas");
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
const { layers, width, height } = require("./input/input.js");
// const { EEXIST } = require("constants");
const edition = 3;


const dotenv = require("dotenv");
dotenv.config();

const { NFTStorage, File } = require("nft.storage");

const pinata_apikey = process.env.API_KEY;
const pinata_secretApikey = process.env.API_Secret;
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinata_apikey, pinata_secretApikey);

// pinata.testAuthentication().then((result) => {
//     //handle successful authentication here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });


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
    try {
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
    decodedHash.push({ [_layer.id]: _element.id });
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

// generate IPFS hash through nft.storage
// async function test() {
//     const endpoint = 'https://api.nft.storage' // the default

//     const apikey = process.env.NFTSTORAGE_KEY;

//     const client = new NFTStorage({endpoint, apikey});

//     const metadataFortest = await client.store({
//         name: 'Pinpie',
//         description: 'Pin is not delicious beef!',
//         image: new File([await fs.promises.readFile('1.png').catch(error => console.log(error))], '1.png', { type: 'image/png' })
//     });

//     console.log(await fs.promises.readFile('./output/1.png'));
//     console.log('IPFS URL for the metadata:', metadataFortest.url);
//     console.log('metadata.json contents:\n', metadataFortest.data);
// }


// generate IPFS hash through pinata
// simple test: success
const jsonContent = JSON.parse(fs.readFileSync('./output/metadata/3.json'));
const optionas = {
    pinataMetadata: {
        name: 'testFileFromSteve1',
        // keyvalues: { customKey: 'customValue', customKey2: 'customValue2' }
    },
    // pinataOptions: { cidVersion: 0 }
};
pinata.pinJSONToIPFS(jsonContent, optionas).then((result) => {    //handle results here    
    console.log(result);
}).catch((err) => {    //handle error here    
    console.log(err);
});

// simple test for img:
const readableStreamForFile = fs.createReadStream('./output/1.png'); 
const options = { 
    pinataMetadata: { 
        name: 'testforImageFromSteve', 
        keyvalues: { customKey: 'customValue', customKey2: 'customValue2' } 
    }, 
    pinataOptions: { cidVersion: 0 } 
}; 

pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {    
    //handle results here    
    console.log(result);}).catch((err) => {    
        //handle error here    
        console.log(err);
    });


for(let i = 1; i <= edition; i++) {
    layers.forEach((layer) => {
        drawLayer(layer, i);
    })
    addMetadata(i);
    console.log("create edition" + i);
    saveMetadata(i);
}





