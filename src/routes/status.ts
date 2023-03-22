import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import _ from "lodash";

import { ZoneModel } from '../models/zone';
import { StatusModel } from "../models/status";
import statusSchema from '../schema/status';

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const statusModel = new StatusModel();
  const zoneModel = new ZoneModel();
  const dbzone = fastify.dbzone;

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      reply.status(StatusCodes.OK)
        .send({
          status: 'ok'
        })

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  })

  fastify.post('/grpc', {
    schema: statusSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { zoneKey } = body;

      const resZone: any = await zoneModel.getZone(dbzone, zoneKey);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const result: any = await statusModel.status(apiKey, zoneEndpoint);

      reply.status(StatusCodes.OK)
        .send(result)
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  })

  done()

} 
