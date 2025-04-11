import { PartialType } from '@nestjs/mapped-types';
import { CreateMongoTestDto } from './create-mongo-test.dto';

export class UpdateMongoTestDto extends PartialType(CreateMongoTestDto) {
    title?: string;
    completed?: boolean;
}
