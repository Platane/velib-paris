import {context} from '../../assert'

context.stack('abstract')
require('./resolve')
require('./reject')
context.stack('fork')
require('./fork')
context.pop().pop()
