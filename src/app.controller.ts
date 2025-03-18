import { Controller, Get } from "@nestjs/common";
import { AppServise } from "./app.service";

@Controller("/api")
export class AppController {
  constructor(private appServise: AppServise) {}
  @Get("/users")
  getUsers() {
    return this.appServise.getUsers();
  }
}
