import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class ChangeRoleDto {
    @IsEnum(Role, { message: 'El rol debe ser: owner, manager u operator' })
    @IsNotEmpty({ message: 'El rol es obligatorio' })
    role!: Role;
}