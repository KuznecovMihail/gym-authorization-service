import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Max, Min } from "class-validator";
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { BasketUser } from "src/basket/basket-user.model";
import { Basket } from "src/basket/basket.model";
import { Sex } from "src/enum/Sex";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/user-role/user-role-model";

interface UserCreationAttribute {
  email: string;
  password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttribute> {
  @ApiProperty({ example: 1, description: "ID" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: "Иван" })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  declare firstName: string;

  @ApiProperty({ example: "Иванович" })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  declare middleName: string;

  @ApiProperty({ example: "Иванов" })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  declare lastName: string;

  @ApiProperty({ example: "user@mail.ru" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @ApiProperty({ example: "qwerty", description: "password" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOIiwiaWQiOjE4LCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwidXBkYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwiVXNlclJvbGVzIjp7ImlkIjoxNCwicm9sZUlkIjoxLCJ1c2VySWQiOjE4fX1dLCJpYXQiOjE3NDIzMTQ0MzYsImV4cCI6MTc0MjQwMDgzNn0.MAPmpmWmBF4a-Pd5QTca1YcpaRI-nX8mcdzcqI5S2V4",
    description: "refreshToken",
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare refreshToken: string | null;

  @ApiProperty({
    example: "FEMALE",
    description: "Пол пользователя",
    enum: Sex,
  })
  @Column({
    type: DataType.ENUM(...Object.values(Sex)),
    allowNull: true,
  })
  @IsEnum(Sex)
  declare sex: Sex;

  @ApiProperty({
    example: 165,
    description: "Рост в см",
    minimum: 50,
    maximum: 250,
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare height: number;

  @ApiProperty({
    example: 75,
    description: "Вес в кг",
    minimum: 20,
    maximum: 300,
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare weight: number;

  @ApiProperty({
    example: 18,
    description: "Возраст",
    minimum: 12,
    maximum: 120,
  })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare age: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare avatar: string;

  @BelongsToMany(() => Role, () => UserRoles)
  declare roles: Role[];

  @BelongsToMany(() => Basket, () => BasketUser)
  declare basket: Basket[];
}
