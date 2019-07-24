module.exports = api => {
  api.cache(true);

  const isDevEnv = process.env['ENV'] !== 'prod';

  const presets = [
    ['@babel/preset-env', { modules: false, targets: { browsers: 'last 2 versions' } }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ];

  const plugins = [
    isDevEnv && '@babel/plugin-transform-runtime',
    !isDevEnv && '@babel/runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    !isDevEnv && '@babel/plugin-transform-react-inline-elements',
    !isDevEnv && '@babel/plugin-transform-react-constant-elements',
    !isDevEnv && 'transform-react-remove-prop-types',
    isDevEnv && 'react-hot-loader/babel'
  ].filter(Boolean);

  return {
    presets,
    plugins
  };
};
