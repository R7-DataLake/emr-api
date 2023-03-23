import { Knex } from 'knex'
export class ProfileModel {

  getLastAppoint(db: Knex, cid: any) {
    return db('health_profile.appoint as a')
      .select(
        'a.hospcode',
        'h.hospname',
        'a.appoint_date',
        'a.appoint_time',
        'a.remark'
      )
      .innerJoin('libs.hospitals as h', 'h.hospcode', 'a.hospcode')
      .whereRaw(`     
        concat(a.hospcode,a.hn) in (
          select concat(p.hospcode, p.hn
        ) 
        from metadata.person as p 
        where p.cid=?)
      `, [cid])
      .orderByRaw(`a.appoint_date desc, a.appoint_time desc`)
      .first();
  }

  getBp(db: Knex, cid: any) {
    return db('health_profile.screening as s')
      .select(
        's.date_serv', 's.sbp', 's.dbp'
      )
      .whereRaw(`     
        concat(s.hospcode,s.hn) in (
          select concat(p.hospcode, p.hn
        ) 
        from metadata.person as p 
        where p.cid=?)
      `, [cid])
      .whereBetween('s.sbp', [50, 600])
      .orderByRaw(`s.date_serv desc, s.time_serv desc`)
      .limit(10);
  }

  getPulseRate(db: Knex, cid: any) {
    return db('health_profile.screening as s')
      .select(
        's.date_serv', 's.pr'
      )
      .whereRaw(`     
        concat(s.hospcode,s.hn) in (
          select concat(p.hospcode, p.hn
        ) 
        from metadata.person as p 
        where p.cid=?)
      `, [cid])
      .whereBetween('s.pr', [10, 500])
      .orderByRaw(`s.date_serv desc, s.time_serv desc`)
      .limit(10);
  }

  getBmi(db: Knex, cid: any) {
    return db('health_profile.screening as s')
      .select(
        's.date_serv', 's.height', 's.weight',
        db.raw(`s.weight / (s.height / 100)^2 as bmi`)
      )
      .whereRaw(`
        concat(s.hospcode,s.hn) in (
          select concat(p.hospcode, p.hn
        )
        from metadata.person as p 
        where p.cid=?)
      `, [cid])
      .whereBetween('s.height', [10, 300])
      .whereBetween('s.weight', [1, 500])
      .orderByRaw(`s.date_serv desc, s.time_serv desc`)
      .limit(10);
  }

}
