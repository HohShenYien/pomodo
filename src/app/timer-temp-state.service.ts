import {Injectable} from '@angular/core';
import TimerState from "./models/timerState";

@Injectable({
  providedIn: 'root'
})
export class TimerTempStateService {
  public curTime: number = -1;
  public curRound: number = -1;
  public curState: TimerState = TimerState.focus;

  constructor() { }
}
