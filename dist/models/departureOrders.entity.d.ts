import { Model } from 'sequelize-typescript';
import { Organization } from './organization.entity';
import { User } from './user.entity';
export declare class DepartureOrder extends Model<DepartureOrder> {
    idDepartureOrder: number;
    idUser: number;
    idOrganization: number;
    status: number;
    deviceType: number;
    deviceQuantity: number;
    createdAt: Date;
    deliveredAt: Date;
    user: User;
    organization: Organization;
}
