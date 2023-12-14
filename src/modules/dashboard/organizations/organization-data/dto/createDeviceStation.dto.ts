import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class createDeviceStationDto{
    @IsNotEmpty()
    @IsNumber()
    idDevice: number;

    @IsNotEmpty()
    @IsNumber()
    idStation: number;
}