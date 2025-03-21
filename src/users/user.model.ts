import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Post } from "src/posts/post.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-role-model";

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

  @ApiProperty({ example: "user@mail.ru", description: "email" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "qwerty", description: "password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOIiwiaWQiOjE4LCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwidXBkYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwiVXNlclJvbGVzIjp7ImlkIjoxNCwicm9sZUlkIjoxLCJ1c2VySWQiOjE4fX1dLCJpYXQiOjE3NDIzMTQ0MzYsImV4cCI6MTc0MjQwMDgzNn0.MAPmpmWmBF4a-Pd5QTca1YcpaRI-nX8mcdzcqI5S2V4",
    description: "refreshToken",
  })
  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string | null;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Post)
  posts: Post[];
}
