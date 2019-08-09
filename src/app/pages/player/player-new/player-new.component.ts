import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-player-new',
  templateUrl: './player-new.component.html',
  styleUrls: ['./player-new.component.css']
})
export class PlayerNewComponent implements OnInit {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
