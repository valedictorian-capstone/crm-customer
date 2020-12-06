import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  BreadcrumbComponent,
  ContentComponent,
  NotificationComponent,
  UserComponent,
  ChatComponent
} from './components';
import { CoreRoutes } from './core.routing';
import { LayoutPage } from './pages';
import { FullnameShortPipe } from './pipes';
const COMPONENTS = [
  ContentComponent,
  NotificationComponent,
  BreadcrumbComponent,
  UserComponent,
  ChatComponent
];

const PAGES = [
  LayoutPage,
];

const PIPES = [
  FullnameShortPipe
];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    CoreRoutes,
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class CoreModule { }
