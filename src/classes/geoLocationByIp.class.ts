import * as geoip from 'geoip-lite';
import * as mbxClient from '@mapbox/mapbox-sdk';
import * as mbxService from '@mapbox/mapbox-sdk/services/geocoding';
import { ServerMessage } from './ServerMessage.class';


export class GeoLocationByIp {
  geoip: any;
  client: any;
  mbxClient: any;
  mbxService: any;
  mbxClientKey: string;

  constructor() {
    this.geoip = geoip;
    this.mbxClient = mbxClient;
    this.mbxService = mbxService;
    this.mbxClientKey = process.env.MAPBOX_API_KEY;
    // instance client
    this.client = this.mbxService(
      this.mbxClient({
        accessToken: this.mbxClientKey,
      }),
    );
  }

  /**
   *
   */
  async getLocationByIp(ip: string): Promise<any> {
    try {
      let deviceIp = ip.split(':').slice(-1)[0];

      let query: any = await this.client
        .reverseGeocode({
          query: this.geoip.lookup(deviceIp).ll.reverse(),
        })
        .send();
      let location: any = query.body.features.map((item: any) => item.text);

      return new ServerMessage(true, '', {
        zipCode: location[0],
        town: location[1],
        state: location[2],
        country: location[3],
      });
    } catch (error) {
      return new ServerMessage(true, '', error);
    }
  }

  /**
  async getStatesByCountry() {

    const client = this.mbxService(this.mbxClient({
      accessToken: this.mbxClientKey
    }));
      
    let query: any = await client.forwardGeocode({
      query: 'Mexico',
    })
    .send();

    console.log(query)
  }
  */
}
