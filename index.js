const EDITION= 11;
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const {Layers, WIDTH, HEIGHT, X, Y}= require('./input/config.js')
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const LayerCount= Layers.length;

var metaData= []; //for each edition
var attributes= []; //for layers of each edition & included in metadata
//var hash= "";

const addMetaData= (_edition) => {
    //let dateTime= new Date();
    let tempMetaData= {
        name: `edition_${_edition}`,
        dateTime: new Date(),
        attibutes: attributes,
    }
    metaData.push(tempMetaData);
    attributes= [];// clean it for next edition
}

const addAttributes= (_layer, layer_count) => {
    let tempAttr= {
        name: _layer.name,
        layer_id: layer_count,
        elements: _layer.elements,
        elements_count: _layer.elements.length,
        position: _layer.position,
        size: _layer.size,
    }
    attributes.push(tempAttr);
}

const saveLayer= async (_canvas, _edition) => {
    fs.writeFileSync(`./output/generated_art/edition_${_edition}.png`, _canvas.toBuffer("image/png")); // .toBuffer() part copied from tutorial
}

const drawLayer= async (_layer, _edition, layer_count) => {
    addAttributes(_layer, layer_count);

    //_layer.elements.length is '10' since 10 images we have | & Math.random returns [0,1)
    const image_id= Math.floor(Math.random() * _layer.elements.length); // image count to be drawn
    const image= await loadImage(`${_layer.path}/${_layer.elements[image_id]}`); //eg: loadImage('..buidlit/images/corner/7.png')
    //var ctx = canvas.getContext('2d')
    ctx.drawImage(image,
                _layer.position.x, _layer.position.y,
                _layer.size.width, _layer.size.height);
    //console.log("omk" + ` edition ${_edition}`);
    saveLayer(canvas, _edition);

    /*
    After drawing layer, then check if last layer reached,
    (& even if reached reached, this line has to be below saveLayer(...) bcz we gotta 
    draw on the layer obviously, save it & then clear for next edition NOT before that.)
    */
    if(layer_count == LayerCount){
        ctx.clearRect(X, Y, WIDTH, HEIGHT); // clearing the full canvas.
    }
}

for(let edition=1; edition<=EDITION; edition++){
    var layer_count=0; //counting layers as they are drawn for each edition.
    Layers.forEach(layer => {
        layer_count++;
        drawLayer(layer, edition, layer_count);
    });
    //after all layers are looped, so adding metadata for each edition done
    addMetaData(edition);
}

fs.readFile("./output/metaData.json", (err, data) => {
    if (err) throw err;
    fs.writeFileSync("./output/metaData.json", JSON.stringify(metaData)); //no callback given so writeFileSync(...)
});

/*
 * This is what I tried to solve the issue of creating a new canvas each time an edition was drawn
   bcz without that it continues to draw on itself or only one line is ever drawn. 
   DIDN'T WORK, BUT THE ABOVE LOGIC DID :)

var temp_edition= 0;
const drawLayer= async (_layer, _edition) => {
    if(_edition==1 && temp_edition==0){ //would run only once in the beginning
        const canvas = createCanvas(WIDTH, HEIGHT);
        var ctx = canvas.getContext('2d');
        temp_edition= 1;
    }
    //The below logic aims that when new edition comes, then only to create another canvas
    if(_edition > temp_edition){
        const canvas = createCanvas(WIDTH, HEIGHT);
        var ctx = canvas.getContext('2d');
        temp_edition= _edition;
    }
    //_layer.elements.length is '10' since 10 images we have | & Math.random returns [0,1)
    const image_id= Math.floor(Math.random() * _layer.elements.length); // image count to be drawn
    const image= await loadImage(`${_layer.path}/${_layer.elements[image_id]}`); //eg: loadImage('..buidlit/images/corner/7.png')
    //var ctx = canvas.getContext('2d')
    ctx.drawImage(image, X, Y, WIDTH, HEIGHT);
    //console.log("omk" + ` edition ${_edition}`);
    saveLayer(canvas, _edition);
}

for(let edition=1; edition<=EDITION; edition++){
    Layers.forEach(layer => {
        drawLayer(layer, edition);
    });
}

*/
