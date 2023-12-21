import { User } from './user.entity';
import { State } from './state.entity';
import { Model } from 'sequelize-typescript';
export declare class Town extends Model<Town> {
    idTown: number;
    idState: number;
    name: string;
    users: User[];
    state: State;
}
