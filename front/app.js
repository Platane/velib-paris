// import {heatmap} from './renderer/canvas/heatmap'
// import {graph} from './renderer/canvas/graph'
// import {initScene} from './renderer/three/initScene'
// import {flatMapGeometry} from './renderer/three/flatMapGeometry'
// import {tesselate} from './math/3Dgeom/tesselate'
// import {project} from './math/geoProjection/mercator'
import {boundingBox} from './math/primitive/bounding'

// import {getBackground} from './OSM/api'


import {get} from './service/request'

import {HeatMapRenderer} from './renderer/gpu/heatmap'
import {BlobRenderer} from './renderer/gpu/blob'


// import THREE from './renderer/three/three'


// const canvas = document.createElement('canvas')
// document.body.appendChild( canvas )

const canvas = document.createElement('canvas')
document.body.appendChild( canvas )
const canvas2 = document.createElement('canvas')
// document.body.appendChild( canvas2 )


// const {scene} = initScene()

const stats = new Stats()
stats.domElement.style.position = 'absolute'
stats.domElement.style.right = '0px'
stats.domElement.style.bottom = '0px'
document.body.appendChild( stats.domElement )


let x=0, y=0
window.addEventListener( 'mousemove', event => {
    x = Math.min( event.pageX / 400 - 1 , 1 )
    y = -Math.min( event.pageY / 400 - 1 , 1 )
})

const br = new BlobRenderer( canvas, 800 )
const hmr = new HeatMapRenderer( canvas2, 800 )

let k = 1
const loop = () => {

    br
        .setNodes( [{x,y}] )
        .setValues( [ 125*(1+Math.sin( (k++) * 0.01 )) ] )

    stats.begin()
    br.render()
    stats.end()

    requestAnimationFrame( loop )
}
loop()



get( 'http://localhost:8080/availability' )
// Promise.resolve( [])

    .then( res => {

        const latLngPoints = res.map( p => ({ x: +p.coordinates[1], y: +p.coordinates[0] }) )

        const percentLoaded = res.map( x => x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total )
        const values = res.map( x => +x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] )

        let box = boundingBox( latLngPoints )

        // getBackground( box )


        // canvas.width = canvas.height = 1200
        // heatmap( points, 100, 1200, canvas )
        // canvas2.width = canvas2.height = 800
        // graph( latLngPoints.map( latLng => project( latLng.x, latLng.y ) ), values, 800, canvas2 )

        const vertices = latLngPoints
            .map( p => ({
                x: ( p.x - box.min.x )/( box.max.x - box.min.x )*2 -1,
                y: ( p.y - box.min.y )/( box.max.y - box.min.y )*2 -1,
            }) )

        hmr.initShader()
            .then( () =>

                hmr
                    .setNodes( vertices )
                    .setValues( percentLoaded )
            )

        br.initShader()
            .then( () =>

                br
                    .setNodes( vertices )
                    .setValues( values )
            )


    })

    // .then( points => {
    //
    //
    //
    //     const material = new THREE.MeshPhongMaterial( {
    //         color: 0xD009D9,
    //         shininess : 12,
    //         specular: 0xFF00FF,
    //     })
    //
    //     const {vertices, faces} = tesselate( points )
    //     scene.add( new THREE.Mesh( flatMapGeometry( vertices, faces ), material ) )
    // })

    .catch( err => console.error( err ))


// let hmr
//
// ;( new Promise( r => setTimeout(r,200) ) )
//     .then( () => hmr = new HeatMapRenderer( canvas2, 800 ) )
//     .then( () => hmr.initShader() )
//     .then( () => {
//
//         hmr
//             .setNodes( [
//                 {x: -0.800,y:-0.800},
//                 {x:  0.100,y:0.830},
//                 {x:  0.800,y:-0.700},
//
//             ] )
//             .setValues( [
//                 0.4,
//                 0,
//                 0.9,
//
//             ] )
//             .render()
//     })







































0
