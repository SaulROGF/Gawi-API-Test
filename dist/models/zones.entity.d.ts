import { Model } from "sequelize-typescript";
import { Regions } from "./regions.entity";
import { Stations } from "./stations.entity";
export declare class Zones extends Model<Zones> {
    idZone: number;
    idRegion: number;
    idOrganization: number;
    name: string;
    region: Regions;
    stations: Stations[];
}
