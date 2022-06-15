const { build } = require('esbuild');
const graphqlLoaderPlugin = require('@luckycatfactory/esbuild-graphql-loader').default;
var nodemon = require('nodemon');

build({
  entryPoints: ['./src/index.ts'],
  platform: 'node',
  bundle: true,
  watch: {
    onRebuild(err) {
      if (!err) {
        console.info('✓ Updated');
      } else {
        console.error('x Failed');
      }
    },
  },
  target: 'node16',
  outfile: 'dist/index.js',
  plugins: [graphqlLoaderPlugin()],
})
  .catch(() => {
    process.exit(1);
  })
  .then((build) => {
    if (!build.errors.length) {
      nodemon({
        script: './dist/index.js',
        ext: 'js json',
      });

      console.log('Build finished');
    }
  });
