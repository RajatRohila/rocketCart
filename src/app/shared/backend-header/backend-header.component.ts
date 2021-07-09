import { Component, OnInit } from '@angular/core';
import {ApiserviceService} from '../../apiservice.service';

@Component({
  selector: 'app-backend-header',
  templateUrl: './backend-header.component.html',
  styleUrls: ['./backend-header.component.css']
})
export class BackendHeaderComponent implements OnInit {
  public allowPagesUrl = {};
  public module = {};
  public isAdmin = false;
  public userName = '';
  constructor(private apiserviceService: ApiserviceService) { }

  ngOnInit(): void {
    this.loadUserAccessDetails();
    const isLongIn =  localStorage.getItem( 'isLogin');
    if (isLongIn === 'false') {
      localStorage.setItem( 'isLogin', 'true');
      window.location.reload();

    }

  }

  loadUserAccessDetails() {
    const admin = localStorage.getItem('isAdmin');
    if (admin != null && admin !== undefined) {
      if (admin === 'true') {
        this.isAdmin = true;
      }
    }
    const urls = localStorage.getItem('allowPagesUrlMap');
    if (urls != null && urls !== undefined) {
      this.allowPagesUrl = JSON.parse(urls);
    }
    const module = localStorage.getItem('allowModuleMap');
    if (module != null && module !== undefined) {
      this.module = JSON.parse(module);
    }
    this.userName = localStorage.getItem('userName');
  }

  logout() {
    this.apiserviceService.removeItemFromLocalStorage();
    this.apiserviceService.router.navigateByUrl('/main');
  }
}
