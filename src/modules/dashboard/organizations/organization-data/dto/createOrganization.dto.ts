import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class CreateOrganizationRegionDto{
    @IsNotEmpty()
    @IsNumber()
    idOrganization: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}