attribute vec2 aVertexPosition;
attribute float aTileIndex;

varying lowp vec2 pos;
varying lowp float tileIndex;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0, 1.0);
    pos = aVertexPosition;
    tileIndex = aTileIndex;
}
