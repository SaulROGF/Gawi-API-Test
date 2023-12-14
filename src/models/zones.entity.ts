import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table, Model, HasMany } from "sequelize-typescript";
import { Regions } from "./regions.entity";
import { Stations } from "./stations.entity";
import { Organization } from "./organization.entity";



@Table({
    tableName: 'zones', 
    timestamps: true,
    createdAt: false,
    updatedAt: false,

})
export class Zones extends Model<Zones>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER, 
        allowNull: false, 
        field: 'idZone'
    })
    idZone: number;

    @ForeignKey(() => Regions) 
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'idRegion'
    })
    idRegion: number;

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

    @BelongsTo(() => Regions)
    region: Regions;

    @HasMany(() => Stations)
    stations: Stations[];
}