import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { correoGuard } from './correo.guard';

describe('correoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => correoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
