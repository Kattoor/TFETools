import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';

@Component({
  selector: 'app-tfe-top100-stats-dashboard-wrapper',
  templateUrl: './tfe-top100-stats-dashboard-wrapper.component.html',
})
export class TfeTop100StatsDashboardWrapperComponent implements OnInit {
  demo: string;
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');
  }
}
