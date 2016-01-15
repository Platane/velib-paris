import {context} from '../../assert'

context.stack('stream')

context.stack('toPromise')
require('./toPromise')
context.pop()


context.stack('fromPromise')
require('./fromPromise')
context.pop()

//
// context.stack('batch')
// require('./batch')
// context.pop()



context.pop()
