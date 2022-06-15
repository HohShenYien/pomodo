import { Component } from '@angular/core';
import { appWindow } from '@tauri-apps/api/window';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pomodo';
  public close() {
    appWindow.close();
  }
  public minimize() {
    appWindow.minimize();
  }
  public maximize() {
    appWindow.maximize();
  }
  public unMaximize() {
    return appWindow.unmaximize()
  }
}
