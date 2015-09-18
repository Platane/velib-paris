import {boundingBox} from './bounding'
import {quadTree} from './quadTree'

export const map = ( triangles, values, rect, r ) => {


    const partition = reccursivePartition( triangles, rect, 2 )

    return Array.apply(null, Array(5000)).map( (_, n) => n )


}
