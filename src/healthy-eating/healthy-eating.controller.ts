import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from "@nestjs/common";
import { HealthyEatingService } from "./healthy-eating.service";
import { CreateHealthyEatingDto } from "./dto/create-healthy-eating.dto";
import { UpdateHealthyEatingDto } from "./dto/update-healthy-eating.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { HealthyEating } from "./healthy-eating.model";
import { MealPlanResponseDto } from "./dto/meal-plan-response-dto";

@ApiTags("Продукты")
@Controller("healthyEating")
export class HealthyEatingController {
  constructor(private readonly healthyEatingService: HealthyEatingService) {}

  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: "Создать продукта" })
  @ApiResponse({ status: 200, type: HealthyEating })
  @Post()
  create(
    @Body() createHealthyEatingDto: CreateHealthyEatingDto,
    @UploadedFile() image
  ) {
    return this.healthyEatingService.create(createHealthyEatingDto, image);
  }

  @ApiOperation({ summary: "Получение всех продукта" })
  @ApiResponse({ status: 200, type: [HealthyEating] })
  @Get()
  findAll() {
    return this.healthyEatingService.findAll();
  }

  @ApiOperation({ summary: "Получение продукт по id" })
  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.healthyEatingService.findOne(+id);
  }

  @ApiOperation({ summary: "Редактировать продукт" })
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateHealthyEatingDto
  ) {
    return this.healthyEatingService.update(id, updateDto);
  }

  @ApiOperation({ summary: "Удалить продукт" })
  @Delete("/:id")
  remove(@Param("id") id: string) {
    return this.healthyEatingService.remove(+id);
  }

  @ApiOperation({ summary: "Получение продуктов для пользователя" })
  @ApiOkResponse({ type: MealPlanResponseDto, isArray: true })
  @Get("/user/:id")
  getHealthyEatingForUser(@Param("id") id: string) {
    return this.healthyEatingService.getForUser(+id);
  }
}
