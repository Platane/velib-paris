export const initProgram = ( gl, fragmentShader, vertexShader ) => {

    // Create the shader program
    let shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)

    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        console.warn('Unable to initialize the shader program.')

    gl.useProgram(shaderProgram)

    return shaderProgram
}

export const initShader = ( gl, sourceCode, type ) => {

    let shaderType

    if( type == 'fragment' )

        shaderType = gl.FRAGMENT_SHADER


    if( type == 'vertex' )

        shaderType = gl.VERTEX_SHADER


    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, sourceCode)

    gl.compileShader(shader)

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return console.warn('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));

    return shader
}
