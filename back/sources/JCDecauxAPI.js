import * as url from 'url'
import {request} from 'https'


const api_key = process.env.API_KEY


const uri = ( route, query={} ) =>
    ({
        protocol: 'https',
        host: 'api.jcdecaux.com',
        port: 80,
        pathname: 'vls/v1/'+route,
        query: { apikey:api_key, ...query },
    })
