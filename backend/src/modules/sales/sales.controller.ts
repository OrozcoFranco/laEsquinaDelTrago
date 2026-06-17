import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sales.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    // Registrar venta - todos los roles
    @Post()
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    create(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
        return this.salesService.create(createSaleDto, req.user);
    }

    // Ver todas las ventas - OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    findAll() {
        return this.salesService.findAll();
    }

    // Reporte diario - OWNER y MANAGER
    @Get('report/daily')
    @Roles(Role.OWNER, Role.MANAGER)
    getDailyReport(@Query('date') date?: string) {
        return this.salesService.getDailyReport(date);
    }

    // Reporte mensual - OWNER y MANAGER
    @Get('report/monthly')
    @Roles(Role.OWNER, Role.MANAGER)
    getMonthlyReport(
        @Query('year') year: string,
        @Query('month') month: string,
    ) {
        return this.salesService.getMonthlyReport(+year, +month);
    }

    // Ver ventas por cliente - OWNER y MANAGER
    @Get('client/:clientId')
    @Roles(Role.OWNER, Role.MANAGER)
    findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
        return this.salesService.findByClient(clientId);
    }

    // Ver una venta - OWNER y MANAGER
    @Get(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salesService.findOne(id);
    }

    // Cancelar venta - solo OWNER
    @Patch(':id/cancel')
    @Roles(Role.OWNER)
    cancel(@Param('id', ParseIntPipe) id: number) {
        return this.salesService.cancel(id);
    } 
}