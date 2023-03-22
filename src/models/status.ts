import { GRPCClient } from "../grpc/client";

export class StatusModel {
  /**
   * 
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async status(apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.status(apiKey);
  }

}