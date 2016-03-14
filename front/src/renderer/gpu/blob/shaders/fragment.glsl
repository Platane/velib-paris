
precision highp float;

const float pointsByTiles = {{pointsByTiles}};
const float textureWidth = {{textureWidth}};

uniform float rand;
uniform float tau;
uniform float n;

varying lowp vec2 pos;
varying lowp float tileIndex;

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
          v.r * 256.0*256.0
        + v.g * 256.0
    ) / ( 256.0*256.0 ) * 2.0 - 1.0;
}

void main(void) {

    float sum = 0.0;
    float shine = 0.0;

    for(float i = 0.0; i < pointsByTiles; i++) {

        float k = i * 2.0;

        vec4 color1 = texture2D(uData, vec2( ( k     )/( textureWidth * 2.0), tileIndex/n ));
        vec4 color2 = texture2D(uData, vec2( ( k+1.0 )/( textureWidth * 2.0), tileIndex/n ));

        // in [ -1, 1 ] x [ -1, 1 ]
        vec2 position = vec2(
            extractRGBfloat( color1.rgb ),
            extractRGBfloat( color2.rgb )
        );

        // point value
        float v = color1.b * 256.0;

        // distance to the point
        float d = distance( position, pos );

        // gauss value
        float u = gauss( d );

        // random value for the point
        // float tau = fract( i * i * 0.73 + i * 0.57 + 0.46 ) * 6.14;
        // float phy = 0.5 + 0.5 * fract( i * i * 0.13 + i * 0.57 + 0.46 );
        //
        // float a = ( 1.0+sin( tau + phy * rand * 10.0 ) )/2.0;

        // point brightness value
        // float b = max( 0.0, u - 0.98 );

        sum += u*v;
    }

    sum = min( sum / 120.0, 1.0 );

    sum = floor( sum * 10.0 ) / 10.0;

    vec3 color = hsv2rgb( vec3( sum*0.9, 1.0, 1.0 ) );


    // shine = min( shine * 100.0, 1.0 );

    // vec3 c = vec3( shine * 1.0  + ( 1.0 - shine ) * color.r, shine * 1.0  + ( 1.0 - shine ) * color.g, shine * 1.0  + ( 1.0 - shine ) * color.b );

    gl_FragColor = vec4( color, 1 );

}
