import {heatmap} from './renderer/canvas/heatmap'
import {graph} from './renderer/canvas/graph'
import {initScene} from './renderer/three/initScene'
import {flatMapGeometry} from './renderer/three/flatMapGeometry'
import {tesselate} from './math/3Dgeom/tesselate'
import {project} from './math/geoProjection/mercator'

import {get} from './service/request'

import THREE from './renderer/three/three'


const canvas = document.createElement('canvas')
document.body.appendChild( canvas )

const canvas2 = document.createElement('canvas')
document.body.appendChild( canvas2 )


const {scene} = initScene()


get( 'http://localhost:8080/availability' )
// Promise.resolve( [])

    .then( res => {

        let points = res
            .map( x => ({
                ...project( ...x.coordinates ),
                value: 0.1+ 0.9 * x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total
            }) )




        canvas.width = canvas.height = 1200
        canvas2.width = canvas2.height = 1200
        heatmap( points, 100, 1200, canvas )
        graph( points, 1200, canvas2 )

        return points
    })

    .then( points => {



        const material = new THREE.MeshPhongMaterial( {
            color: 0xD009D9,
            shininess : 12,
            specular: 0xFF00FF,
        })

        const {vertices, faces} = tesselate( points )
        scene.add( new THREE.Mesh( flatMapGeometry( vertices, faces ), material ) )
    })

    .catch( err => console.error( err ))












































0
