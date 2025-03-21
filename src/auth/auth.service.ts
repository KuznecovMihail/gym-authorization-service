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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateTokens(user);
  }
  async logout(dto: LogoutDto) {
    await this.usersService.saveRefreshToken(dto.userId, null);
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
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email существует",
        HttpStatus.BAD_REQUEST
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };

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
