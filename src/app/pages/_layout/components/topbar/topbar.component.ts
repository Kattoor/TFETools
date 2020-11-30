import { Component, OnInit, AfterViewInit } from '@angular/core';
import KTLayoutHeaderTopbar from '../../../../../assets/js/layout/base/header-topbar';
import { KTUtil } from '../../../../../assets/js/components/util';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, AfterViewInit {

  constructor() {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    KTUtil.ready(() => {
      // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      // Add 'implements AfterViewInit' to the class.

      // Init Header Topbar For Mobile Mode
      KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    });
  }

  open(what: string): void {
    switch (what) {
      case 'discord':
        window.open('https://discord.com/invite/d6HhVwq');
        break;
      case 'youtube':
        window.open('https://www.youtube.com/channel/UCov1NjhHiGwOLVlzVmQGHvw');
        break;
      case 'twitch':
        window.open('https://www.twitch.tv/tipofthespearofficial');
        break;
      case 'steam':
        window.open('https://store.steampowered.com/app/1148810/Tip_of_the_Spear_Task_Force_Elite/');
        break;
      case 'facebook':
        window.open('https://www.facebook.com/RedJakeStudiosLLC/');
        break;
      case 'instagram':
        window.open('https://www.instagram.com/task_force_elite.exe/?hl=en');
        break;
    }
  }
}
