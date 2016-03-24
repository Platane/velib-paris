import expect       from 'expect'
import Tube         from '../../src/common/utils/tube/base'

describe('alternative consumer flow', () => {

    it('end on ready', () => {

        // const c1 = new Tube
        // const c2 = new Tube
        // const producer = new Tube
        // const collector = new Tube
        //
        // c1.onDataReady = () => {
        //     const {data, ack} = consumer.pull()
        //     consumer.push( data )
        //     ack()
        // }
        // c2.onDataReady = () => {
        //     const {data, ack} = consumer.pull()
        //     consumer.push( data )
        //     ack()
        // }
        //
        // producer.onReady = () =>
        //     producer
        //         .push('A')
        //         .push('B')
        //         .end()
        //
        //
        //
        // producer.onReady = () => producer.end()
        //
        // producer.pipe( consumer )
        //
        // return consumer.start()
    })

})
