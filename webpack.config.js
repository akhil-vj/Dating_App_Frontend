const path = require('path');

module.exports = {
  // ...existing code...
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Add your custom middleware here
      
      return middlewares;
    },
    // Remove deprecated options
    // onBeforeSetupMiddleware: undefined,
    // onAfterSetupMiddleware: undefined,
  },
  // ...existing code...
};