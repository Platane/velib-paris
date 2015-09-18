
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
require('./primitive/pointOnSegment')
require('./primitive/contains.trianglePonderation')

context.pop().stack('advanced')

require('./advanced/delaunay')
require('./advanced/delaunay.circonscritCircle')



context.pop()
