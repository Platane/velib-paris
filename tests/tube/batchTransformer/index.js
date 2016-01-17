import {context} from '../../assert'

context.stack('batchTransformer')
require('./resolve')
context.pop()
