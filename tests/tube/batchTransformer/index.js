import {context} from '../../assert'

context.stack('batchTransformer')
require('./resolve')
require('./async')
context.pop()
