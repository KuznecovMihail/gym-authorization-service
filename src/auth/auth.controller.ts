import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user-dto";
import { AuthService } from "./auth.service";
import { refreshTokenDto } from "./dto/refresh-token-dto";
import { LogoutDto } from "./dto/logout-dto";
import { TokensDto } from "./dto/tokens-dto";

@ApiTags("Авторизация")
@Controller("auth")
export class AuthController {
  constructor(private authServise: AuthService) {}

  @ApiOperation({ summary: "Вход" })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authServise.login(userDto);
  }

  @ApiOperation({ summary: "Выход" })
  @ApiResponse({ status: 201 })
  @Post("/logout")
  logout(@Headers() header: any) {
    return this.authServise.logout(header);
  }

  @ApiOperation({ summary: "Регистрация" })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post("/regestration")
  regestration(@Body() userDto: CreateUserDto) {
    return this.authServise.regestration(userDto);
  }

  @ApiOperation({ summary: "Обновить accessToken" })
  @ApiResponse({ status: 200, type: TokensDto })
  @Post("/refresh")
  refresh(@Body() refreshToken: refreshTokenDto) {
    return this.authServise.refresh(refreshToken);
  }
}
