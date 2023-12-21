"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoLocationByIp = void 0;
const geoip = require("geoip-lite");
const mbxClient = require("@mapbox/mapbox-sdk");
const mbxService = require("@mapbox/mapbox-sdk/services/geocoding");
const ServerMessage_class_1 = require("./ServerMessage.class");
class GeoLocationByIp {
    constructor() {
        this.geoip = geoip;
        this.mbxClient = mbxClient;
        this.mbxService = mbxService;
        this.mbxClientKey = process.env.MAPBOX_API_KEY;
        this.client = this.mbxService(this.mbxClient({
            accessToken: this.mbxClientKey,
        }));
    }
    async getLocationByIp(ip) {
        try {
            let deviceIp = ip.split(':').slice(-1)[0];
            let query = await this.client
                .reverseGeocode({
                query: this.geoip.lookup(deviceIp).ll.reverse(),
            })
                .send();
            let location = query.body.features.map((item) => item.text);
            return new ServerMessage_class_1.ServerMessage(true, '', {
                zipCode: location[0],
                town: location[1],
                state: location[2],
                country: location[3],
            });
        }
        catch (error) {
            return new ServerMessage_class_1.ServerMessage(true, '', error);
        }
    }
}
exports.GeoLocationByIp = GeoLocationByIp;
//# sourceMappingURL=geoLocationByIp.class.js.map