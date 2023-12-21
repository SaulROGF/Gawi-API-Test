import { Model } from "sequelize-typescript";
import { Organization } from "./organization.entity";
import { Zones } from "./zones.entity";
export declare class Regions extends Model<Regions> {
    idRegion: number;
    idOrganization: number;
    name: string;
    organization: Organization;
    zones: Zones[];
}
