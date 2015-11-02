
precision highp float;

const float pointsByTiles = 64.0;

uniform float tau;
uniform float n;

varying lowp vec2 pos;
varying lowp float stationIndex;

uniform sampler2D uData;


vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float gauss(float x) {
    return exp( -0.5 * (x*x) / (tau*tau) );
}
float extractRGBfloat( vec3 v ) {
    return (
          v.r * 256.0*256.0*256.0
        + v.g * 256.0*256.0
        + v.b * 256.0
    ) / ( 256.0*256.0*256.0 ) * 2.0 - 1.0;
}

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

    // gl_FragColor = vec4( stationIndex ,stationIndex ,stationIndex  , 1);
    // gl_FragColor = vec4( texture2D(uData, vec2( ( 0.0     )/256.0, stationIndex/n )  ).xyz, 1.0 );
    //
    // return;

    float sum = 0.0;

    if ( mod( stationIndex, 2.0 ) == 1.0 ) {
        sum = 0.5;
    }

    for(float i = 0.0; i < pointsByTiles; i++) {

        float k = floor( i ) * 2.0;

        vec4 color1 = texture2D(uData, vec2( ( k     )/( pointsByTiles * 2.0), stationIndex/n ));
        vec4 color2 = texture2D(uData, vec2( ( k+1.0 )/( pointsByTiles * 2.0), stationIndex/n ));

        // in [ -1, 1 ] x [ -1, 1 ]
        vec2 position = vec2(
            extractRGBfloat( color1.rgb ),
            extractRGBfloat( color2.rgb )
        );

        float v = color1.a * 256.0;

        float u = gauss( distance( position, pos ) );

        // sum += v * u;

        if ( u*v > 0.1 ) {
            // sum += u*v;
            sum += 100.0;
        }
    }

    sum = min( sum / 10.0, 1.0 );

    vec3 color = hsv2rgb( vec3( sum*0.8, 1.0, 1.0 ) );

    gl_FragColor = vec4( color , 1);
    // gl_FragColor = vec4( sum,sum,sum , 1);

}
