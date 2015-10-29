
precision highp float;

const float maxValue = 500.0;
const float n = 128.0;

uniform float gauss_a;
uniform float gauss_b;
uniform float tau;

varying lowp vec2 pos;
varying lowp float stationIndex;

uniform sampler2D uData;


vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float gauss(float x) {
    return exp( -0.5 * (x*x) / (tau * tau) );
}

// void main(void) {
//
//     vec4 color1 = texture2D(uData, vec2(0.0/128.0, 0.5));
//     vec4 color2 = texture2D(uData, vec2(0.75/128.0, 0.5));
//
//     vec2 position = vec2(
//         (color1.r * 4.0 + color1.g * 2.0 + color1.b ) / ( 7.0 ) * 2.0 - 1.0,
//         (color2.r * 4.0 + color2.g * 2.0 + color2.b ) / ( 7.0 ) * 2.0 - 1.0
//     );
//
//     float k = floor( (pos.x + 1)/ 3 );
//
//     float d = distance( position, pos );
//
//     float value = color1.a;
//
//     vec3 color = hsv2rgb( vec3( d*0.8, 1.0, 1.0 ) );
//
//     gl_FragColor = vec4( color, 1 );
//     // gl_FragColor = vec4( position, 0, 1 );
//     // gl_FragColor = color2;
//
// }
void main(void) {


    // if ( pos.y > 0.96 ){
    //
    //     float k = floor( (pos.x + 1.0) * 128.0 );
    //
    //     gl_FragColor = texture2D(uData, vec2( ( k )/ ( 128.0 * 2.0), 0.0));
    //
    //     return;
    // }
    //
    // if ( pos.y > 0.90 ){
    //
    //     float k = floor( (pos.x + 1.0) * 128.0 );
    //
    //     vec4 color = texture2D(uData, vec2( ( k )/ ( 128.0 * 2.0), 0.0));
    //
    //     float u = color.a * 10.0;
    //
    //     gl_FragColor = vec4( u,u,u , 1.0 );
    //
    //     return;
    // }


    float sum = 0.0;

    for(float i = 0.0; i < n; i++) {

        float k = floor( i / n * 128.0 ) * 2.0;

        vec4 color1 = texture2D(uData, vec2( ( k     )/256.0, 0.0 ));
        vec4 color2 = texture2D(uData, vec2( ( k+1.0 )/256.0, 0.0 ));

        // in [ -1, 1 ] x [ -1, 1 ]
        vec2 position = vec2(
            (color1.r * 4.0 + color1.g * 2.0 + color1.b ) / ( 7.0 ) * 2.0 - 1.0,
            (color2.r * 4.0 + color2.g * 2.0 + color2.b ) / ( 7.0 ) * 2.0 - 1.0
        );

        float v = color1.a * 256.0;

        float u = gauss( distance( position, pos ) );

        // sum += v * u;

        if ( u > 0.8 ) {
            sum += v * ( u-0.6 ) / 0.4 ;
        }
    }

    sum = min( sum / 50.0, 1.0 );

    vec3 color = hsv2rgb( vec3( sum*0.8, 1.0, 1.0 ) );

    gl_FragColor = vec4( color , 1);
    gl_FragColor = vec4( sum,sum,sum , 1);

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
