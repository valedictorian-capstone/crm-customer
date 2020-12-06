import { CategoryVM } from '.';

export interface ProductVM {
  id: string;
  code: string;
  name: string;
  type: string;
  image: string;
  category: CategoryVM;
  price: number;
  unit: string;
  description: string;
  parameters: {label: string, value: string}[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
