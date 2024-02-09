import { 
    AutoIncrement, 
    BelongsTo, 
    Column, 
    DataType, 
    ForeignKey, 
    PrimaryKey, 
    Table, 
    Model 
} from "sequelize-typescript";
import { Zones } from "./zones.entity";
import { Organization } from "./organization.entity";
import { User } from "./user.entity"; // Asumiendo que tienes un entity para usuarios llamado "User"
//import { DeviceStation } from "./deviceStation.entity";

@Table({
    tableName: 'stations', 
    timestamps: true,
    createdAt: false,
    updatedAt: false,
})
export class Stations extends Model<Stations> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER, 
        allowNull: false, 
        field: 'idStation'
    })
    idStation: number;

    @ForeignKey(() => Zones)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'idZone'
    })
    idZone?: number;

    @ForeignKey(() => Organization)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'idOrganization'
    })
    idOrganization: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        field: 'name'
    })
    name: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'supervisorId'
    })
    supervisorId?: number;

    @Column({
        type: DataType.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
        field: 'openingTime'
    })
    openingTime?: string;

    @Column({
        type: DataType.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
        field: 'closingTime'
    })
    closingTime?: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is24Hours'
    })
    is24Hours: boolean;
    
    
    @BelongsTo(() => Zones)
    zone: Zones;

    @BelongsTo(() => Organization)
    organization: Organization;

    @BelongsTo(() => User)
    supervisor: User;

    /*
    @ForeignKey(() => DeviceStation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'idDeviceStation'
    })
    idDeviceStation: number;
    @BelongsTo(() => DeviceStation, 'idDeviceStation')
    deviceStation: DeviceStation;
    */
   

}