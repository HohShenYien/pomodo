import { TestBed } from '@angular/core/testing';

import { TimerTempStateService } from './timer-temp-state.service';

describe('TimerTempStateService', () => {
  let service: TimerTempStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerTempStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
