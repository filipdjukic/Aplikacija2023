import { Controller, Get, Param, Post, Put, Delete, NotFoundException, Body } from '@nestjs/common';
import { Feature } from 'src/entities/feature.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import { FeatureService } from 'src/services/feature/feature.service';

@Controller('api/feature')
export class FeatureController {
    constructor(private readonly featureService: FeatureService) { }

    // GET http://localhost:3000/api/feature
    @Get()
    async getAll(): Promise<Feature[]> {
        return this.featureService.getAllFeatures();
    }

    // GET http://localhost:3000/api/feature/:id
    @Get(':id')
    async getById(@Param('id') featureId: number): Promise<Feature | ApiResponse> {
        const feature = await this.featureService.getFeatureById(featureId);
        if (!feature) {
            throw new ApiResponse('error', -1002, 'Feature not found');
        }
        return feature;
    }

    // POST http://localhost:3000/api/feature
    @Post()
    async create(@Body() featureData: Feature): Promise<Feature> {
        return this.featureService.createFeature(featureData);
    }

    // PUT http://localhost:3000/api/feature/:id
    // @Put(':id')
    // async update(@Param('id') featureId: number, @Body() featureData: Feature): Promise<Feature | ApiResponse> {
    //     const feature = await this.featureService.updateFeature(featureId, featureData);
    //     if (!feature) {
    //         throw new ApiResponse('error', -1002, 'Feature not found');
    //     }
    //     return feature;
    // }
    @Put(':id')
    async update(@Param('id') featureId: number, @Body() featureData: Partial<Feature>): Promise<Feature | ApiResponse> {
        const feature = await this.featureService.updateFeature(featureId, featureData);
        if (!feature) {
            throw new ApiResponse('error', -1002, 'Feature not found');
        }
        return feature;
    }


    // DELETE http://localhost:3000/api/feature/:id
    @Delete(':id')
    async delete(@Param('id') featureId: number): Promise<void> {
        const result = await this.featureService.deleteFeature(featureId);
        if (result === 0) {
            throw new NotFoundException('Feature not found');
        }
    }
}
