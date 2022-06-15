import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../settings.service";
import Settings from "../models/settings";
import { invoke } from '@tauri-apps/api/tauri'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public data: Settings = {
    focusTime: 25,
    restTime: 5,
    longRestTime: 20,
    rounds: 4,
    volume: 100,
    soundEffect: true,
    notification: true,
  }

  constructor(private settings: SettingsService) { }

  ngOnInit(): void {
    this.data.focusTime = this.settings.focusTime;
    this.data.restTime = this.settings.restTime;
    this.data.rounds = this.settings.rounds;
    this.data.soundEffect = this.settings.soundEffect;
    this.data.notification = this.settings.notification;
    this.data.longRestTime = this.settings.longRestTime;
    this.data.volume = this.settings.volume;
  }

  ngOnDestroy(): void {
    this.save();
  }

  private save(): void {
    this.settings.focusTime = this.data.focusTime;
    this.settings.restTime = this.data.restTime;
    this.settings.rounds = this.data.rounds;
    this.settings.soundEffect = this.data.soundEffect;
    this.settings.notification = this.data.notification;
    this.settings.longRestTime = this.data.longRestTime;
    this.settings.volume = this.data.volume;
    invoke("store_settings", {data: JSON.stringify(this.data)});
  }

}
