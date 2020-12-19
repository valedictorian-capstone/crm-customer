import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutPage, children: [
      { path: '', redirectTo: 'product' },
      {
        path: 'product',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.ProductModule),
      },
      {
        path: 'event',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.EventModule),
      },
      {
        path: 'call',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.CallModule),
      },
      {
        path: 'error', loadChildren: () => import
          ('src/app/modules/core/modules').then((m) => m.ErrorModule)
      },
      { path: '**', redirectTo: 'error' }
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
