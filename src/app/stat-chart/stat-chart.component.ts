import {Component, OnInit} from '@angular/core';
import {invoke} from "@tauri-apps/api";
// @ts-ignore
import Plotly from 'plotly.js-dist-min'
import {differenceInCalendarDays, format, startOfMonth, subDays, subMonths, subYears} from "date-fns";
import { appWindow } from '@tauri-apps/api/window'

interface ChartVal {
  x: String[],
  y: number[],
  fill: String,
  type: String,
  hovertemplate: String,
  name: String
}

enum ChartMode {
  WEEK,
  MONTH,
  YEAR,
  ALL
}

enum ValueType {
  DURATION,
  NUM_SESSION
}

@Component({
  selector: 'app-stat-chart',
  templateUrl: './stat-chart.component.html',
  styleUrls: ['./stat-chart.component.scss']
})
export class StatChartComponent implements OnInit {
  private today: Date = new Date();
  public valueType: ValueType = ValueType.DURATION;
  public ChartMode = ChartMode;
  public ValueType = ValueType;
  public valueStr: String = "option1";
  public modeStr: String = "option1";
  public chartMode: ChartMode = ChartMode.WEEK;

  constructor() {
  }

  ngOnInit(): void {
    this.createGraph();
    appWindow.listen('tauri://resize', () => {
      this.createGraph();
    })
  }

  public createGraph() {

    let total_time: ChartVal = {
      x: [],
      y: [],
      fill: 'tozeroy',
      type: 'scatter',
      hovertemplate: 'Date: %{x}<br>Duration: %{y} minutes',
      name: ""
    };

    let layout  = {
      title: {
        text: `${this.getTitle(this.chartMode)}`,
        font: {
          family: 'Roboto',
          size: 30,
          color: "#111"
        },
      },
      xaxis: {
        title: {
          text: 'Date',
          font: {
            family: 'Roboto',
            size: 18,
            color: '#111'
          }
        },
      },
      yaxis: {
        title: {
          text: this.valueType === ValueType.DURATION ? 'Focus Duration (mins)' : "Number of Pomodoro Sessions",
          font: {
            family: 'Roboto',
            size: 18,
            color: '#111'
          }
        }
      },
    }
    let endDate = StatChartComponent.toDateString(this.today);
    let startDate = StatChartComponent.toDateString(this.today);
    switch (this.chartMode) {
      case ChartMode.WEEK:
        startDate = StatChartComponent.toDateString(subDays(this.today, 7));
        break;
      case ChartMode.MONTH:
        startDate = StatChartComponent.toDateString(subMonths(this.today, 1));
        break;
      case ChartMode.YEAR:
        startDate = StatChartComponent.toDateString(subYears(this.today, 1));
        break;
      case ChartMode.ALL:
        startDate = StatChartComponent.toDateString(new Date("2022-06-22")); // the date where this thing is created
        break;
    }

    invoke('query_totals',
      {
        endDate, startDate
      }).then(res => {
      if (typeof res === "string") {
        let parsed = JSON.parse(res);
        for (let i = -differenceInCalendarDays(new Date(startDate.toString()), new Date(endDate.toString())) - 1; i >= 0; i--) {
          total_time.x.push(StatChartComponent.toDateString(subDays(this.today, i)));
          total_time.y.push(0);
        }
        if (this.valueType === ValueType.DURATION) {
          // repeat this part to make it more efficient so that if else doesn't need to be computed inside
          parsed.forEach((val: { date: String; duration: number; }) => {
            for (let idx in total_time.x) {
              if (total_time.x[idx] === val.date) {
                total_time.y[idx] = val.duration + total_time.y[idx];
              }
            }
          });
        } else {
          parsed.forEach((val: { date: String; num_session: number; }) => {
            for (let idx in total_time.x) {
              if (total_time.x[idx] === val.date) {
                total_time.y[idx] = val.num_session + total_time.y[idx];
              }
            }
          });
        }
        Plotly.newPlot('plotly-plot', [total_time], layout);
      }
    });
  }

  private static toDateString(date: Date): String {
    return format(date, "yyyy-MM-dd");
  }

  private getTitle(chartMode: ChartMode) {
    switch (chartMode) {
      case ChartMode.WEEK:
        return "Your Weekly Record";
      case ChartMode.MONTH:
        return "Your Monthly Record";
      case ChartMode.YEAR:
        return "Your Record this year";
      case ChartMode.ALL:
        return "All Your Records";
    }
  }

}
