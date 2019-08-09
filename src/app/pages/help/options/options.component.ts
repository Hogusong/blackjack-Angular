import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit, OnDestroy {

  @Input() UIC: any;
  message: string = '';
  myForm: FormGroup;
  timer: any;

  constructor(private baseService: BaseService) { }

  ngOnInit() { 
    this.setInitialForm();
  }

  // Set auto-save whenever value has been changed.
  valueChanged() {
    if (this.myForm.valid) {
      if (this.myForm.value.autoPlay === 'Yes') {
        this.myForm.controls['setPlayer'].setValue('in play');
      }
      const config = {
        showResult: this.myForm.value.howToShow === 'inBox',
        delay: this.myForm.value.delayTime * 1000,
        delay4dealer: this.myForm.value.delay4dealer * 1000,
        keepInPlay: this.myForm.value.setPlayer === 'in play',
        keepLastBet: this.myForm.value.keepBet === 'keep',
        minBetting: this.myForm.value.minBet,
        howManyDecks: this.myForm.value.decks,
        autoPlay: this.myForm.value.autoPlay === 'Yes',  
      }
      this.baseService.setConfig(config);
      this.message = 'New options are saved with changes.';
      this.timer = setTimeout(() => this.message = '', 1500);
    }
  }

  resetDefaultValue() {
    this.message = 'Reset Defult options.';
    this.timer = setTimeout(() => this.message = '', 1500);
    this.baseService.resetDefultConfig();
    this.setInitialForm();
  }

  setInitialForm() {
    const config = this.baseService.getConfig();
    this.myForm = new FormGroup({
      howToShow: new FormControl(config.showResult ? 'inBox' : 'delay'),
      delayTime: new FormControl(config.delay/1000, 
        {validators: [Validators.required, Validators.min(1), Validators.max(7)]}),
      delay4dealer: new FormControl(config.delay4dealer/1000,
        {validators: [Validators.required, Validators.min(1), Validators.max(7)]}),
      setPlayer: new FormControl(config.keepInPlay ? 'in play' : 'stay out'),
      keepBet: new FormControl(config.keepLastBet ? 'keep' : 'reset'),
      minBet: new FormControl(config.minBetting, 
        {validators: [Validators.required, Validators.min(5)]}),
      decks: new FormControl(config.howManyDecks, 
        {validators: [Validators.required, Validators.min(4), Validators.max(10)]}),
      autoPlay: new FormControl(config.autoPlay ? 'Yes' : 'No')
    });
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
