import {context} from '../../assert'

context.stack('abstract')
require('./resolve')
require('./reject')
context.pop()
