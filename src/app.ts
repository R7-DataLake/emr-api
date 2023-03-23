import fastify from 'fastify';

const app = fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true
          }
        }
        : undefined
  }
})

// Plugins
app.register(require('@fastify/formbody'))
app.register(require('@fastify/cors'))

// Rate limit
app.register(import('@fastify/rate-limit'), {
  global: false,
  max: 100,
  timeWindow: '1 minute'
})

// Metadata database connection
app.register(require('./plugins/db'), {
  name: 'dbmetadata',
  options: {
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_EMR_API_METADATA_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_EMR_API_METADATA_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_EMR_API_METADATA_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_EMR_API_METADATA_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_EMR_API_METADATA_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_EMR_API_METADATA_DB_SCHEMA || 'public'],
    pool: {
      min: Number(process.env.R7PLATFORM_EMR_API_METADATA_DB_POOL_MIN) || 0,
      max: Number(process.env.R7PLATFORM_EMR_API_METADATA_DB_POOL_MAX) || 10
    },
    debug: process.env.NODE_ENV === "development" ? true : false,
  }
});

// Health profile database connection
app.register(require('./plugins/db'), {
  name: 'dbprofile',
  options: {
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_EMR_API_PROFILE_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_EMR_API_PROFILE_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_EMR_API_PROFILE_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_EMR_API_PROFILE_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_EMR_API_PROFILE_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_EMR_API_PROFILE_DB_SCHEMA || 'public'],
    pool: {
      min: Number(process.env.R7PLATFORM_EMR_API_PROFILE_DB_POOL_MIN) || 0,
      max: Number(process.env.R7PLATFORM_EMR_API_PROFILE_DB_POOL_MAX) || 10
    },
    debug: process.env.NODE_ENV === "development" ? true : false,
  }
});

// Zone database connection
app.register(require('./plugins/db'), {
  name: 'dbzone',
  options: {
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_EMR_API_ZONE_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_EMR_API_ZONE_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_EMR_API_ZONE_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_EMR_API_ZONE_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_EMR_API_ZONE_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_EMR_API_ZONE_DB_SCHEMA || 'public'],
    pool: {
      min: Number(process.env.R7PLATFORM_EMR_API_ZONE_DB_POOL_MIN) || 0,
      max: Number(process.env.R7PLATFORM_EMR_API_ZONE_DB_POOL_MAX) || 10
    },
    debug: process.env.NODE_ENV === "development" ? true : false,
  }
});

// Redis cache
app.register(require('@fastify/redis'), {
  host: process.env.R7PLATFORM_EMR_API_REDIS_HOST || '127.0.0.1',
  password: process.env.R7PLATFORM_EMR_API_REDIS_PASSWORD || '',
})

// JWT for Login
app.register(require('./plugins/jwt'),
  {
    secret: process.env.R7PLATFORM_EMR_API_SECRET_KEY,
    sign: {
      iss: 'r7platform-emr-api.moph.go.th',
      expiresIn: '1h'
    },
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: 'Autorization header is missing!',
      authorizationTokenExpiredMessage: 'Authorization token expired',
      authorizationTokenInvalid: (err: any) => {
        return `Authorization token is invalid: ${err.message}`
      }
    }

  });

app.addHook('onSend', (_request: any, reply: any, _playload: any, done: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_EMR_API_HOSTNAME || 'dummy-server',
  })

  done()

})

// routes
app.register(require("./routes/emr"), { prefix: '/emr' })
app.register(require("./routes/status"), { prefix: '/status' })
app.register(require("./routes/metadata"), { prefix: '/metadata' })
app.register(require("./routes/profile"), { prefix: '/profile' })

export default app
