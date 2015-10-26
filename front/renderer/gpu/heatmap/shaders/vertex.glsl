attribute vec2 aVertexPosition;
attribute vec3 aFaceValue;
attribute vec3 aVertexSignature;

varying lowp vec3 pond;
varying lowp vec3 value;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0, 1.0);
    pond = aVertexSignature;
    value = aFaceValue;
}
