import * as jsonwebtoken from 'jsonwebtoken';
import { AxiosInstance } from 'axios';
import Knex from 'knex';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    dbmetadata: Knex;
    dbzone: Knex;
    dbprofile: Knex;
    jwt: any;
    redis: Redis;
  }

  interface FastifyRequest {
    user: any;
    jwtVerify: jsonwebtoken
  }

}
