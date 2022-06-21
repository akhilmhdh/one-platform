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
      process.on('SIGINT', () => process.exit(1));

      nodemon({
        script: './dist/index.js',
        ext: 'js json',
      });

      nodemon
        .on('start', function () {
          console.log('App has started');
        })
        .on('quit', function () {
          console.log('App has quit');
          process.exit();
        })
        .on('restart', function (files) {
          console.log('App restarted due to: ', files);
        });
    }
  });
