import { Town } from './town.entity';
import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';


@Table({
  tableName: 'states',
})
export class State extends Model<State> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idState: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;
  
  /**
   * join declarations
   */
  @HasMany(() => Town, 'idState')
  towns: Town[];
}
