import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  EventItemComponent,
} from './components';
import {
  EventMainPage,
} from './pages';
// import { } from './directives';
// import { } from './pipes';
import { EventRoutes } from './event.routing';
const COMPONENTS = [
  EventItemComponent
];

const PAGES = [
  EventMainPage,
];

const PIPES = [

];

const DIRECTIVES = [

];
@NgModule({
  imports: [
    ExtrasModule.forChild(),
    EventRoutes
  ],
  declarations: [...PAGES, ...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class EventModule { }
