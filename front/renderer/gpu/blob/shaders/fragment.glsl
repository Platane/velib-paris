
precision highp float;

const float maxValue = 500.0;
const int n = 100;

uniform float tauSquare;

varying lowp vec2 pos;
varying lowp float stationIndex;

uniform sampler2D uData;


vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// float gauss(float x) {
//     return exp( - 0.5 * (x*x)/tauSquare );
// }

void main(void) {

    vec4 color1 = texture2D(uData, vec2(0.0/128.0, 0.5));
    vec4 color2 = texture2D(uData, vec2(0.75/128.0, 0.5));

    vec2 position = vec2(
        (color1.r * 4.0 + color1.g * 2.0 + color1.b ) / ( 7.0 ) * 2.0 - 1.0,
        (color2.r * 4.0 + color2.g * 2.0 + color2.b ) / ( 7.0 ) * 2.0 - 1.0
    );

    float d = distance( position, pos );

    float value = color1.a;

    vec3 color = hsv2rgb( vec3( d*0.8, 1.0, 1.0 ) );

    gl_FragColor = vec4( color, 1 );
    // gl_FragColor = vec4( position, 0, 1 );
    // gl_FragColor = color2;

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
