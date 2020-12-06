import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  ProductItemComponent,
} from './components';
import {
  ProductMainPage,
  ProductDetailPage
} from './pages';
// import { } from './directives';
// import { } from './pipes';
import { ProductRoutes } from './product.routing';
const COMPONENTS = [
  ProductItemComponent
];

const PAGES = [
  ProductMainPage,
  ProductDetailPage
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    ProductRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class ProductModule { }
