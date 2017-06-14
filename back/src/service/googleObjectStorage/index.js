import googleapis from 'googleapis';
import { getAuth } from '../googleAuth';

type Options = {
    client_email: string,
    private_key: string,
    project_id: string,
};

export const create = async (options: Options) => {
    const ds = googleapis.datastore({
        auth: await getAuth(options),
        projectId: options.project_id,
        version: 'v1',
        params: { projectId: options.project_id },
    });

    return {
        commit: resource =>
            new Promise((resolve, reject) =>
                ds.projects.commit(
                    { resource },
                    (err, res) => (err ? reject(err) : resolve(res))
                )
            ),
        runQuery: resource =>
            new Promise((resolve, reject) =>
                ds.projects.runQuery(
                    { resource },
                    (err, res) => (err ? reject(err) : resolve(res))
                )
            ),
    };
};
