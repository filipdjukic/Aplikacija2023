import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feature } from "src/entities/feature.entity";

@Injectable()
export class FeatureService {
    constructor(@InjectRepository(Feature) private readonly featureRepository: Repository<Feature>) {}

    async getAllFeatures(): Promise<Feature[]> {
        return await this.featureRepository.find();
    }

    async getFeatureById(featureId: number): Promise<Feature> {
        const feature = await this.featureRepository.findOne({ where: { featureId: featureId } });
        if (!feature) {
            throw new NotFoundException('Feature not found');
        }
        return feature;
    }

    async createFeature(featureData: Feature): Promise<Feature> {
        const newFeature = this.featureRepository.create(featureData);
        return await this.featureRepository.save(newFeature);
    }

    // async updateFeature(id: number, featureData: Feature): Promise<Feature> {
    //     await this.getFeatureById(id); // Check if the feature exists
    //     const updatedFeature = { ...featureData, feature_id: id };
    //     return await this.featureRepository.save(updatedFeature);
    // }
    async updateFeature(featureId: number, featureData: Partial<Feature>): Promise<Feature> {
        const feature = await this.getFeatureById(featureId);
        if (feature) {
            Object.assign(feature, featureData);
            return await this.featureRepository.save(feature);
        } else {
            throw new NotFoundException('Feature not found');
        }
    }
    

    async deleteFeature(id: number): Promise<number> {
        const result = await this.featureRepository.delete(id);
        return result.affected;
    }
}
