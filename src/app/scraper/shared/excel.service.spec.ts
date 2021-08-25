import { TestBed } from '@angular/core/testing';

import { ExcelServices } from './excel.service';

describe('ExcelServicesService', () => {
  let service: ExcelServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
