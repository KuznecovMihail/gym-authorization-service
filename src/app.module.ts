import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/user.model";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/roles.model";

import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { HealthyEatingModule } from "./healthy-eating/healthy-eating.module";
import { UserRoleModule } from "./user-role/user-role.module";
import * as path from "path";
import { UserRoles } from "./user-role/user-role-model";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static"),
    }),
    HealthyEatingModule,
    UserRoleModule,
  ],
})
export class AppModule {}
