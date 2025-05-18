import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
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

  @ApiOperation({ summary: "+ 1 количество продукта в корзину" })
  @UseGuards(JwtAuthGuard)
  @Patch("/inc/:id")
  incrementItem(@Param("id") id: number, @Headers() headers: any) {
    return this.basketService.changeQuantityItem(id, headers, "inc");
  }

  @ApiOperation({ summary: "- 1 количество продукта в корзину" })
  @UseGuards(JwtAuthGuard)
  @Patch("/dec/:id")
  decrementItem(@Param("id") id: number, @Headers() headers: any) {
    return this.basketService.changeQuantityItem(id, headers, "dec");
  }

  @ApiOperation({ summary: "Получить количество предметов в корзине" })
  @UseGuards(JwtAuthGuard)
  @Get("/quantity")
  getAllQuantity(@Headers() headers: any) {
    return this.basketService.getAllQuantity(headers);
  }

  @ApiOperation({
    summary:
      "Оформление зауказа - создание новой корзины, старая становится неактивной",
  })
  @UseGuards(JwtAuthGuard)
  @Post("/order/:id")
  createOrder(@Param("id") id: number) {
    return this.basketService.createBasket(id);
  }

  @ApiOperation({
    summary:
      "Оформление зауказа - создание новой корзины, старая становится неактивной",
  })
  @UseGuards(JwtAuthGuard)
  @Get("/orderHistory")
  orderHistory(@Headers() headers: any) {
    return this.basketService.orderHistory(headers);
  }
}
