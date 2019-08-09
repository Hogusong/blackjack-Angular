import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from './providers/base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  UIC: any = {};
  oldUIC: any = {};                 // Keep the previous UI to return.
  UICsubscription: Subscription;    // Watching UIC's update.

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.UIC = this.baseService.getUIconfig();
    this.UICsubscription = this.baseService.getUIconfigSubject()
      .subscribe(config => {
        this.oldUIC = this.UIC;
        this.UIC = config;
      });
  }

  ngOnDestroy() {
    this.UICsubscription.unsubscribe();
  }
}
