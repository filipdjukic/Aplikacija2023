import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from "multer";
import { StorageConfig } from "config/storage.config";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";

@Controller('api/article')
export class ArticleController {
    constructor(
        public articleService: ArticleService,
        public photoService: PhotoService
    ) { }

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

    @Post(':id/uploadPhoto/') //Post http://localhost:3000/api/article/:id/uploadPhoto/
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
                filename: (req, file, callback) => {
                    // 'Neka slika.jpg' ->
                    // '20231008-978530076-Neka-slika.jpg'

                    let original: string = file.originalname;
                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                    let sada = new Date();
                    let datePart = '';
                    datePart += sada.getFullYear().toString();
                    datePart += (sada.getMonth() + 1).toString();
                    datePart += sada.getDate().toString();

                    let randomPart: string =
                        new Array(10)
                            .fill(0)
                            .map(e => (Math.random() * 9).toFixed(0).toString())
                            .join('')
                    let fileName = datePart + '-' + randomPart + '-' + normalized;

                    fileName = fileName.toLocaleLowerCase();

                    callback(null, fileName);
                }
            }),
            // fileFilter: (req, file, callback) => {
            //     // 1. Check ekstenzije: JPG, PNG
            //     if(!file.originalname.match(/\.(jpg|png)$/)){
            //         callback(new Error('Bad file extension!'), false);
            //         return;
            //     }

            //     // 2. Check tipa sadrzaja: image/jpeg, image/png (MIME tip)
            //     if(!file.mimetype.includes('jpeg') || !file.mimetype.includes('png')){
            //         callback(new Error('Bad file content!'), false);
            //         return;
            //     }

            //     // 3. Allow file upload
            //     callback(null, true); //null means no error
            // }
            fileFilter: (req, file, callback) => {
                // 1. Check ekstenzije: JPG, PNG
                const allowedExtensions = /\.(jpg|jpeg|png)$/i; // Updated regex to match both upper and lower case extensions
                if (!allowedExtensions.test(file.originalname)) {
                  req.fileFilterError = 'Bad file extension!';
                  callback(null, false);
                  return;
                }
              
                // 2. Check tipa sadrzaja: image/jpeg, image/png (MIME tip)
                const allowedMimeTypes = ['image/jpeg', 'image/png'];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                  req.fileFilterError = 'Bad file content!';
                  callback(null, false);
                  return;
                }
              
                // 3. Allow file upload
                callback(null, true); // null means no error
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.photoMaxFileSize
            }
        })
    )
    async uploadPhoto(
        @Param('id') articleId: number, 
        @UploadedFile() photo,
        @Req() req
    ): Promise<Photo | ApiResponse>{

        if(req.fileFilterError){
            return new ApiResponse('error', -4002, req.fileFilterError);
        }

        if(!photo){
            return new ApiResponse('error', -4002, 'File not uploaded!');
        }

        //TODO: Real Mime Type check

        //TODO: Save a resized file

        //let imagePath = photo.filename; // u zapis u bazu podataka
        const newPhoto: Photo = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001, 'Photo not uploaded!');
        }

        return savedPhoto;
    }
}