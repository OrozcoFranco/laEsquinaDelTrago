import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @MaxLength(60)
    name!: string;
}