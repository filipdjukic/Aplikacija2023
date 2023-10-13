import { Body, Controller, Get, NotFoundException, Param, Post, Put, SetMetadata, UseGuards } from "@nestjs/common";
import { Administrator } from "src/entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";


@Controller('api/administrator')
export class AdministratorController {
    constructor(
        private administratorService: AdministratorService
      ) { }
    
    // GET http://localhost:3000/api/administrator
    @Get()
    // @SetMetadata('allow_to_role', ['administrator', 'user'])
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    getAll(): Promise<Administrator[]> {
        return this.administratorService.getAll();
    }

    // GET http://localhost:3000/api/administrator/4
    @Get(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    async getById(@Param('id') administratorId: number): Promise<Administrator | ApiResponse > {
        try {
            const admin = await this.administratorService.getById(administratorId);

            if (!admin) {
                throw new NotFoundException('Administrator not found'); // Use an appropriate exception class
            }

            return admin;
        }catch (error) {
        // Handle errors and transform them into an ApiResponse or use appropriate error handling mechanism
            return new ApiResponse("error", -1002);
        }
    }

    // POST http://localhost:3000/api/administrator/
    @Post()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.add(data);
    }

    // PUT http://localhost:3000/api/administrator/4
    @Put(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.editById(id, data);
    }
}