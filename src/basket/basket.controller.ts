import { OrderHistory } from "./dto/OrderHistory";
import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesEnum } from "src/enum/Roles";

export interface QueryForAllData {
  userId?: number;
  basketId?: number;
  price?: number;
  isActive?: boolean;
  updatedDate?: string;
}

export interface QueryForFilters {
  price?: number;
  isActive?: boolean;
  updatedAt?: Record<string, Date>;
}

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
    summary: "История заказов",
  })
  @UseGuards(JwtAuthGuard)
  @Get("/orderHistory")
  @ApiQuery({ name: "userId", type: Number, required: false })
  @ApiQuery({ name: "summ", type: Number, required: false })
  @ApiQuery({ name: "isActive", type: Boolean, required: false })
  @ApiQuery({ name: "updatedDate", type: String, required: false })
  @ApiQuery({ name: "basketId", type: Number, required: false })
  @ApiResponse({ status: 200, type: [OrderHistory] })
  orderHistory(@Headers() headers: any, @Query() query: QueryForAllData) {
    return this.basketService.orderHistory(headers, query);
  }

  @ApiOperation({
    summary: "Список всех заказо",
  })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "userId", type: Number, required: false })
  @ApiQuery({ name: "summ", type: Number, required: false })
  @ApiQuery({ name: "isActive", type: Boolean, required: false })
  @ApiQuery({ name: "updatedDate", type: String, required: false })
  @ApiQuery({ name: "basketId", type: Number, required: false })
  @ApiResponse({ status: 200, type: [OrderHistory] })
  @Get("/allOrders")
  orderForAdmin(@Query() query: QueryForAllData) {
    return this.basketService.getAllOrders(query);
  }
}
