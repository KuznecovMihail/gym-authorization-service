import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { User } from "src/users/user.model";

interface UserRoleCreationAttribute {
  roleId: number;
  userId: number;
}

@Table({ tableName: "userRoles", createdAt: false, updatedAt: false })
export class UserRoles extends Model<UserRoles, UserRoleCreationAttribute> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  declare roleId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare userId: number;
}
