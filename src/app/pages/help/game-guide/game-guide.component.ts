import { Component, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';

@Component({
  selector: 'app-game-guide',
  templateUrl: './game-guide.component.html'
})
export class GameGuideComponent {
  @Input() UIC: any;
  
  constructor(private baseService: BaseService) { }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
