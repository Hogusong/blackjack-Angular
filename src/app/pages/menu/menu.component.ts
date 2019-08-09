import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  UIC: any;
  uicSubscription: Subscription;

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.UIC = this.baseService.getUIconfig();

    // Watching UIC for navigation menu.
    this.uicSubscription = this.baseService.getUIconfigSubject()
      .subscribe(config => {
        this.UIC = config;
      })
  }

  openAddNew() {
    // Now allow while playing the game.
    if (!this.UIC.gameStarted) {
      const config = this.baseService.getAllFalseUIconfig();
      config.openAddNew = true;
      this.baseService.setUIconfig(config);
    }
  }
  
  openRemove() {
    // Now allow while playing the game.
    if (!this.UIC.gameStarted) {
      const config = this.baseService.getAllFalseUIconfig();
      config.openRemove = true;
      this.baseService.setUIconfig(config);
    }
  }

  openGameGuide() {}

  openBJCharts() {}

  openOptions() {}

  ngOnDestroy() {
    this.uicSubscription.unsubscribe();
  }
}
