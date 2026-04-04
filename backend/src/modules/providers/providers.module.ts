import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Providers } from './entities/providers.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Providers]) ],
  controllers: [ProvidersController],
  providers: [ProvidersService]
})
export class ProvidersModule {}
