import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';

@Component({
  selector: 'app-tfe-lobbies-dashboard-wrapper',
  templateUrl: './tfe-lobbies-dashboard-wrapper.component.html',
})
export class TfeLobbiesDashboardWrapperComponent implements OnInit {
  demo: string;
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');
  }
}
