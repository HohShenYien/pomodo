import { Component, OnInit } from '@angular/core';
import SidenavItems from "../models/sidenavItems";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {
  public navs: SidenavItems[] = [
    {name: "Timer", link: "/", icon: "timer"},
    {name: "Statistics", link: "/stats", icon: "bar_chart"},
    {name: "Settings", link: "/settings", icon: "settings"}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
