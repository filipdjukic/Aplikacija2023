import {Body, Controller, Get, NotFoundException, Param, Post, Put} from "@nestjs/common";
import { AddCategoryDto } from "src/dtos/category/add.category.dto";
import { Category } from "src/entities/category.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { CategoryService } from "src/services/category/category.service";

@Controller('api/category')
/*@Crud({
    model: {
        type: Category
    },
    params: {
        id: {
            field: 'category_id',
            type: 'number',
            primary: true
        }
    },
})*/
// Crud doesn't work so I will have to do it by hand ->
export class CategoryController {
    constructor(public categoryService: CategoryService) {}

    // GET http://localhost:3000/api/category
    @Get()
    getAll(): Promise<Category[]> {
        return this.categoryService.getAll();
    }

    // GET http://localhost:3000/api/category/4
    @Get(':id')
    async getById(@Param('id') categoryId: number): Promise<Category | ApiResponse> {
        try {
            const category = await this.categoryService.getById(categoryId);
        
            console.log(category);
            if (!category) {
                throw new NotFoundException('Category not found');
            }

            return category;
        } catch (error) {
            console.log(error);
            return new ApiResponse("error", -1003);
        }
    }
    //POST http://localhost:3000/api/category
    /*@Post()
    add(@Body() data: AddCategoryDto): Promise<Category | ApiResponse>{
        return this.categoryService.add(data);
    }

    //PUT http://localhost:3000/api/category/4
    @Put(':id')
    edit(@Param('id') id: number, @Body() data: AddCategoryDto): Promise<Category | ApiResponse>{
        return this.categoryService.editById(id, data);
    }*/
}