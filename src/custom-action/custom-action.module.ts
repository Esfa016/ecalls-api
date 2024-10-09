import { Module } from '@nestjs/common';
import { CustomActionService } from './custom-action.service';
import { CustomActionController } from './custom-action.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomActions, CustomActionsSchema } from './Models/customActionsSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:CustomActions.name,schema:CustomActionsSchema}])],
  controllers: [CustomActionController],
  providers: [CustomActionService],
})
export class CustomActionModule {}
