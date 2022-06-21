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

  constructor() { }

  public storeData(totalTime: number, totalSession: number): void {
    if (totalSession > 0) {
      invoke("append_data", {data: JSON.stringify({
          num_session: totalSession,
          duration: Math.round(totalTime / 60),
          date: new Date().toISOString().split('T')[0]
        })});
    }
  }
}
