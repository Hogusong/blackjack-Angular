import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html'
})
export class DialogBoxComponent implements OnInit {
  @Input() markup: any;  
  @Output() onExit = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
    document.getElementById('markup').innerHTML = this.markup;
  }

  onExitBox() {
    this.onExit.emit(false);
  }

}
