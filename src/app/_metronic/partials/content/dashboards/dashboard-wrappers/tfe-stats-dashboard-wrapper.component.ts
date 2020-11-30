import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';

@Component({
  selector: 'app-tfe-stats-dashboard-wrapper',
  templateUrl: './tfe-stats-dashboard-wrapper.component.html',
})
export class TfeStatsDashboardWrapperComponent implements OnInit {
  demo: string;
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');
  }
}
