attribute vec2 aVertexPosition;
attribute float aVertexValue;


void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0, 1.0);
}
