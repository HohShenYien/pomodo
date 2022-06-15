import { Component } from '@angular/core';
import {SettingsService} from "./settings.service";
import {invoke} from "@tauri-apps/api/tauri";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pomodo';
  constructor(private settings: SettingsService) {

  }
  async ngOnInit() {
    await invoke("get_settings").then(res => {
      if (typeof res === "string" && res !== "") {
        const settingString = JSON.parse(res);
        this.settings.focusTime = settingString.focusTime;
        this.settings.restTime = settingString.restTime;
        this.settings.longRestTime = settingString.longRestTime;
        this.settings.rounds = settingString.rounds;
        this.settings.volume = settingString.volume;
        this.settings.soundEffect = settingString.soundEffect;
        this.settings.notification = settingString.notification;
      }
    });
  }
}
