import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Ver perfil propio - todos los roles
    @Get('profile')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    getProfile(@Request() req: any) {
        return this.usersService.getProfile(req.user);
    }

    // Crear usuario - OWNER y MANAGER
    @Post()
    @Roles(Role.OWNER, Role.MANAGER)
    create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
        return this.usersService.create(createUserDto, req.user);
    }

    // Ver todos los usuarios - OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    findAll(@Request() req: any) {
        return this.usersService.findAll(req.user);
    }

    // Ver un usuario - OWNER y MANAGER
    @Get(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.usersService.findOne(id, req.user);
    }

    // Editar usuario - OWNER y MANAGER (cualquier usuario puede editarse a sí mismo)
    @Patch(':id')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: any,
    ) {
        return this.usersService.update(id, updateUserDto, req.user);
    }

    // Activar/desactivar - OWNER y MANAGER
    @Patch(':id/toggle-active')
    @Roles(Role.OWNER, Role.MANAGER)
    toggleActive(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.usersService.toggleActive(id, req.user);
    }

    // Transferir OWNER - solo OWNER
    @Patch(':id/transfer-ownership')
    @Roles(Role.OWNER)
    transferOwnership(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        return this.usersService.transferOwnership(id, req.user);
    }

    // Eliminar usuario - solo OWNER
    @Delete(':id')
    @Roles(Role.OWNER)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.usersService.remove(id, req.user);
    }
}