
import { IsInt, IsOptional,  IsNumber, Min, IsString, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
export class QueryParamsDTO {
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  @Min(1)
  limit: number = 10;
  @IsOptional()
  @IsString()
  searchKey:string
}

export function IsArrayOfObjectIds(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfObjectIds',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (const id of value) {
            if (!Types.ObjectId.isValid(id)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid ObjectIds`;
        },
      },
    });
  }
}