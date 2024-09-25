import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";
export class MongooseIdDTO{
    @IsNotEmpty()
    @IsMongoId()
    id:mongoose.Schema.Types.ObjectId
}