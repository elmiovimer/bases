import { CanActivateFn } from '@angular/router';

export const yourGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
