import { createServer } from 'http'
import { parse as parseURL } from 'url'
import connectPubSub from '@google-cloud/pubsub'
import { config } from './config'

const createPublish = async (pubsub, topicName) => {
    try {
        await pubsub.createTopic(topicName)
    } catch (err) {}

    const topic = pubsub.topic(topicName)

    const publisher = topic.publisher()

    return o => publisher.publish(new Buffer('-'), o)
}

export const start = async () => {
    // init the pub sub
    const pubsub = connectPubSub({
        projectId: config.googleCloudPlatform.project_id,
        credentials: config.googleCloudPlatform,
    })

    const publish = await createPublish(pubsub, 'cron-every-day-midnight')

    // init the server
    const server = createServer()
    server.on('request', async (request, response) => {
        const url = parseURL(request.url)

        try {
            let res

            switch (url.pathname) {
                case '/cron/every-day-midnight':
                    res = await publish()
                    break
                default:
                    throw new Error('unhandled')
            }

            response.writeHead(200)
            response.end(res && JSON.stringify(res))
        } catch (err) {
            response.writeHead(500)
            response.end(err && JSON.stringify(err))
        }
    })
    server.listen(8080, err => console.log(err || 'server started'))
}
