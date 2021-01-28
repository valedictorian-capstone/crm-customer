import { Routes, RouterModule } from '@angular/router';
import { ProductDetailPage, ProductMainPage, ProductThankYouPage } from './pages';

const routes: Routes = [
  { path: 'detail/:id', component: ProductDetailPage },
  { path: '', component: ProductMainPage },
  { path: 'thank-you/:customerId/:campaignId', component: ProductThankYouPage },
];

export const ProductRoutes = RouterModule.forChild(routes);
