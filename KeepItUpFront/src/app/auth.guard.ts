import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './shared/service/user.service';

export const authGuard: CanActivateFn = (route, state) => {

  const userservice = inject(UserService);
  const router = inject(Router);

  if (userservice.getToken()) {
    return true;
  }
  router.navigate(['']);
  return false;
};
