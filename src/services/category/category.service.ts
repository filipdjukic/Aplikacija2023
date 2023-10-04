import { Injectable } from "@nestjs/common";
//import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Category } from "src/entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponse } from "src/misc/api.response.class";


@Injectable()
export class CategoryService /*extends TypeOrmCrudService<Category>*/ {
    constructor(@InjectRepository(Category) private readonly category: Repository<Category>) {
        //super(category);
    }

    // Get all categories
    getAll(): Promise<Category[]> {
        return this.category.find();
    }

    // Get category by id
    getById(categoryId: number): Promise<Category> {
        return this.category.findOne({where: {categoryId:categoryId}});
    }

    // Add new category
    add(data: Category): Promise<Category | ApiResponse>{
        return this.category.save(data);
    }

    // Edit category
}