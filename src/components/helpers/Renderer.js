import TraitMap from "./TraitMap.json"

const imageURL = "https://ipfs.io/ipfs/QmSRtP9kFubbY9LUqzWsXLk4TQDWUsbcphZdUeuBKgawcJ/";
//const imageURL = "../renderComponents/skeletoons/";

export const drawSingleCanvas = (URL, canvasID) => {

    let otherValue = URL

    var myCanvas = document.getElementById(canvasID);
    var ctx = myCanvas.getContext('2d');
    var img = new Image;

    img.src = otherValue;
    img.onload = function(){
      ctx.drawImage(img, 0,0); 
    };
}

export const drawSkeletoonFull = (genes, strength, canvasID, indexer, downscaleTimes, finalScale,) => {
    var myCanvas = document.getElementById(canvasID);
    var ctx = myCanvas.getContext('2d');
    var img = new Image;

    let i = indexer
    let j
    let n
    let singleGeneD
    let singleStrD
    let flaggedWhole = false;
    let singleGeneWhole;
    let breakpoints;

    
        
        singleGeneD = genes.substring(( indexer * 2 ) * 3 ,(( indexer * 2 ) + 1 ) * 3)    
        singleStrD  = strength.substring(( indexer * 2 ) * 3 ,(( indexer * 2 ) + 1 ) * 3)
        singleGeneWhole = genes.substring(( indexer * 2 ) * 3 ,(( indexer * 2 ) + 2 ) * 3)

        //ADD support for 000 traits

        if (TraitMap.hasOwnProperty(singleGeneWhole)) {
        breakpoints = Object.keys(TraitMap[singleGeneWhole]).length
        for (j = 1; j <= breakpoints; j++){   
            
            if (singleStrD >=  parseInt(TraitMap[singleGeneWhole][j.toString()][1])) {
                flaggedWhole = true;
                img.src = imageURL + TraitMap[singleGeneWhole][j.toString()][0] + ".png"
                img.setAttribute('crossOrigin', '');
                img.onload = function(){
                    ctx.drawImage(img, 0,0);               
                    i++
                    if (i < 9) {                
                    drawSkeletoonFull(genes, strength, canvasID, i, downscaleTimes, finalScale) 
                    } else if (i=9){
                        downscaleRecursion (canvasID, downscaleTimes, finalScale)
                    }
                };
                break;
            }
        }
        } if (flaggedWhole == false) {
        
        if (singleGeneD !== "000") {
        breakpoints = Object.keys(TraitMap[singleGeneD]).length

        for (j = 1; j <= breakpoints; j++){   
            
            if (singleStrD >=  parseInt(TraitMap[singleGeneD][j.toString()][1])) {
                img.src = imageURL + TraitMap[singleGeneD][j.toString()][0] + ".png"
                img.setAttribute('crossOrigin', '');
                img.onload = function(){
                    ctx.drawImage(img, 0,0);               
                    i++
                    if (i < 9) {                
                    drawSkeletoonFull(genes, strength, canvasID, i, downscaleTimes, finalScale) 
                    } else if (i=9){
                        downscaleRecursion (canvasID, downscaleTimes, finalScale)
                    }
                };
                break;
            }
        }} else {
            i++
                    if (i < 9) {                
                    drawSkeletoonFull(genes, strength, canvasID, i, downscaleTimes, finalScale) 
                    } else if (i=9){
                        downscaleRecursion (canvasID, downscaleTimes, finalScale)
                    }
        }

    }


}

function downscaleRecursion(canvasID, downscaleTimes, finalScale) {
    var myCanvas = document.getElementById(canvasID);
    let counter = downscaleTimes - 1
    if (0 < downscaleTimes) {

        resample_single(myCanvas, (myCanvas.width)/2, (myCanvas.height)/2, true)
        downscaleRecursion(canvasID, counter, finalScale)
    }
    if (0 == downscaleTimes) {

        resample_single(myCanvas, finalScale, finalScale, true)   
     }
}



function resample_single(canvas, width, height, resize_canvas) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //clear and resize canvas
    if (resize_canvas === true) {
        canvas.width = width;
        canvas.height = height;
    } else {
        ctx.clearRect(0, 0, width_source, height_source);
    }

    //draw
    ctx.putImageData(img2, 0, 0);
}