
const CanvasWidth   = Math.pow(2,11);
const CanvasHeight  = Math.pow(2,11);

var Canvas = document.createElement("canvas");
Canvas.setAttribute("width", CanvasWidth);
Canvas.setAttribute("height", CanvasHeight);
Canvas.setAttribute( "id", "Canvas" );
Canvas.setAttribute("style","height:100vmin;width:100vmin;")
document.getElementsByTagName("body")[0].appendChild(Canvas);
const ctx = Canvas.getContext("2d", { alpha: false });

var PixelBuffer = new Uint8ClampedArray( CanvasWidth * CanvasHeight * 4 );

var parameters = [
    [0x000, 0xfff, 0xfff, 0x000],
    [0xfff, 0xfff, 0xfff, 0xfff],
    [0xfff, 0xfff, 0xfff, 0xfff],
    [0x000, 0xfff, 0xfff, 0x000]
];
var filter =
    1   ? "AND" :
    0   ? "OR"  :
    0   ? "AVG" :
    0   ? "XOR" :
    "error";
var R = 10;


let max_recursion = Math.log2( Math.min(CanvasHeight, CanvasWidth) )/2;
R = Math.min (
    R,
    max_recursion
);

for ( let i = 0; i < CanvasWidth * CanvasHeight; i++ ) {
    PixelBuffer[4*i + 0] = PixelBuffer[4*i + 1] = PixelBuffer[4*i + 2] =
        (filter=="AND") ? 0xff :
        (filter=="OR")  ? 0x00 :
        (filter=="AVG") ? 0xff :
        (filter=="XOR") ? 0x00 :
        0x00;
    PixelBuffer[4*i + 3] = 0xff;
}

for ( let r = 1; r <= R; r++ ) {
    for ( let i = 0; i < CanvasWidth; i++ ) {
        for ( let j = 0; j < CanvasHeight; j++ ) {
            let x_index = (i >>> (Math.log2(CanvasWidth)-2*r)) & 0b11;
            let y_index = (j >>> (Math.log2(CanvasHeight)-2*r)) & 0b11;
            let pixel_index = j*CanvasWidth + i;

            let param_r = ((parameters[y_index][x_index]>>>8)&0xf);
            let param_g = ((parameters[y_index][x_index]>>>4)&0xf);
            let param_b = ((parameters[y_index][x_index]>>>0)&0xf);
            let curr_r = PixelBuffer[4*pixel_index + 0]>>>4;
            let curr_g = PixelBuffer[4*pixel_index + 1]>>>4;
            let curr_b = PixelBuffer[4*pixel_index + 2]>>>4;

            let new_r = 0;
            let new_g = 0;
            let new_b = 0;

            switch (filter) {
                case "AND":
                    new_r = param_r & curr_r;
                    new_g = param_g & curr_g;
                    new_b = param_b & curr_b;
                    break;
                case "OR":
                    new_r = param_r | curr_r;
                    new_g = param_g | curr_g;
                    new_b = param_b | curr_b;
                    break;
                case "AVG":
                    new_r = (param_r + curr_r)>>>1;
                    new_g = (param_g + curr_g)>>>1;
                    new_b = (param_b + curr_b)>>>1;
                    break;
                case "XOR":
                    new_r = param_r ^ curr_r;
                    new_g = param_g ^ curr_g;
                    new_b = param_b ^ curr_b;
                    break;
            default: break; }

            PixelBuffer[4*pixel_index + 0] = (new_r<<4);
            PixelBuffer[4*pixel_index + 1] = (new_g<<4);
            PixelBuffer[4*pixel_index + 2] = (new_b<<4);
        }
    }
}

const screenImage = new ImageData( PixelBuffer, CanvasWidth, CanvasHeight );
ctx.putImageData( screenImage, 0, 0 );
