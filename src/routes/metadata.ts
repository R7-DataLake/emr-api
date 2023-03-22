import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { MetadataModel } from '../models/metadata';
import lastIpdSchema from '../schema/metadata/ipd_last';
import lastOpdSchema from '../schema/metadata/opd_last';
import patientListSchema from '../schema/metadata/patient_list';
import searchSchema from '../schema/metadata/search';

const crypto = require('crypto');

export default async (fastify: FastifyInstance, _options: any, done: any) => {

  const metadataModel = new MetadataModel();
  const db = fastify.dbmetadata;

  fastify.post('/search', {
    schema: searchSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_metada_person_search_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await metadataModel.search(db, cid);

      const results = _data.map((v: any) => {
        v.birth = DateTime.fromJSDate(v.birth).toFormat('yyyy-MM-dd');
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

  fastify.post('/opd/last', {
    schema: lastOpdSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_metada_opd_last_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await metadataModel.getLastOPDvisit(db, cid);
      const results = _data.map((v: any) => {
        v.date_serv = DateTime.fromJSDate(v.date_serv).toFormat('yyyy-MM-dd');
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

  fastify.post('/ipd/last', {
    schema: lastIpdSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const body: any = request.body;
      const { cid } = body;

      const strKey = `r7platform_emr_api_metada_ipd_last_${cid}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await metadataModel.getLastIPDvisit(db, cid);
      const results = _data.map((v: any) => {
        v.dateadm = DateTime.fromJSDate(v.dateadm).toFormat('yyyy-MM-dd');
        v.datedsc = DateTime.fromJSDate(v.datedsc).toFormat('yyyy-MM-dd');
        return v;
      })
      await fastify.redis.set(key, JSON.stringify(results), 'EX', 1 * 60 * 60); // expire in 2hr

      reply.headers({ 'x-cache': false })
        .status(StatusCodes.OK)
        .send(results);
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
        })
    }
  });

  fastify.get('/patient/list', {
    schema: patientListSchema,
    onRequest: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const _query: any = request.query;
      const { query, limit, offset } = _query;
      const hospcode = request.user.hospcode;

      const _key = `${query}${limit}${offset}`;
      const strKey = `r7platform_emr_api_metada_patient_list_${_key}`;
      const key = crypto.createHash('md5').update(strKey).digest("hex");
      // // read from cache
      const cacheResult: any = await fastify.redis.get(key);
      if (cacheResult) {
        const results: any = JSON.parse(cacheResult);
        return reply.headers({ 'x-cache': true })
          .status(StatusCodes.OK)
          .send(results);
      }

      const _data: any = await metadataModel.getPersonList(db, hospcode, query, limit, offset);

      const total: any = await metadataModel.getPersonListTotal(db, hospcode, query);

      const _results = _data.map((v: any) => {
        v.birth = DateTime.fromJSDate(v.birth).toFormat('yyyy-MM-dd');
        return v;
      })

      const results = {
        results: _results,
        total: Number(total[0].total)
      }

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

  done()

} 
