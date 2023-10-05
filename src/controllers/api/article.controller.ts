import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";

@Controller('api/article')
export class ArticleController {
    constructor(private articleService: ArticleService) { }

    //create get method and get by id method
    @Get() // GET http://localhost:3000/api/article/
    getAll() {
        return this.articleService.getAll();
    }

    @Get(':id') // GET http://localhost:3000/api/article/3/
    getById(@Param('id') articleId: number) {
        return this.articleService.getById(articleId);
    }

    getArticlePrice(@Param('id') articleId: number) {
        return this.articleService.getArticlePrice(articleId);
    }

    @Post('createFull') // POST http://localhost:3000/api/article/createFull/
    createFullArticle(@Body() data: AddArticleDto) {
        return this.articleService.createFullArticle(data);
    }
}