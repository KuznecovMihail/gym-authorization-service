import { JwtService } from "@nestjs/jwt";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req?.headers?.authorization;
      const bearer = authHeader?.split(" ")[0];
      const token = authHeader?.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        console.error("bearer", bearer !== "Bearer");
        console.error("!token", !token);
        throw new UnauthorizedException("Пользователь не авторизован");
      }

      const user = this.jwtService.verify(token);

      req.user = user;
      return true;
    } catch (e) {
      console.error("e", e);
      throw new UnauthorizedException("Пользователь не авторизован");
    }
  }
}
