import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class EditOrganizationRegionDto{
   /*
    @IsNotEmpty()
    @IsNumber()
    idRegion: number;
    */
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}