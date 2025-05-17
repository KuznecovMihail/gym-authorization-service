import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user-dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { User } from "src/users/user.model";
import { refreshTokenDto } from "./dto/refresh-token-dto";
import { LogoutDto } from "./dto/logout-dto";
import { BasketService } from "src/basket/basket.service";
import { NotFoundError } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private basketService: BasketService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateTokens(user);
  }
  async logout(headers: any) {
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");
    const { id } = this.jwtService.decode(token);
    if (!id) {
      throw new NotFoundError("Пользователь с таким id не существует");
    }
    await this.usersService.saveRefreshToken(id, null);
  }

  async refresh(token: refreshTokenDto) {
    const { refreshToken } = token || {};
    if (!refreshToken) {
      throw new UnauthorizedException("Токен отсутствует");
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const { exp, iat, ...newPayload } = payload;

      const userRefreshToken = await this.usersService.getRefreshTokenByUserId(
        payload.id
      );
      if (!userRefreshToken) {
        throw new UnauthorizedException("Токен не найден");
      }

      const isTokenValid = await bcrypt.compare(refreshToken, userRefreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException("Токен недействителен");
      }

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: "15m",
      });
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("error", error);
      throw new UnauthorizedException("Ошибка валидации токена");
    }
  }

  async regestration(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUsersByEmail(userDto.email);
    console.log("Получен пользователь по email");
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    console.log("Пароль захэширован");
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    console.log("Пользователь создан");
    this.basketService.createBasket(user.id);
    console.log("Корзина создана");
    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const roles = user.dataValues.roles;
    const roleValues = roles.map((role) => role.value);
    const payload = {
      email: user.dataValues.email,
      id: user.dataValues.id,
      roles: roleValues,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "24h" });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 5);
    await this.usersService.saveRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUsersByEmail(userDto.email);
    if (user !== null) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.dataValues.password
      );
      if (passwordEquals) return user;
    }

    throw new UnauthorizedException({
      message: "Некорректный email или пароль",
    });
  }
}
