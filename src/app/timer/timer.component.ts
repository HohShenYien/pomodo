import {Component, OnInit} from '@angular/core';
import TimerState from "../models/timerState";
import timerState from "../models/timerState";
import TimerPlay from "../models/timerPlay";
import {SoundEffectService} from "../sound-effect.service";
import {SettingsService} from "../settings.service";
import {TimerTempStateService} from "../timer-temp-state.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  public size: number = 300;
  public state: TimerState = TimerState.focus;
  private playState: TimerPlay = TimerPlay.stop;
  private curTime: number = 0;
  private seq: number = 1;
  private totalTime: number = 0;
  private totalSession: number = 0;
  private counting: boolean = false;


  constructor(private soundEffect: SoundEffectService, public settings: SettingsService, private store: TimerTempStateService) {
    this.settings.setTimerReset(this.reset.bind(this));
  }

  ngOnInit(): void {
    this.reset();
    this.startFromStore(); // if comes from other pages
  }

  ngOnDestroy(): void {
    if (this.playState !== TimerPlay.stop ) {
      this.store.curTime = this.curTime;
      this.store.curState = this.state;
      this.store.curRound = this.seq;
    }
  }

  public start(): void {
    this.playState = TimerPlay.play;
    if (!this.counting) {
      this.countDown();
      this.counting = true;
    }
  }

  public replay(): void {
    this.state = TimerState.focus;
    this.curTime = this.settings.focusTime * 60;
    this.playState = TimerPlay.play;
    if (!this.counting) {
      this.countDown();
      this.counting = true;
    }
  }

  public getTime(): string {
    let time: string = "";
    time += String(Math.floor(this.curTime / 60)).padStart(2, '0');
    time += ":";
    time += String((this.curTime % 60)).padStart(2, '0');
    return time;
  }

  public getProgress(): number {
    switch (this.state) {
      case TimerState.focus:
        return this.curTime * 100 / (this.settings.focusTime * 60);
      case TimerState.shortRest:
        return this.curTime * 100 / (this.settings.restTime * 60);
      case TimerState.longRest:
        return this.curTime * 100 / (this.settings.longRestTime * 60);
    }
  }

  public getStatus(): string {
    if (this.playState === TimerPlay.pause) {
      return "PAUSE";
    }
    switch (this.state) {
      case TimerState.focus:
        return "FOCUS";
      case TimerState.shortRest:
        return "REST";
      case TimerState.longRest:
        return "LONG REST";
    }
  }

  public pausePlay(): void {
    // can't be clicked when stopped, so only two
    if (this.playState === TimerPlay.play) {
      this.playState = TimerPlay.pause;
    } else {
      this.playState = TimerPlay.play;
      if (!this.counting) {
        this.countDown();
        this.counting = true;
      }
    }
  }

  public stop(): void {
    this.reset();
  }

  public skip(): void {
    this.goNext();
  }

  public isPlay(): boolean {
    return this.playState === TimerPlay.play;
  }

  public isStop(): boolean {
    return this.playState === TimerPlay.stop;
  }

  public isPause(): boolean {
    return this.playState === TimerPlay.pause;
  }

  private countDown() {
    setTimeout(() => {
      if (this.curTime > 0 && this.playState === TimerPlay.play) {
        this.curTime--;
        if (this.state === timerState.focus) {
          this.totalTime++;
        }

        if (this.curTime <= 3 && this.curTime > 0) {
          if (this.state === timerState.focus) {
            this.soundEffect.playRestCountDown();
          } else {
            this.soundEffect.playStartCountDown();
          }
        }
        this.countDown();
      }

      else if (this.curTime === 0) {
        this.counting = false;
        this.goNext();
        this.start();
      } else {
        this.counting = false;
      }
    }, 1000);
  }

  private goNext(): void {
    switch (this.state) {
      case TimerState.focus:
        if (this.seq++ === 4) {
          this.seq = 1;
          this.state = TimerState.longRest;
          this.curTime = this.settings.restTime * 4 * 60;
        } else {
          this.state = TimerState.shortRest;
          this.curTime = this.settings.restTime * 60;
        }
        this.soundEffect.playRest();
        break;
      case TimerState.shortRest:
      case TimerState.longRest:
        this.soundEffect.playStart();
        this.state = TimerState.focus;
        this.curTime = this.settings.focusTime * 60;
        break;
    }
  }

  private reset():void {
    this.soundEffect.setVolume(this.settings.volume == null ? 1 : this.settings.volume / 100);
    if (!this.settings.soundEffect) {
      this.soundEffect.setVolume(0);
    }
    this.curTime = this.settings.focusTime * 60;
    this.seq = 1;
    this.state = TimerState.focus;
    this.playState = TimerPlay.stop;
  }

  private startFromStore(): void {
    if (this.store.curTime !== -1) {
      this.curTime = this.store.curTime;
      this.state = this.store.curState;
      this.seq = this.store.curRound;
      this.store.curTime = -1;
      this.playState = TimerPlay.pause;
    }
  }
}
