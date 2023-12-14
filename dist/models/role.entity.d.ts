import { Model } from 'sequelize-typescript';
export declare class Role extends Model<Role> {
    idRole: number;
    name: string;
    description: string;
}
