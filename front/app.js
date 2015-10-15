// import {heatmap} from './renderer/canvas/heatmap'
// import {graph} from './renderer/canvas/graph'
// import {initScene} from './renderer/three/initScene'
// import {flatMapGeometry} from './renderer/three/flatMapGeometry'
// import {tesselate} from './math/3Dgeom/tesselate'
// import {project} from './math/geoProjection/mercator'
import {boundingBox} from './math/primitive/bounding'

// import {getBackground} from './OSM/api'


import {get} from './service/request'

// import THREE from './renderer/three/three'


// const canvas = document.createElement('canvas')
// document.body.appendChild( canvas )

const canvas2 = document.createElement('canvas')
document.body.appendChild( canvas2 )


// const {scene} = initScene()


get( 'http://localhost:8080/availability' )
// Promise.resolve( [])

    .then( res => {

        const latLngPoints = res.map( p => ({ x: +p.coordinates[1], y: +p.coordinates[0] }) )

        const values = res.map( x => x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total )

        let box = boundingBox( latLngPoints )

        // getBackground( box )


        // canvas.width = canvas.height = 1200
        // heatmap( points, 100, 1200, canvas )
        // canvas2.width = canvas2.height = 800
        // graph( latLngPoints.map( latLng => project( latLng.x, latLng.y ) ), values, 800, canvas2 )

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


import {HeatMapRenderer} from './renderer/gpu/heatmap'
let hmr

;( new Promise( r => setTimeout(r,200) ) )
    .then( () => hmr = new HeatMapRenderer( canvas2, 800 ) )
    .then( () => hmr.initShader() )
    .then( () => {

        hmr
            .setNodes( [
                {x:0.200,y:0.200},
                {x:0.300,y:0.500},
                {x:0.500,y:0.200},
                {x:0.700,y:0.750},
                {x:0,y:0},
                {x:0.200,y:-0.120},
                {x:-0.200,y:-0.120}
            ] )
            .setValues( [0.4, 0, 0.9, 0.3, 1, 0.1, 0.5] )
            .render()
    })







































0
