var path = require('path')
var webpack = require('webpack')

var production = process.argv.indexOf('--production') > -1


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
        app: [ './front/app.js' ],
        test: [ './tests/run.js' ],
    },

    output: {
        path: path.join(__dirname, '.tmp'),
        filename: '[name].js',
        publicPath: '/',
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0'],
                    plugins: [
                        'transform-runtime',
                        'babel-plugin-transform-async-to-generator',
                        'babel-plugin-transform-async-functions',
                    ],
                }
            },

            {
                test: /\.jsx$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0', 'react'],
                    // plugins: ['transform-runtime'],
                }
            },

        ]
    },

    plugins: plugins

}
