import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public focusTime:number = 25;
  public restTime:number = 5;
  public longRestTime: number = 20;
  public rounds: number = 4;
  public volume: number|null = 100;
  public soundEffect: boolean = true;
  public notification: boolean = true;
  private timerReset: null | (() => void) = null;

  constructor() {
    invoke("get_settings").then(res => {
      if (typeof res === "string" && res !== "") {
        const settingString = JSON.parse(res);
        this.focusTime = settingString.focusTime;
        this.restTime = settingString.restTime;
        this.longRestTime = settingString.longRestTime;
        this.rounds = settingString.rounds;
        this.volume = settingString.volume;
        this.soundEffect = settingString.soundEffect;
        this.notification = settingString.notification;

        if (this.timerReset !== null) {
          this.timerReset();
        }
      }
    });
  }

  public setTimerReset(fn: () => void) {
    this.timerReset = fn;
  }
}
