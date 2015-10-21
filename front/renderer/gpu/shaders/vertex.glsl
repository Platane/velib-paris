attribute vec2 aVertexPosition;
attribute float aVertexValue;

varying lowp float value;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0, 1.0);
    value = aVertexValue;
}
