import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { invoke } from '@tauri-apps/api/tauri'

import {
  startOfDay,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfMonth, format, subMonths, addMonths,
} from 'date-fns';

import {Subject} from "rxjs";

@Component({
  selector: 'app-stat-calendar',
  templateUrl: './stat-calendar.component.html',
  styleUrls: ['./stat-calendar.component.scss']
})

export class StatCalendarComponent implements OnInit {
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any> | undefined;

  public colors: any = {
    red: {
      primary: '#F08080',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#4169E1',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#FFD700',
      secondary: '#FDF1BA',
    },
    green: {
      primary: '#00FF7F',
      secondary: '#98FB98'
    }
  };

  public activeDayIsOpen: boolean = false;
  public loading: boolean = false;
  private curDate = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();

  ngOnInit() {
    this.updateEvents();
  }
  events: CalendarEvent[] = [
  ];

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public minusMonth() {
    this.curDate = subMonths(this.curDate, 1);
    this.updateEvents();
  }

  public addMonth() {
    this.curDate = addMonths(this.curDate, 1);
    this.updateEvents();
  }

  public setToday() {
    this.curDate = new Date();
    this.updateEvents();
    this.activeDayIsOpen = false;
  }

  public async updateEvents() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.events = [];
    let startDate = format(startOfMonth(this.curDate), "yyyy-MM-dd");
    let endDate = format(endOfMonth(this.curDate), "yyyy-MM-dd");
    let tempEvents: CalendarEvent[] = [];
    await invoke("query_data", {startDate, endDate}).then(res => {
      if (typeof res === "string") {
        let parsed = JSON.parse(res);
        parsed.forEach((val: { date: string | number | Date; num_session: number; duration: number }) => {
          tempEvents.push({
            start: startOfDay(new Date(val.date)),
            title: val.num_session + " sessions of duration " + val.duration + " minutes",
            color: val.duration > 240 ? this.colors.green : (val.duration > 120 ? this.colors.blue : (val.duration > 60 ? this.colors.yellow : this.colors.red))
          })
        })
      }
    })
    this.events = tempEvents;
    this.loading = false;
    console.log(this.events);
  }
}
