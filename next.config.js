module.exports = {
    webpack: (config, { isServer }) => {
        // Only use file-loader on the client-side
        if (!isServer) {
            config.module.rules.push({
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: '/_next/static/images/',
                            outputPath: 'static/images/',
                            name: '[name].[hash].[ext]',
                        },
                    },
                ],
            })
        }

        return config
    },
}
