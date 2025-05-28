import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { ViewSubscriptionDto } from "./dto/view-subscription.dto";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesEnum } from "src/enum/Roles";
import { RolesGuard } from "src/auth/roles.guard";
import { SetPriceDto } from "./dto/set-price.dto";

@ApiTags("Абонементы")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: "Создать абонемент" })
  @ApiResponse({ status: 200, type: [CreateSubscriptionDto] })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @ApiOperation({ summary: "Получить все абонементы" })
  @ApiResponse({ status: 200, type: [ViewSubscriptionDto] })
  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @ApiOperation({ summary: "Получить абонемент по id" })
  @ApiResponse({ status: 200, type: ViewSubscriptionDto })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subscriptionService.findOne(+id);
  }

  @ApiOperation({ summary: "Редактировать абонемент" })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    return this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @ApiOperation({ summary: "Удалить абонемент" })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subscriptionService.remove(+id);
  }

  @ApiOperation({ summary: "Установить цену тренера" })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put("/setPrice")
  setPrice(@Body() setPriceDto: SetPriceDto) {
    return this.subscriptionService.setPrice(setPriceDto);
  }
}
