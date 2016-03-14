
precision highp float;

varying lowp vec3 pond;
varying lowp vec3 value;

vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float f(float v) {
    return v*v;
}
vec3 interpolation(vec3 v){

    v.x = f(v.x);
    v.y = f(v.y);
    v.z = f(v.z);

    float sum = v.x + v.y + v.z;

    return vec3( v.x/sum, v.y/sum, v.z/sum );
}

void main(void) {

    float v = dot( value, interpolation( pond ) );

    vec3 color = hsv2rgb( vec3( v*0.8, 1.0, 1.0 ) );

    gl_FragColor = vec4( color , 1);

}
