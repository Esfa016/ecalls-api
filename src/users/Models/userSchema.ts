import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { AccountRoles } from 'src/Global/sharables';
@Schema({ timestamps: true })
export class Users extends Document{
    @Prop({})
    fullName: string
    @Prop({index:true,unique:true})
    email: string
    @Prop({})
    password: string
    @Prop({})
    phone: string
    @Prop({ type: Boolean, default:false })
    emailVerified: boolean
    @Prop({ type: Date })
    lastLogin: Date
    @Prop({ enum: AccountRoles ,default:AccountRoles.CLIENT})
    role:AccountRoles
    
}
export const UserSchema = SchemaFactory.createForClass(Users)
UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 8)
    next()
   
})