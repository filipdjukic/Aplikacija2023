import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
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
    getById(id: number): Promise<Administrator> {
        return this.administrator.findOne({ where: { id } } as FindOneOptions<Administrator>);
    }
    
    //add
    //editById
    //deleteById
    
}