import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-subheader-tfe',
  templateUrl: './subheader-tfe.component.html'
})
export class SubheaderTfeComponent implements OnInit {
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';

  currentRoute: string;

  constructor(private layout: LayoutService, private router: Router) {
    this.currentRoute = router.url.slice(1);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = (event as NavigationEnd).url.slice(1);
      }
    });
  }

  ngOnInit() {
    this.subheaderContainerCSSClasses = this.layout.getStringCSSClasses(
      'subheader_container'
    );
  }
}
