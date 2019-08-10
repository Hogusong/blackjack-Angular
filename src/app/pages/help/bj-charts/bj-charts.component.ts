import { Component, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-bj-charts',
  templateUrl: './bj-charts.component.html'
})
export class BjChartsComponent {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
