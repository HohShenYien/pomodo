import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
  @Input()  val: number = 25;
  @Output() valChange = new EventEmitter<number>();

  public tempVal: number = 0;

  decrement() { this.valChange.emit(--this.val); }
  increment() { this.valChange.emit(++this.val); }

  public inputValidator(event: any) {
    //console.log(event.target.value);
    const pattern = /^[0-9]*$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
      // invalid character, prevent input

    }
  }

  constructor() { }

  ngOnInit(): void {
    this.tempVal = this.val;
  }

}
