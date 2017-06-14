import { config as googleCloudPlatform } from './googleCloudPlatform';

export const config = {
    JCDecauxAPI: {
        apiKey: process.env.JCDECAUX_API_KEY || '',
    },

    googleCloudPlatform,
};
