import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";

@ApiTags("Корзина")
@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({ summary: "Получить продукты из корзины по id пользователя" })
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  findOne(@Param("id") id: number) {
    return this.basketService.getBaketItems(id);
  }
}
