import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
