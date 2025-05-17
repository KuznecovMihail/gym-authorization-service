import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  UseGuards,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";

@ApiTags("Корзина")
@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({ summary: "Получить продукты из корзины по id пользователя" })
  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Headers() headers: any) {
    return this.basketService.getBaketItems(headers);
  }

  @ApiOperation({ summary: "Удалить продукт из корзины" })
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  delete(@Param("id") id: number, @Headers() headers: any) {
    return this.basketService.deleteItem(id, headers);
  }
}
