import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';


@Table({
  tableName: 'roles',
})
export class Role extends Model<Role> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idRole: number;

  /**
   * column declarations
   */
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;


  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  description: string;

}
