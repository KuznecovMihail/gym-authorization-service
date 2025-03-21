import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Post } from "./post.model";
import { FilesModule } from "src/files/files.module";

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [SequelizeModule.forFeature([User, Post]), FilesModule],
})
export class PostsModule {}
