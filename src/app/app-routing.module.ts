import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TimerComponent} from "./timer/timer.component"
import {StatsComponent} from "./stats/stats.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  { path: '', component: TimerComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
