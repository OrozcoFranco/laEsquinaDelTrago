import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/purchases.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@Controller('purchases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) {}

    // Registrar compra - OWNER y MANAGER
    @Post()
    @Roles(Role.OWNER, Role.MANAGER)
    create(@Body() createPurchaseDto: CreatePurchaseDto, @Request() req: any) {
        return this.purchasesService.create(createPurchaseDto, req.user);
    }

    // Ver todas las compras - OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    findAll() {
        return this.purchasesService.findAll();
    }

    // Ver una compra - OWNER y MANAGER
    @Get(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.purchasesService.findOne(id);
    }

    // Ver compras por proveedor - OWNER y MANAGER
    @Get('provider/:providerId')
    @Roles(Role.OWNER, Role.MANAGER)
    findByProvider(@Param('providerId', ParseIntPipe) providerId: number) {
        return this.purchasesService.findByProvider(providerId);
    }

    // Cancelar compra - solo OWNER
    @Patch(':id/cancel')
    @Roles(Role.OWNER)
    cancel(@Param('id', ParseIntPipe) id: number) {
        return this.purchasesService.cancel(id);
    } }