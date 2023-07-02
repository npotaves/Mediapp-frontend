import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { ProfileService } from 'src/app/service/profile.service';
import { Rol } from 'src/app/model/rol';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  username: string;
  rolname: Rol[];


  constructor(
    private profileService: ProfileService
  ) { }


  ngOnInit(): void {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.username = decodeToken.sub; 
    this.profileService.getRoleByUsername(this.username).subscribe(data => {
      this.rolname = data;}
    );
  }

}
