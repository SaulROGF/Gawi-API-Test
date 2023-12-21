import { Model } from 'sequelize-typescript';
export declare class Agenda extends Model<Agenda> {
    idAgenda: number;
    idOrganization: number;
    idUser: number;
    idDevice: number;
    comment: string;
    type: number;
    status: string;
    viewDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
