/**This would contain the layers of the ART GENERATED to be minted to NFT */
const dir= __dirname;
const fs= require('fs');
const WIDTH= 1000, HEIGHT= 1000; //in px
const X= 0, Y= 0; //drawing position on "canvas"
const getElements= (_name) =>{
    //I'm not doing the rarity etc for simplicity, anyways this art generated is dumb :()
    const _path= `${dir}/images/${_name}`;
    return fs.readdirSync(_path /*,{withFileTypes:true}*/);//withFileTypes:true gives some other format.
    //fs.readdirSync() returns array :)
}

const Layers= [
    {
        id:1,
        name: "corner",
        path: `${dir}/images/corner`,
        elements: getElements("corner"),
        position: {x:X, y:Y},
        size: {width:WIDTH, height:HEIGHT},
    },
    {
        id:2,
        name: "middle",
        path: `${dir}/images/middle`,
        elements: getElements("middle"),
        position: {x:X, y:Y},
        size: {width:WIDTH, height:HEIGHT},
    },
    {
        id:3,
        name: "perpendicular",
        path: `${dir}/images/perpendicular`,
        elements: getElements("perpendicular"),
        position: {x:X, y:Y},
        size: {width:WIDTH, height:HEIGHT},
    },
]

module.exports= {Layers, WIDTH, HEIGHT, X, Y}
//console.log(layers[0].elements);