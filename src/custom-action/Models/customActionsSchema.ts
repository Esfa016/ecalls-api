import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ACTION_VERBS } from "src/api_calls/DTO/apiCallsDTO";

@Schema({ timestamps: true })
export class CustomActions {
    @Prop()
    actionId: string
    @Prop()
    name: string
    @Prop()
    description: string
    @Prop()
    endpointUrl: string
    @Prop()
    method: ACTION_VERBS
    @Prop({type:Object})
    headers: object
    @Prop({ type: Object })
    params:object
}

export const CustomActionsSchema = SchemaFactory.createForClass(CustomActions)