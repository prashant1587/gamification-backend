const swaggerDocument: any = {
  openapi: '3.0.0',
  info: {
    title: 'Gamification API',
    version: '1.0.0'
  },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/signup': {
      post: {
        summary: 'User signup',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                  partnerOrgName: { type: 'string' },
                  partnerType: { type: 'string' },
                  role: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': { description: 'JWT token and user info' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'User login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': { description: 'JWT token and user info' }
        }
      }
    },
    '/me': {
      get: {
        summary: 'Get current user',
        responses: {
          '200': { description: 'User object' }
        }
      }
    },
    '/events/events': {
      post: {
        summary: 'Process activity event',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  idempotencyKey: { type: 'string' },
                  userId: { type: 'string' },
                  type: { type: 'string' }
                },
                required: ['idempotencyKey', 'userId', 'type']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Processed activity event' }
        }
      }
    },
    '/deals/register': {
      post: {
        summary: 'Register a deal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  amount: { type: 'number' }
                },
                required: ['name', 'amount']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Deal created' }
        }
      }
    },
    '/deals/{id}/approve': {
      post: {
        summary: 'Approve a deal',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Deal updated' }
        }
      }
    },
    '/deals/{id}/close': {
      post: {
        summary: 'Close a deal',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  outcome: { type: 'string' }
                },
                required: ['outcome']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Deal closed' }
        }
      }
    },
    '/training/complete': {
      post: {
        summary: 'Mark training complete',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  trackCode: { type: 'string' },
                  score: { type: 'number' }
                },
                required: ['trackCode']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Training marked complete' }
        }
      }
    },
    '/challenges': {
      post: {
        summary: 'Create a challenge',
        responses: {
          '200': { description: 'Challenge created' }
        }
      },
      get: {
        summary: 'List active challenges',
        responses: {
          '200': { description: 'List of challenges' }
        }
      }
    },
    '/challenges/{id}/progress': {
      get: {
        summary: 'Get challenge progress',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Challenge progress' }
        }
      }
    },
    '/rewards/catalog': {
      get: {
        summary: 'List reward catalog',
        responses: {
          '200': { description: 'List of rewards' }
        }
      }
    },
    '/rewards/redeem/{rewardId}': {
      post: {
        summary: 'Redeem a reward',
        parameters: [
          { name: 'rewardId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Redemption result' }
        }
      }
    },
    '/leaderboards/{key}': {
      get: {
        summary: 'Get leaderboard snapshot',
        parameters: [
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Leaderboard data' }
        }
      }
    },
    '/tiers/me': {
      get: {
        summary: 'Get tier status for current user',
        responses: {
          '200': { description: 'Tier status' }
        }
      }
    }
  }
};

export default swaggerDocument;
