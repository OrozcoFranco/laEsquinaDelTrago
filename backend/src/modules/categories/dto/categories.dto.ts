import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CategoriesDto{
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @MaxLength(20)
    name: string;
}