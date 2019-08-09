import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-game-guide',
  templateUrl: './game-guide.component.html',
  styleUrls: ['./game-guide.component.css']
})
export class GameGuideComponent implements OnInit {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
