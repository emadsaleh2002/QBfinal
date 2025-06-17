import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree , Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth:AuthService , private router:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const userRole = this.auth.userRole;

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    // لو مش مسموح، تحويل لـ صفحة forbidden أو login
    this.router.navigate(['/home'], { queryParams: { redirect: state.url } });
    return false;
  }
  
}
