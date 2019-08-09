import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-player-remove',
  templateUrl: './player-remove.component.html',
  styleUrls: ['./player-remove.component.css']
})
export class PlayerRemoveComponent implements OnInit {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
