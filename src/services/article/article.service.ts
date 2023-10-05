import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddArticleDto } from 'src/dtos/article/add.article.dto';
import { ArticleFeature } from 'src/entities/article-feature.entity';
import { ArticlePrice } from 'src/entities/article-price.entity';
import { Article } from 'src/entities/article.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {

    getAll(): Promise<Article[]>{
        return this.article.find();
    }

    getById(articleId: number): Promise<Article>{
        return this.article.findOne({
            where: { articleId },
            relations: [
                "category",
                "articleFeatures",
                "features",
                "articlePrices"
            ]
        });
    }

    async getArticlePrice(articleId: number): Promise<ApiResponse | ArticlePrice>{
        let articlePrice = await this.articlePrice.findOne({
            where: { articleId: articleId }
        });

        if(!articlePrice){
            return new ApiResponse("error", -1002, "Cannot find article price for given article id.");
        }

        return articlePrice;
    }

    constructor(
        @InjectRepository(Article) 
        private readonly article: Repository<Article>,
        
        @InjectRepository(ArticlePrice) 
        private readonly articlePrice: Repository<ArticlePrice>,

        @InjectRepository(ArticleFeature) 
        private readonly articleFeature: Repository<ArticleFeature>
    ){}

    async createFullArticle(data: AddArticleDto): Promise<Article | ApiResponse>{
        let newArticle: Article = new Article();
        newArticle.name        = data.name;
        newArticle.categoryId  = data.categoryId;
        newArticle.excerpt     = data.excerpt;
        newArticle.description = data.description;
        
        let savedArticle = await this.article.save(newArticle);

        let newArticlePrice: ArticlePrice = new ArticlePrice();
        newArticlePrice.articleId = savedArticle.articleId;
        newArticlePrice.price     = data.price;

        await this.articlePrice.save(newArticlePrice);

        for(let feature of data.features){
            let newArticleFeature: ArticleFeature = new ArticleFeature();
            newArticleFeature.articleId = savedArticle.articleId;
            newArticleFeature.featureId = feature.featureId;
            newArticleFeature.value     = feature.value;

            await this.articleFeature.save(newArticleFeature);
        }
        
        return await this.article.findOne({
            where: { articleId: savedArticle.articleId },
            relations: [
                "category",
                "articleFeatures",
                "features",
                "articlePrices"
            ]
        });
    }
}
