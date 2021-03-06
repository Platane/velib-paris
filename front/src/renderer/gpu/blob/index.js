import {get} from '../../../service/request'
import {initShader, initProgram} from '../utils/utils'
import {gridSplit}  from './gridSplit'
import {packGausses}  from './texturePacking'


const tau = 0.03

// every contribution below this value can be neglected
const minInfluence = 0.1

const maxValue = 60

// considering the value as maximal, how far does the area affects
const maxInfluenceArea = tau * Math.sqrt( -2 * Math.log( minInfluence / maxValue ) )

const beforeCompil = ( values, source ) =>
    source.replace( /{{(\w+)}}/g , ( _, prop ) => values[ prop ] )

export class BlobRenderer {

    constructor( canvas, size ){

        // init gl
        canvas.width = canvas.height = size
        let gl = this._gl = canvas.getContext('experimental-webgl')
        gl.clearColor(0.0, 0.0, 0.0, 0.5)
        gl.viewport(0, 0, size, size)

        this._n = 20
        this._pointsByTiles = 128

        // canvas use to push texture
        this._canvas = document.createElement('canvas')
        this._canvas.setAttribute('style', `height:128px;width:1024px;image-rendering:pixelated`)
        document.body.appendChild( this._canvas )
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
                .then( beforeCompil.bind(null, {pointsByTiles: this._pointsByTiles+'.0', textureWidth: this._pointsByTiles+'.0' }) )
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
                gl.uniform1f( gl.getUniformLocation(this._shaderProgram, 'n'), 1 << Math.ceil( Math.log( this._n*this._n ) / Math.log( 2 ) ) )


                // init attributes
                this._attribute={}

                this._attribute.position = gl.getAttribLocation(this._shaderProgram, 'aVertexPosition')
                gl.enableVertexAttribArray(this._attribute.position)

                this._attribute.index = gl.getAttribLocation(this._shaderProgram, 'aTileIndex')
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
                    const k = y*n + x
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

        this._grid = gridSplit( {max:{x:1,y:1}, min:{x:-1,y:-1}}, this._n, points, maxInfluenceArea )
            .map( x => x
                .map( i => ({ ...points[i], v:0, i }) )
            )

        return this
    }

    setValues( values ){


        // build the grid
        this._grid
            .forEach( x =>
                x.forEach( x => x.v = values[ x.i ] )
            )



        const image = packGausses( this._canvas, this._grid, this._pointsByTiles )

        // bind buffer
        const gl = this._gl

        // bind texture
        const dataTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, dataTexture)


        gl.texImage2D(
            gl.TEXTURE_2D,
            0,                  // level , for mimapping i guess
            gl.RGB,             // internalformat ,
            gl.RGB,             // format
            gl.UNSIGNED_BYTE,   // type
            image
        )

        // declare properties to ensure that upscaling the texture does not apply a linear blur
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

        if ( !gl )
            return this

        gl.uniform1f( gl.getUniformLocation(this._shaderProgram, 'rand'), ( 1 + Math.sin( Date.now() * 0.001 ))/2 )

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.drawArrays(gl.TRIANGLES, 0, this._n * this._n * 6);


        return this
    }
}
