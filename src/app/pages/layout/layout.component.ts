import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/model/menu';
import { LoginService } from 'src/app/service/login.service';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  menus: Menu[];

  constructor(
    private menuService: MenuService,
    private loginService: LoginService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe((data) => (this.menus = data));
  }

  logout(){
    this.loginService.logout();
  }
  showprofile(){
    this.router.navigate(['/pages/profile']);   
  }
}
