import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DateTime } from 'luxon';
const crypto = require('crypto');

import { ProfileModel } from '../models/profile';
import cidSchema from '../schema/profile/cid_search';

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const profileModel = new ProfileModel();
  const db = fastify.dbprofile;

  fastify.post('/last/appoint', {
    schema: cidSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_profile_last_appoint_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const result: any = await profileModel.getLastAppoint(db, cid);

      console.log(result);

      if (_.isEmpty(result)) {
        return reply.send()
      }

      await fastify.redis.set(key, JSON.stringify(result), 'EX', 1 * 60 * 60); // expire in 1hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(result);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  fastify.post('/bp', {
    schema: cidSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_profile_bp_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await profileModel.getBp(db, cid);

      const results = _data.map((v: any) => {
        v.date_serv = DateTime.fromJSDate(v.date_serv).toFormat('yyyy-MM-dd');
        v.sbp = Number(v.sbp);
        v.dbp = Number(v.dbp);
        return v;
      })

      await fastify.redis.set(key, JSON.stringify(results), 'EX', 1 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  fastify.post('/pulse', {
    schema: cidSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_profile_pulse_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await profileModel.getPulseRate(db, cid);

      const results = _data.map((v: any) => {
        v.date_serv = DateTime.fromJSDate(v.date_serv).toFormat('yyyy-MM-dd');
        v.pr = Number(v.pr);
        return v;
      })

      await fastify.redis.set(key, JSON.stringify(results), 'EX', 1 * 60 * 60); // expire in 1hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  fastify.post('/bmi', {
    schema: cidSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_profile_bmi_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await profileModel.getBmi(db, cid);

      const results = _data.map((v: any) => {
        v.date_serv = DateTime.fromJSDate(v.date_serv).toFormat('yyyy-MM-dd');
        v.weight = Number(v.weight);
        v.height = Number(v.height);
        v.bmi = Number(v.bmi);
        return v;
      })

      await fastify.redis.set(key, JSON.stringify(results), 'EX', 1 * 60 * 60); // expire in 1hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);

    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: 'error' })
    }
  });

  done()

} 
