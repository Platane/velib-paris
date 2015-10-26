attribute vec2 aVertexPosition;
attribute float aStationIndex;

varying lowp vec2 pos;
varying lowp float stationIndex;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0, 1.0);
    pos = aVertexPosition;
    stationIndex = aStationIndex;
}
