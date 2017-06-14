import googleapis from 'googleapis';

type Options = {
    client_email: string,
    private_key: string,
};
export const getAuth = (options: Options): Promise<Object> =>
    new Promise((resolve, reject) => {
        const auth = new googleapis.auth.JWT(
            // mail
            options.client_email,
            //
            null,
            // account private
            options.private_key,
            // scopes
            [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/datastore',
            ]
        );
        auth.authorize(err => (err ? reject(err) : resolve(auth)));
    });
