var path = require('path')
var webpack = require('webpack')

var production = process.argv.indexOf('--production') > -1 || process.env.PRODUCTION ||  process.env.NODE_ENV == 'production'


var plugins = []

if ( production )
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        })
    )

module.exports = {

    entry: {
        test    : [ './tests/run.js' ],
    },

    output: {
        path: path.join(__dirname, '.tmp'),
        filename: '[name].js',
        publicPath: '/',
    },

    module: {

        loaders: [
            {
                test: /\.json$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'json',
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
                    // plugins: ['transform-runtime'],
                }
            },

        ]
    },

    plugins: plugins

}
