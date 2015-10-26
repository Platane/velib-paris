import {get} from '../../../service/request'
import {initShader, initProgram} from '../utils/utils'
import {delaunay} from '../../../math/delaunay'

export class HeatMapRenderer {

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

            get('/front/renderer/gpu/heatmap/shaders/vertex.glsl')
                .then( source => initShader(gl, source, 'vertex') )
                .then( shader => vertexShader = shader )

            ,

            get('/front/renderer/gpu/heatmap/shaders/fragment.glsl')
                .then( source => initShader(gl, source, 'fragment') )
                .then( shader => fragmentShader = shader )


        ])
            // shaders are inited
            // create the program and use it
            .then( () => {

                // init shader program
                this._shaderProgram = initProgram( gl, vertexShader, fragmentShader )

                this._attribute={}

                this._attribute.position = gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
                gl.enableVertexAttribArray(this._attribute.position)

                this._attribute.value = gl.getAttribLocation(this._shaderProgram, 'aFaceValue')
                gl.enableVertexAttribArray(this._attribute.value)

                this._attribute.signature = gl.getAttribLocation(this._shaderProgram, 'aVertexSignature')
                gl.enableVertexAttribArray(this._attribute.signature)
            })
    }

    setNodes( vertices, faces=null ){

        this._face = faces || delaunay( vertices )

        this._faceIndex = this._face
            .reduce( (arr, face) => (arr.push( ...face ), arr) ,[] )


        const positionArray = this._faceIndex
            .reduce( (arr, i) => (arr.push( vertices[ i ].x, vertices[ i ].y ), arr) ,[] )

        const signatureArray = this._face
            .reduce( arr => (arr.push( 1,0,0, 0,1,0, 0,0,1), arr) ,[] )



        const gl = this._gl

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this._attribute.position, 2, gl.FLOAT, false, 0, 0);

        const signatureBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, signatureBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(signatureArray), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this._attribute.signature, 3, gl.UNSIGNED_SHORT, false, 0, 0)

        return this
    }

    setValues( values ){


        const valueArray = this._face
            .reduce( (arr, face) => {
                const val = face.map( i => values[i] )

                arr.push( ...val, ...val, ...val )

                return arr
            }, [])

        const gl = this._gl

        const valueBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, valueBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(valueArray), gl.STATIC_DRAW)
        gl.vertexAttribPointer(this._attribute.value, 3, gl.FLOAT, false, 0, 0)

        return this
    }

    render( ){

        const gl = this._gl


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.drawArrays(gl.TRIANGLES, 0, this._faceIndex.length);

        return this
    }
}
