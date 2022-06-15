import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundEffectService {
  private start: HTMLAudioElement = new Audio();
  private startCountDown: HTMLAudioElement = new Audio();
  private rest: HTMLAudioElement = new Audio();
  private restCountDown: HTMLAudioElement = new Audio();

  constructor() {
    this.loadAudios();
  }

  private loadAudios(): void {
    this.start.src = "../assets/audios/focus_start.wav";
    this.start.load();
    this.startCountDown.src = "../assets/audios/start_count.wav";
    this.start.load();
    this.rest.src = "../assets/audios/rest_start.wav";
    this.start.load();
    this.restCountDown.src = "../assets/audios/rest_count.wav";
    this.start.load();
  }

  public playStart():void {
    this.start.play();
  }

  public playStartCountDown():void {
    this.startCountDown.play();
  }
  public playRest():void {
    this.rest.play();
  }
  public playRestCountDown():void {
    this.restCountDown.play();
  }

  public setVolume(volume: number) {
    this.start.volume = volume;
    this.startCountDown.volume = volume;
    this.rest.volume = volume;
    this.restCountDown.volume = volume;
  }
}
