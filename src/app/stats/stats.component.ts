import { Component, OnInit } from '@angular/core';

enum StatMode {
  CHART,
  CALENDAR
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  public mode: StatMode = StatMode.CHART;
  public StatMode = StatMode;

  constructor() { }

  ngOnInit(): void {
  }

}
