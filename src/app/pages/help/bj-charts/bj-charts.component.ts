import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-bj-charts',
  templateUrl: './bj-charts.component.html',
  styleUrls: ['./bj-charts.component.css']
})
export class BjChartsComponent implements OnInit {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
