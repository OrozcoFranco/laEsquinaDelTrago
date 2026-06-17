import {Controller,Patch,Param,Body,Get,UseGuards,Request,ParseIntPipe,} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { ChangeRoleDto } from './dto/role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    // Ver todos los roles disponibles - solo OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    // Cambiar rol de un usuario - solo OWNER
    @Patch('change/:userId')
    @Roles(Role.OWNER)
    changeRole(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() changeRoleDto: ChangeRoleDto,
        @Request() req: any,
    ) {
        return this.rolesService.changeRole(userId, changeRoleDto.role, req.user);
    }
}