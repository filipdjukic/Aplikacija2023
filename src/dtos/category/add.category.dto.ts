export class AddCategoryDto {
    name: string;
    imagePath: string;
    //parentCategoryId?: number;
    parentCategoryId: number | null;
}