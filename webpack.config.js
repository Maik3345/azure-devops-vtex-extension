const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// Detectar si estamos en modo desarrollo
const isDebug = process.env.DEBUG === 'true'
const mode = process.env.NODE_ENV === 'development' || isDebug ? 'development' : 'production'
const isDevMode = mode === 'development'

// Mostrar información sobre el modo de compilación
console.log(`Webpack mode: ${mode}`)
console.log(`Debug: ${isDebug}`)
console.log(`Development mode: ${isDevMode}`)

// Definir dos configuraciones de webpack separadas
// Una para las tareas de Azure DevOps (node)
// Otra para la extensión web (web)
module.exports = [
  // Configuración para las tareas de Azure DevOps (target: node)
  {
    name: 'tasks',
    mode,
    target: 'node',
    entry: {
      VtexBuildBeta: './tasks/deprecated/VtexBuildBeta/VtexBuildBeta.ts',
      VtexBuildRelease: './tasks/deprecated/VtexBuildRelease/VtexBuildRelease.ts',
      labels: './tasks/git/pullRequest/labels/labels.ts',
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
        const entryPath = module.exports[0].entry[pathData.chunk.name]
        const entryDir = path.dirname(entryPath)
        return `${entryDir}/dist/${pathData.chunk.name}.js`
      },
      libraryTarget: 'commonjs2',
    },
    // Configuración para evitar la minificación en modo desarrollo
    optimization: {
      minimize: !isDevMode,
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
  },

  // Configuración para la extensión web (target: web)
  {
    name: 'extension',
    mode,
    target: 'web',
    entry: {
      extension: './src/extension/extension.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      // Usar UMD en lugar de AMD para mejor compatibilidad
      libraryTarget: 'umd',
      library: 'ExtensionClient',
      globalObject: 'this'
    },
    plugins: [
      new CleanWebpackPlugin({
        // No limpiar los archivos de tareas, solo la carpeta dist principal
        cleanOnceBeforeBuildPatterns: ['*'],
        cleanStaleWebpackAssets: false,
      }),
      // Generar el HTML de la extensión con la referencia al script correspondiente
      new HtmlWebpackPlugin({
        chunks: ['extension'],
        filename: 'extension.html',
        template: 'src/extension/extension.html',
        inject: 'body', // Inyectar los scripts al final del body
        minify: isDevMode ? false : {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
        },
      }),
    ],
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
    optimization: {
      // En modo desarrollo o debug, no minificar
      minimize: !isDevMode,
      // Configuración específica para modo desarrollo
      ...(isDevMode && {
        // Configuración para mejorar la depuración
        chunkIds: 'named',
        moduleIds: 'named',
        mangleExports: false,
      })
    },
  }
]
