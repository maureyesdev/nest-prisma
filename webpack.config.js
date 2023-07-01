const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    '@as-integrations/fastify',
    '@apollo/subgraph',
    '@apollo/gateway',
    '@apollo/subgraph/package.json',
    '@apollo/subgraph/dist/directives',
    'ts-morph',
    'class-transformer/storage',
  ];

  return {
    ...options,
    entry: './src/lambda.ts',
    externals: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
    module: {
      ...options.module,
      rules: [
        ...options.module.rules,
        // * Loader to ignore fsevents for mac os
        {
          test: /fsevents/,
          use: 'null-loader',
        },
      ],
    },
  };
};
