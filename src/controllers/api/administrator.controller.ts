import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";


@Controller('api/administrator')
export class AdministratorController {
    constructor(
        private administratorService: AdministratorService
      ) { }
    
    // GET http://localhost:3000/api/administrator
    @Get()
    getAll(): Promise<Administrator[]> {
        return this.administratorService.getAll();
    }

    // GET http://localhost:3000/api/administrator/4
    @Get(':id')
    getById(@Param('administrator_id') id: number): Promise<Administrator> {
        return this.administratorService.getById(id);
    }

    // PUT http://localhost:3000/api/administrator/
    @Put()
    add(@Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);
    }

    // POST http://localhost:3000/api/administrator/4
    @Put(':id')
    edit(@Param('id') id: number, @Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.editById(id, data);
    }
}