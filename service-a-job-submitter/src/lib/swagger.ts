const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job API',
      version: '1.0.0',
      description: 'API documentation for the Job Processor service',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
  },
  apis: ['src/modules/job/routes.ts'], // Path to the API docs (fixed path)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
