
// ;[
//     './advanced/delaunay',
//     './advanced/delaunay.circonscritCircle',
//
//     './primitive/linesIntersection',
//     './primitive/pointOnSegment',
//
// ].forEach( x => require( x ) )

import {context} from '../assert'

context.stack('math')

context.stack('primitive')

require('./primitive/linesIntersection')
require('./primitive/contains.inTriangle')
require('./primitive/contains.trianglePonderation')
// require('./primitive/pointOnSegment')

context.pop().stack('advanced')

require('./advanced/delaunay.circonscritCircle')
require('./advanced/delaunay')
// require('./advanced/quadTree')



context.pop()
