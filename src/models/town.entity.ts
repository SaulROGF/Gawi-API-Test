import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { State } from './state.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo
} from 'sequelize-typescript';


@Table({
  tableName: 'towns',
})
export class Town extends Model<Town> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,

  })
  idTown: number;


  @ForeignKey(() => State)
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
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
  @HasMany(() => User, 'idTown')
  users: User[];


  @BelongsTo(() => State, 'idState')
  state : State;
}
