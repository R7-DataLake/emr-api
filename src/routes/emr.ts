import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import { EmrModel } from '../models/emr';
import { ZoneModel } from '../models/zone';
import ipdLastSchema from '../schema/emr/ipd_last';
import opdLastSchema from '../schema/emr/opd_last';
import personInfoSchema from '../schema/emr/person_info';
import opdDiagSchema from '../schema/emr/opd_diag';
import ipdDiagSchema from '../schema/emr/ipd_diag';
import opdDrugSchema from '../schema/emr/opd_drug';
import ipdDrugSchema from '../schema/emr/ipd_drug';
import opdLabSchema from '../schema/emr/opd_lab';
import ipdInfoSchema from '../schema/emr/ipd_info';
import opdInfoSchema from '../schema/emr/opd_info';

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const emrModel = new EmrModel();
  const zoneModel = new ZoneModel();
  const dbzone = fastify.dbzone;

  fastify.post('/person/info', {
    onRequest: [fastify.authenticate],
    schema: personInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zone } = body;
      const params: any = {
        hospcode,
        hn
      }

      const key = `r7platform_emr_api_person_info_${zone}_${hospcode}_${hn}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getPersonInfo(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/opd/last', {
    onRequest: [fastify.authenticate],
    schema: opdLastSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zone } = body;

      const params: any = {
        hospcode,
        hn
      }

      const key = `r7platform_emr_api_opd_last_${zone}_${hospcode}_${hn}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getLastOpd(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/ipd/last', {
    onRequest: [fastify.authenticate],
    schema: ipdLastSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, hn, zone } = body;

      const params: any = {
        hospcode,
        hn
      }

      const key = `r7platform_emr_api_ipd_last_${zone}_${hospcode}_${hn}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getLastIpd(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/opd/diag', {
    onRequest: [fastify.authenticate],
    schema: opdDiagSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, zone } = body;

      const params: any = {
        hospcode,
        seq
      }

      const key = `r7platform_emr_api_opd_diag_${zone}_${hospcode}_${seq}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getOpdDiag(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/ipd/diag', {
    onRequest: [fastify.authenticate],
    schema: ipdDiagSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, zone } = body;

      const params: any = {
        hospcode,
        an
      }

      const key = `r7platform_emr_api_ipd_diag_${zone}_${hospcode}_${an}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getIpdDiag(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/ipd/drug', {
    onRequest: [fastify.authenticate],
    schema: ipdDrugSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, zone } = body;

      const params: any = {
        hospcode,
        an
      }

      const key = `r7platform_emr_api_ipd_drug_${zone}_${hospcode}_${an}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getIpdDrug(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/opd/drug', {
    onRequest: [fastify.authenticate],
    schema: opdDrugSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, zone } = body;

      const params: any = {
        hospcode,
        seq
      }

      const key = `r7platform_emr_api_opd_drug_${zone}_${hospcode}_${seq}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getOpdDrug(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/opd/lab', {
    onRequest: [fastify.authenticate],
    schema: opdLabSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, zone } = body;

      const params: any = {
        hospcode,
        seq
      }

      const key = `r7platform_emr_api_opd_lab_${zone}_${hospcode}_${seq}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getOpdLab(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/opd/info', {
    onRequest: [fastify.authenticate],
    schema: opdInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, seq, zone } = body;

      const params: any = {
        hospcode,
        seq
      }

      const key = `r7platform_emr_api_opd_info_${zone}_${hospcode}_${seq}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getOpdInfo(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  fastify.post('/ipd/info', {
    onRequest: [fastify.authenticate],
    schema: ipdInfoSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { hospcode, an, zone } = body;

      const params: any = {
        hospcode,
        an
      }

      const key = `r7platform_emr_api_ipd_info_${zone}_${hospcode}_${an}`;

      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const resZone: any = await zoneModel.getZone(dbzone, zone);

      if (_.isEmpty(resZone)) {
        return reply.status(StatusCodes.NOT_FOUND)
          .send({
            status: 'error',
            error: 'Zone info not found'
          })
      }

      const zoneEndpoint = resZone.endpoint || 'localhost:50052';
      const apiKey = resZone.apikey || '';

      const results: any = await emrModel.getIpdInfo(params, apiKey, zoneEndpoint);
      // save to cache
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 2 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: error.message
        })
    }
  });

  done();

} 
