import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MongoTestService } from './mongo-test.service';
import { PartialType } from '@nestjs/mapped-types';
import { UpdateMongoTestDto } from './dto/update-mongo-test.dto'

@Controller('mongo-test')
export class MongoTestController {
  constructor(private readonly todosService: MongoTestService) {}

  @Post()
  create(@Body('title') title: string) {
    return this.todosService.create(title);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: UpdateMongoTestDto) {
    return this.todosService.update(id, update);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
