import { Model } from "sequelize-typescript";
import { Zones } from "./zones.entity";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";
export declare class Stations extends Model<Stations> {
    idStation: number;
    idZone?: number;
    idOrganization: number;
    name: string;
    supervisorId?: number;
    openingTime?: string;
    closingTime?: string;
    is24Hours: boolean;
    zone: Zones;
    organization: Organization;
    supervisor: User;
}
