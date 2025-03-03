const path = require('path')

module.exports = {
  entry: {
    VtexBuildBeta: './tasks/deprecated/VtexBuildBeta/VtexBuildBeta.ts',
    VtexBuildRelease: './tasks/deprecated/VtexBuildRelease/VtexBuildRelease.ts',
    mergeIntoBranch:
      './tasks/git/pullRequest/mergeIntoBranch/mergeIntoBranch.ts',
    prRelease: './tasks/git/pullRequest/release/release.ts',
    release: './tasks/git/release/release.ts',
    setupDependencies: './tasks/project/setupDependencies/setupDependencies.ts',
    deploy: './tasks/vtex/deploy/deploy.ts',
    publish: './tasks/vtex/publish/publish.ts',
    login: './tasks/vtex/login/login.ts',
    prDeploy: './tasks/vtex/pullRequest/deploy/deploy.ts',
    prPublish: './tasks/vtex/pullRequest/publish/publish.ts',
    prChangeOriginToSourceBranch:
      './tasks/vtex/pullRequest/changeOriginToSourceBranch/changeOriginToSourceBranch.ts',
    changeOriginToSourceBranch:
      './tasks/vtex/changeOriginToSourceBranch/changeOriginToSourceBranch.ts',
  },
  output: {
    path: path.resolve(__dirname),
    filename: (pathData) => {
      const name = pathData.chunk.name
      const entryPath = module.exports.entry[name]
      const entryDir = path.dirname(entryPath)
      return `${entryDir}/dist/${name}.js`
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  mode: 'production',
}
