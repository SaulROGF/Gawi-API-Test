import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class CreateRegionZoneDto{
    @IsNotEmpty()
    @IsNumber()
    idRegion: number;

    @IsInt({ message: 'El idOrganization debe ser un número entero.' })
    idOrganization: number;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}