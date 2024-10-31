import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BuyPhoneNumberDTO {
    @IsString()
    @IsNotEmpty()
    TN: string;
    @IsString()
    @IsNotEmpty()
    Lidb: string
    @IsString()
    @IsNotEmpty()
    portoutPin: string
    @IsString()
    @IsNotEmpty()
    referenceID: string;
    @IsString()
    @IsNotEmpty()
    trunkGroup: string
    @IsBoolean()
    @IsNotEmpty()
    Sms: string;
    @IsBoolean()
    @IsNotEmpty()
    Mms: string
    @IsString()
    @IsNotEmpty()
    Webhook:string
    
}