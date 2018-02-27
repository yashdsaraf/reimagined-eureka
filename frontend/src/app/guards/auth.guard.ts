import {Injectable} from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import {AuthService} from '../services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  canActivate(): boolean {
    if (this.authService.getRole() == null || this.authService.getRole() == 'GUEST') {
      return true
    }
    this.router.navigate(['/home'])
    return false
  }
}
