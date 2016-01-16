import {context} from '../assert'

context.stack('pipe')

context.stack('abstract')

require('./abstract')

context.pop().pop()
