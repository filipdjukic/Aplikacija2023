import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { resolve } from 'path';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
    ) { }

    getAll(): Promise<Administrator[]> {
        return this.administrator.find();
    }

    //Old piece of code
    /*getById(id: number): Promise<Administrator> {
        return this.administrator.findOne(id);
    }*/

    //updated piece of code
    getById(administratorId: number): Promise<Administrator> {
        //return this.administrator.findOne({ where: { administratorId } });
        return this.administrator.findOneBy({administratorId:administratorId});
        //the error was that it shouldn't be written id but administratorId instead
    }
    
    add(data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        // DTO => Model
        // username -> username
        // password -[~]-> passwordHash

        const crypto = require('crypto');

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;

        return new Promise((resolve => {
            this.administrator.save(newAdmin)
            .then(data => resolve(data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse("error", -1001);
                resolve(response);
            });
        }))
    }
    
    async editById(id: number, data: EditAdministratorDto): Promise<Administrator | ApiResponse>{

        //let admin: Administrator = await this.administrator.findOne({ where: { id } } as FindOneOptions<Administrator>);
        //let admin: Administrator = await this.administrator.findOneBy({administratorId: id});
        /*let admin: Administrator = await this.administrator.findOne({ where: { administratorId: id }});

        if(admin === undefined){
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002));
            });
        }

        const crypto = require('crypto');

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;

        return this.administrator.save(admin);*/
            try {
                let admin: Administrator = await this.administrator.findOne({ where: { administratorId: id }});
        
                if (admin === undefined) {
                    return new ApiResponse("error", -1002);
                }
        
                const crypto = require('crypto');
        
                const passwordHash = crypto.createHash('sha512');
                passwordHash.update(data.password);
        
                const passwordHashString = passwordHash.digest('hex').toUpperCase();
        
                admin.passwordHash = passwordHashString;
        
                return this.administrator.save(admin);
            } catch (error) {
                // Handle the error and log it
                console.error(error);
                // You can return a meaningful error response here
                return new ApiResponse("error", -1003);
            }
        
    }
}