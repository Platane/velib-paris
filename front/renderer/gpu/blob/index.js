import {get} from '../../../service/request'
import {initShader, initProgram} from '../utils/utils'
import {gauss as gauss_, gaussInv as gaussInv_} from '../../../math/primitive/gauss'
import {boundingBox}  from '../../../math/primitive/bounding'
import {gridSplit}  from './gridSplit'
import {packGausses}  from './texturePacking'


const tau = 0.08
const maxZone = u => u == 0 ? 0 : gaussInv_( tau, 0.01/u )


export class BlobRenderer {

    constructor( canvas, size ){

        // init gl
        canvas.width = canvas.height = size
        let gl = this._gl = canvas.getContext('experimental-webgl')
        gl.clearColor(0.0, 0.0, 0.0, 0.5)
        gl.viewport(0, 0, size, size)

        this._n = 10

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
                gl.uniform1f( gl.getUniformLocation(this._shaderProgram, 'tau'), tau )


                // init attributes
                this._attribute={}

                this._attribute.position = gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
                gl.enableVertexAttribArray(this._attribute.position)

                this._attribute.index = gl.getAttribLocation(this._shaderProgram, 'aStationIndex')
                gl.enableVertexAttribArray(this._attribute.index)

                // build maillage
                const positionArray = []
                const indexArray = []
                const n = this._n

                const p = (x,y) => [ x/n * 2 -1, y/n * 2 -1 ]

                for ( let x=0; x<n; x++ )
                for ( let y=0; y<n; y++ )
                {
                    positionArray.push(

                        ...p( x   , y   ),
                        ...p( x+1 , y   ),
                        ...p( x+1 , y+1 ),

                        ...p( x+1 , y+1 ),
                        ...p( x   , y+1 ),
                        ...p( x   , y   ),
                    )

                    // index face (x, y)  should be y * n + x
                    // const k = y*n + x
                    const k = 14
                    indexArray.push(
                        k,k,k,
                        k,k,k,
                    )
                }

                const positionBuffer = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW)
                gl.vertexAttribPointer(this._attribute.position, 2, gl.FLOAT, false, 0, 0)

                const indexBuffer = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW)
                gl.vertexAttribPointer(this._attribute.index, 1, gl.UNSIGNED_SHORT, false, 0, 0)
            })
    }

    setNodes( points ){

        this._points = points

        return this
    }

    setTau( tau ){

        this._tau = tau

        return this
    }

    setValues( values ){

        const points = this._points

        const grid = gridSplit( this._n, points, 0.051 )
            .map( x =>
                x.map( i => ({ ...points[i], v:values[i] }) )
            )

        // const grid = [[
        //     {x:-0.3, y:0.4, v:105},
        //     {x:0.3, y:0.2, v:255},
        //     {x:-0.93, y:0.243, v:25},
        //     {x:-0.93, y:0.243, v:55},
        //     {x:-0.13, y:-0.2133, v:155},
        //     {x:-0.1333, y:0.542133, v:25},
        //     {x:-0.4333, y:0.142133, v:200},
        // ]]

        const image = packGausses( grid )

        // bind buffer
        const gl = this._gl

        // bind texture
        const dataTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, dataTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
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

        gl.drawArrays(gl.TRIANGLES, 0, this._n * this._n * 6);


        return this
    }
}
