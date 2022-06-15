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

  constructor() {

  }
}
