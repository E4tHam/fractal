
const CanvasWidth   = 512;
const CanvasHeight  = 512;

var Canvas = document.createElement("canvas");
Canvas.setAttribute("width", CanvasWidth);
Canvas.setAttribute("height", CanvasHeight);
Canvas.setAttribute( "id", "Canvas" );
document.getElementsByTagName("body")[0].appendChild(Canvas);
const ctx = Canvas.getContext("2d", { alpha: false });

var PixelBuffer = new Uint8ClampedArray( CanvasWidth * CanvasHeight * 4 );

var parameters = [
    [0x000, 0xfff, 0xfff, 0x000],
    [0xfff, 0xfff, 0xfff, 0xfff],
    [0xfff, 0xfff, 0xfff, 0xfff],
    [0x000, 0xfff, 0xfff, 0x000]
];

for ( let i = 0; i < CanvasWidth * CanvasHeight; i++ ) {
    PixelBuffer[4*i + 0] = 0xff;
    PixelBuffer[4*i + 1] = 0xff;
    PixelBuffer[4*i + 2] = 0xff;
    PixelBuffer[4*i + 3] = 0xff;
}

for ( let r = 0; r < 4; r++ ) {
    for ( let i = 0; i < CanvasWidth; i++ ) {
        for ( let j = 0; j < CanvasHeight; j++ ) {
            let x_index = (i >>> (7-2*r)) & 0b11;
            let y_index = (j >>> (7-2*r)) & 0b11;
            let pixel_index = j*CanvasWidth + i;
            PixelBuffer[4*pixel_index + 0] &= ((parameters[y_index][x_index]>>>8)&0xf)<<4;
            PixelBuffer[4*pixel_index + 1] &= ((parameters[y_index][x_index]>>>4)&0xf)<<4;
            PixelBuffer[4*pixel_index + 2] &= ((parameters[y_index][x_index]>>>0)&0xf)<<4;
        }
    }
}

const screenImage = new ImageData( PixelBuffer, CanvasWidth, CanvasHeight );
ctx.putImageData( screenImage, 0, 0 );
