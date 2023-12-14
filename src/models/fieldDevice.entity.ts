import { Device } from './device.entity';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'fieldDevices', 
})
export class FieldDevice extends Model<FieldDevice> {
  /**
   * Primary and foreign keys
   */
  @Column({
    type: DataType.INTEGER(),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Device)
  @Column({
    type: DataType.INTEGER({ length: 11 }),
    allowNull: false,
  })
  idDevice: number;

  
}
