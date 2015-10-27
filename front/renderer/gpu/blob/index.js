import {get} from '../../../service/request'
import {initShader, initProgram} from '../utils/utils'
import {gauss as gauss_, gaussInv as gaussInv_} from '../../../math/primitive/gauss'
import {boundingBox}  from '../../../math/primitive/bounding'
import {gridSplit}  from './gridSplit'
import {packGausses}  from './texturePacking'


const tau = 0.02
const maxZone = u => u == 0 ? 0 : gaussInv_( tau, 0.01/u )


export class BlobRenderer {

    constructor( canvas, size ){

        // init gl
        canvas.width = canvas.height = size
        let gl = this._gl = canvas.getContext('experimental-webgl')
        gl.clearColor(0.0, 0.0, 0.0, 0.5)
        gl.viewport(0, 0, size, size)

    }

    initShader(){

        const gl = this._gl

        let vertexShader
        let fragmentShader

        // load shaders
        return Promise.all([

            get('/front/renderer/gpu/blob/shaders/vertex.glsl')
                .then( source => initShader(gl, source, 'vertex') )
                .then( shader => vertexShader = shader )

            ,

            get('/front/renderer/gpu/blob/shaders/fragment.glsl')
                .then( source => initShader(gl, source, 'fragment') )
                .then( shader => fragmentShader = shader )


        ])
            // shaders are inited
            // create the program and use it
            .then( () => {

                // init shader program
                this._shaderProgram = initProgram( gl, vertexShader, fragmentShader )

                // init uniform
                gl.uniform1f( gl.getUniformLocation(this._shaderProgram, 'tauSquare'), tau * tau )


                // init attributes
                this._attribute={}

                // this._attribute.position = gl.getAttribLocation(this._shaderProgram, 'aTexCoord')
                // gl.enableVertexAttribArray(this._attribute.texCoord)

                this._attribute.position = gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
                gl.enableVertexAttribArray(this._attribute.position)

                this._attribute.index = gl.getAttribLocation(this._shaderProgram, 'aStationIndex')
                gl.enableVertexAttribArray(this._attribute.index)

            })
    }

    setNodes( points ){

        this._points = points

        return this
    }

    setValues( values ){

        const positionArray = [
            -1, 1,
            -1,-1,
             1, 1
        ]

        const indexArray = [
            0,
            0,
            0,
        ]

        const points = this._points

        const grid = gridSplit( 1, points, 0.1 )
            .map( x =>
                x.map( i => ({ ...points[i], v:values[i] }) )
            )

        // const grid = [[{x:-0.3, y:0.4, v:255}]]

        const image = packGausses( grid )

        // bind buffer
        const gl = this._gl

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this._attribute.position, 2, gl.FLOAT, false, 0, 0)

        const indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this._attribute.index, 1, gl.UNSIGNED_SHORT, false, 0, 0)

        // bind texture
        const dataTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, dataTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, dataTexture)
        gl.uniform1i(gl.getUniformLocation(this._shaderProgram, 'uData'), 0)
        return this
    }

    render( ){

        const gl = this._gl


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.drawArrays(gl.TRIANGLES, 0, 3);


        return this
    }
}
