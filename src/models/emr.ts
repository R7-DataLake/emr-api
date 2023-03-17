import { GRPCClient } from "../grpc/client";

export class EmrModel {

  async getPersonInfo(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getPerson(params, apiKey);
  }

  async getLastOpd(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getLastOpd(params, apiKey);
  }

  async getLastIpd(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getLastIpd(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `seq` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getOpdDiag(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getOpdDiag(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `an` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getIpdDiag(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getIpdDiag(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `seq` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getOpdDrug(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getOpdDrug(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `an` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getIpdDrug(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getIpdDrug(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `seq` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getOpdLab(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getOpdLab(params, apiKey);
  }

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `seq` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getOpdInfo(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getOpdInfo(params, apiKey);
  }
  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `an` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getIpdInfo(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getIpdInfo(params, apiKey);
  }

}