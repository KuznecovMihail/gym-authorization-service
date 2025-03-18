import { Injectable } from "@nestjs/common";

@Injectable()
export class AppServise {
  getUsers() {
    return [{ id: 1 }];
  }
}
