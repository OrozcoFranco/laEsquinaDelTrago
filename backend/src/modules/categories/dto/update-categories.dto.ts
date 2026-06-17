import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(60)
    name?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}