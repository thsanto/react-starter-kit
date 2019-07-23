module.exports = api => {
  api.cache(true);

  const runtime =
    process.env['ENV'] === 'prod' ? '@babel/runtime' : '@babel/plugin-transform-runtime';
    
  const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];
  const plugins = [
    runtime,
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-react-inline-elements',
    '@babel/plugin-transform-react-constant-elements',
    'transform-react-remove-prop-types'
  ];

  return {
    presets,
    plugins
  };
};
