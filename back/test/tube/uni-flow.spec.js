import expect       from 'expect'
import Tube         from '../../src/common/utils/tube/base'

describe('uni flow', () => {

    describe('producer / consumer', () => {

        it('end on ready', () => {

            const consumer = new Tube
            const producer = new Tube

            producer.onReady = () => producer.end()

            producer.pipe( consumer )

            return consumer.start()
        })

        it('end on ready after X ms', () => {

            const consumer = new Tube
            const producer = new Tube

            producer.onReady = () => setTimeout( () => producer.end(), 10 )

            producer.pipe( consumer )

            return consumer.start()
        })

        it('producer push values, consumer consume right away', () => {

            const consumer = new Tube
            const producer = new Tube

            consumer.onDataReady = () =>
                consumer.pull().ack()

            producer.onReady = () =>
                producer
                    .push('A')
                    .push('B')
                    .push('C')
                    .end()


            producer.pipe( consumer )

            return consumer.start()
        })

        it('producer push values, consumer consume after X ms', () => {

            const consumer = new Tube
            const producer = new Tube

            producer.name = 'producer'
            consumer.name = 'consumer'

            consumer.onDataReady = () => {
                const {ack} = consumer.pull()
                setTimeout( () => ack() ,10)
            }

            producer.onReady = () =>
                producer
                    .push('A')
                    .push('B')
                    .end()


            producer.pipe( consumer )

            return consumer.start()
        })

        it('producer emit error', () => {

            const consumer = new Tube
            const producer = new Tube

            consumer.onDataReady = () =>
                consumer.pull().ack()

            producer.onReady = () =>
                producer
                    .push('A')
                    .push('B')
                    .error('yolo')
                    .push('C')
                    .end()


            producer.pipe( consumer )

            return consumer.start()
                .then( () => expect().toExist() )
                .catch( err => expect( err ).toBe('yolo') )
        })

        it('consumer collect data', () => {

            const consumer = new Tube
            const producer = new Tube

            const stack = []

            consumer.onDataReady = () => {
                const {data, ack} = consumer.pull()
                stack.push( data )
                ack()
            }

            producer.onReady = () =>
                producer
                    .push('A')
                    .push('B')
                    .push('C')
                    .end()


            producer.pipe( consumer )

            return consumer.start()
                .then( () => expect( stack ).toEqual(['A','B','C']) )
        })

    })


    describe('producer / buffer / consumer', () => {
        it('buffer wait x ms', () => {

            const consumer = new Tube
            const producer = new Tube
            const buffer = new Tube

            const stack = []

            consumer.onDataReady = () => {
                const {data, ack} = consumer.pull()
                stack.push( data )
                ack()
            }

            buffer.onDataReady = () => {
                const {ack, data} = buffer.pull()
                setTimeout( () => {
                    buffer.push( data )
                    ack()
                }, 10 )
            }

            producer.onReady = () =>
                producer
                    .push('A')
                    .push('B')
                    .push('C')
                    .end()


            producer
                .pipe( buffer )
                .pipe( consumer )

            return consumer.start()
                .then( () => expect( stack ).toEqual(['A','B','C']) )
        })

    })

})
