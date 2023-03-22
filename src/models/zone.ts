import { Knex } from 'knex'
export class ZoneModel {

  getZone(db: Knex, zoneKey: any) {
    return db('users.zones')
      .select('endpoint', 'apikey')
      .where('zone_key', zoneKey)
      .first()
  }

}
