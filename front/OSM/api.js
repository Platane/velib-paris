import {get} from '../service/request'

const OSMendPoint = 'http://www.openstreetmap.org' + '/api/0.6'

export const getBackground = ( box ) =>

    // get all the nodes in the box
    get( OSMendPoint+`/map?bbox=${box.min.x},${box.max.y},${box.max.x},${box.min.y}` )
