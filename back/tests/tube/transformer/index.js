import {context} from '../../assert'

context.stack('transformer')
require('./resolve')
context.pop()
