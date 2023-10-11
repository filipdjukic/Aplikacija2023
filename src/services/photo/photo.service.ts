import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Photo } from "src/entities/photo.entity";
import { Repository } from "typeorm";

@Injectable()
export class PhotoService extends TypeOrmCrudService<Photo>{
    constructor(@InjectRepository(Photo) private readonly photo: Repository<Photo>){
        super(photo);
    }

    add(newPhoto: Photo): Promise<Photo>{
        return this.photo.save(newPhoto); 
    }

    async deleteById(id: number){
        return await this.photo.delete(id);
    }
}


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Photo } from 'src/entities/photo.entity';
// import { ApiResponse } from 'src/misc/api.response.class';

// @Injectable()
// export class PhotoService {
//   constructor(
//     @InjectRepository(Photo)
//     private readonly photoRepository: Repository<Photo>,
//   ) {}

//   async getAllPhotos(): Promise<Photo[]> {
//     return this.photoRepository.find();
//   }

//   async getPhotoById(photoId: number): Promise<Photo | ApiResponse> {
//     const photo = await this.photoRepository.findOne({
//       where: { photoId: photoId },
//     });
//     if (!photo) {
//       return new ApiResponse(
//         'error',
//         -1002,
//         'Cannot find a photo with the given ID.',
//       );
//     }
//     return photo;
//   }

//   async add(newPhoto: Photo): Promise<Photo | ApiResponse> {
//     try {
//       const savedPhoto = await this.photoRepository.save(newPhoto);
//       return savedPhoto;
//     } catch (error) {
//       return new ApiResponse(
//         'error',
//         -1003,
//         'Failed to create a new photo.',
//       );
//     }
//   }

//   async updatePhoto(
//     photoId: number,
//     updatedPhoto: Photo,
//   ): Promise<Photo | ApiResponse> {
//     try {
//       await this.photoRepository.update(photoId, updatedPhoto);
//       //const photo = await this.photoRepository.findOne(photoId);
//       const photo = await this.photoRepository.findOne({
//         where: { photoId: photoId },
//       });
//       if (!photo) {
//         return new ApiResponse(
//           'error',
//           -1002,
//           'Cannot find a photo with the given ID.',
//         );
//       }
//       return photo;
//     } catch (error) {
//       return new ApiResponse(
//         'error',
//         -1004,
//         'Failed to update the photo.',
//       );
//     }
//   }

// }