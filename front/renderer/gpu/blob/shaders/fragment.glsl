
precision highp float;

const float maxValue = 500.0;
const int n = 100;

uniform float tauSquare;

varying lowp vec2 pos;
varying lowp float stationIndex;

// varying vec3[100] stations;
// varying lowp vec3 pos;

vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// float gauss(float x) {
//     return exp( - 0.5 * (x*x)/tauSquare );
// }

void main(void) {

    gl_FragColor = vec4( 1.0, 0.5, 0, 1);

}
// void main(void) {
//
//     float sum = 0;
//
//     for(uint i = 0; i + 1 != n; i++) {
//
//         float d = distance( vec3( stations[i].x, stations[i].y, 0 ), pos )
//
//         sum = sum + stations[i].z;
//     }
//
//     float v = sum / maxValue;
//
//     vec3 color = hsv2rgb( vec3( v*0.8, 1.0, 1.0 ) );
//
//     gl_FragColor = vec4( color , 1);
//
// }
