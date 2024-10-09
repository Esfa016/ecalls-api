import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Users } from "./userSchema";


@Schema({ timestamps: true })
export class UserOTP {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
    userId: mongoose.Schema.Types.ObjectId
    @Prop({ index: true })
    otp: number
    @Prop()
    token:string
}

export const UserOtpSchema  = SchemaFactory.createForClass(UserOTP)