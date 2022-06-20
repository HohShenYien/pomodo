import {Injectable} from '@angular/core';
import TimerState from "./models/timerState";
import { invoke } from '@tauri-apps/api/tauri'

@Injectable({
  providedIn: 'root'
})
export class TimerTempStateService {
  public curTime: number = -1;
  public curRound: number = -1;
  public curState: TimerState = TimerState.focus;
  public totalTime: number = 0;
  public totalSession: number = 0;

  constructor() { }

  public resetState(): void {
    this.totalTime = 0;
    this.totalSession = 0;
  }

  public storeData(): void {
    invoke("append_data", {data: JSON.stringify({
        num_session: this.totalSession,
        duration: Math.round(this.totalTime / 60),
        date: new Date().toISOString().split('T')[0]
      })});
  }
}
