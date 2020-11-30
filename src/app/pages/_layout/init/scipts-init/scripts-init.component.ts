import { Component, OnInit, AfterViewInit } from '@angular/core';
import { KTUtil } from '../../../../../assets/js/components/util';
import KTLayoutStickyCard from '../../../../../assets/js/layout/base/sticky-card';
import KTLayoutStretchedCard from '../../../../../assets/js/layout/base/stretched-card';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-scripts-init',
  templateUrl: './scripts-init.component.html',
})
export class ScriptsInitComponent implements OnInit, AfterViewInit {
  asideSelfMinimizeToggle = false;

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
  }

  ngAfterViewInit() {
    KTUtil.ready(() => {
      // Init Sticky Card
      KTLayoutStickyCard.init('kt_page_sticky_card');
      // Init Stretched Card
      KTLayoutStretchedCard.init('kt_page_stretched_card');
    });
  }
}
