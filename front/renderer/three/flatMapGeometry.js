import THREE, {Vector3, Face3} from './three'
import {vec3} from 'gl-matrix'


export const flatMapGeometry = ( vertices, faces ) => {

    let geometry = new THREE.Geometry()

	geometry.vertices = vertices
        .map( p => new Vector3( p[0], p[2], -p[1] ) )

	geometry.faces = faces
        .map( tri => new Face3( ...tri ) )

    geometry.verticesNeedUpdate = true
	geometry.elementsNeedUpdate = true
	geometry.normalsNeedUpdate = true
	geometry.buffersNeedUpdate = true
	geometry.uvsNeedUpdate = true

	geometry.computeFaceNormals()

    return geometry
}
