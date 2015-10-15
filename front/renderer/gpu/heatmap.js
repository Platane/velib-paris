import {get} from '../../service/request'
import {initShader, initProgram} from './utils/utils'
import {delaunay} from '../../math/delaunay'


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

            get('/front/renderer/gpu/shaders/vertex.glsl')
                .then( source => initShader(gl, source, 'vertex') )
                .then( shader => vertexShader = shader )

            ,

            get('/front/renderer/gpu/shaders/fragment.glsl')
                .then( source => initShader(gl, source, 'fragment') )
                .then( shader => fragmentShader = shader )


        ])
            // shaders are inited
            // create the program and use it
            .then( () => {

                // init shader program
                this._shaderProgram = initProgram( gl, vertexShader, fragmentShader )

                // init attributes
                // this ones to pass the vertices positions
                this._verticeAttribute = gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
                gl.enableVertexAttribArray(this._verticeAttribute)

                // this one to pass the values of each vertex
                this._valueAttribute = gl.getAttribLocation(this._shaderProgram, 'aVertexValue')
                gl.enableVertexAttribArray(this._valueAttribute)
            })
    }

    setNodes( vertices, faces=null ){

        faces = faces || delaunay( vertices )

        // array of vertices
        const verticeArray = vertices
            .reduce( (arr,vertex) => (arr.push(vertex.x, vertex.y), arr) ,[] )

        const facesArray = faces
            .reduce( (arr, face) => (arr.push( ...face ), arr) ,[] )

        const gl = this._gl
        this._n = vertices.length

        // push the vertices
        const verticesBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticeArray), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
        gl.vertexAttribPointer(this._verticeAttribute, 2, gl.FLOAT, false, 0, 0);

        // push the faces
        const faceBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(facesArray), gl.STATIC_DRAW)

        console.log( verticesBuffer, faceBuffer )

        return this
    }

    setValues( values ){

        const gl = this._gl

        // pass the vertex values
        const valueBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, valueBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, valueBuffer)
        gl.vertexAttribPointer(this._valueAttribute, 1, gl.FLOAT, false, 0, 0);

        return this
    }

    render( ){

        const gl = this._gl


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.drawElements(gl.TRIANGLES, this._n, gl.UNSIGNED_SHORT, 0);

        return this
    }
}
