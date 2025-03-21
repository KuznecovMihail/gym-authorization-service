import { ApiProperty } from "@nestjs/swagger";

export class TokensDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOIiwiaWQiOjE4LCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwidXBkYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwiVXNlclJvbGVzIjp7ImlkIjoxNCwicm9sZUlkIjoxLCJ1c2VySWQiOjE4fX1dLCJpYXQiOjE3NDIzMTQ0MzYsImV4cCI6MTc0MjQwMDgzNn0.MAPmpmWmBF4a-Pd5QTca1YcpaRI-nX8mcdzcqI5S2V4",
    description: "accessToken",
  })
  accessToken: string;

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFETUlOIiwiaWQiOjE4LCJyb2xlcyI6W3siaWQiOjEsInZhbHVlIjoiQURNSU4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwidXBkYXRlZEF0IjoiMjAyNS0wMy0xOFQxNDozMzo0NC45NzBaIiwiVXNlclJvbGVzIjp7ImlkIjoxNCwicm9sZUlkIjoxLCJ1c2VySWQiOjE4fX1dLCJpYXQiOjE3NDIzMTQ0MzYsImV4cCI6MTc0MjQwMDgzNn0.MAPmpmWmBF4a-Pd5QTca1YcpaRI-nX8mcdzcqI5S2V4",
    description: "refreshToken",
  })
  refreshToken: string;
}
