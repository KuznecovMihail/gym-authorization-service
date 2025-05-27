import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsPositive,
  ValidateNested,
} from "class-validator";
import { FormatMeal } from "src/formatter/formatter.service";

export class OrderHistory {
  //   @ApiProperty({
  //     type: () => ({
  //       ...FormatMeal,
  //     }),
  //   })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  readonly items: FormatMeal[];

  @ApiProperty({ example: 63 })
  @IsInt()
  @IsPositive()
  readonly id: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  readonly isActive?: boolean;
  @ApiProperty({ example: 1 })
  readonly price?: number;
  @ApiProperty({ example: Date.now() })
  readonly updatedDate?: Date;
}
