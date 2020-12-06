import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from './pages';

const routes: Routes = [
  {
    path: '', component: LayoutPage, children: [
      { path: '', redirectTo: 'home' },
      {
        path: 'home',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.ProductModule),
      },
      {
        path: 'call',
        loadChildren: () => import('@app/modules/core/modules').then((m) => m.CallModule),
      },
      { path: 'error', loadChildren: () => import('src/app/modules/core/modules').then((m) => m.ErrorModule) },
      { path: '**', redirectTo: 'error' }
    ]
  },
];

export const CoreRoutes = RouterModule.forChild(routes);
