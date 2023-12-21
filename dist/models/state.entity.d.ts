import { Town } from './town.entity';
import { Model } from 'sequelize-typescript';
export declare class State extends Model<State> {
    idState: number;
    name: string;
    towns: Town[];
}
