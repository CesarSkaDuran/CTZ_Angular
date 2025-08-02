import { Injectable,EventEmitter } from '@angular/core';
import { User } from '../models/user.model';


@Injectable()
export class CoreService {
  currentUser: User;

  constructor() {}

  public setUser(user: User) {
    this.currentUser = user;

    this.cacheValue('current_user', user);
  }

  public get user(): User {
    return this.currentUser;
  }

  public get userFromCache(): User {
    return new User().deserialize(this.getValueFromCache('current_user'));
  }

  // public setCompanies(companies: any[]) {
  //   this.userCompanies = companies;

  //   this.setCurrentCompanyFromCache();
  // }

  // public setPermissions(permissions: any[]) {
  //   this.userPermissions = permissions;
  // }

  // public getPermissions() {
  //   return this.userPermissions.filter((item: any) => {
  //     return item.company_id == parseInt(this.currentCompany.id);
  //   })[0].permissions;
  // }

  // public checkPermissions(module_id: number, section: string) {
  //   return this.getPermissions().filter((item: any) => item.module_id == module_id)[0][section];
  // }

  // public async setCurrentCompanyFromCache() {
  //   let companyId = await this.getValueFromCache('company_id');

  //   console.log(companyId);
  //   if (companyId) {
  //     let companyMatch = this.userCompanies.filter((item: any) => item.id == companyId);
  //     this.currentCompany = companyMatch && companyMatch.length > 0 ? companyMatch[0] : this.userCompanies[0];
  //     this.cacheValue('company_id', this.currentCompany.id);
  //   } else {
  //     this.currentCompany = this.userCompanies[0];
  //     this.cacheValue('company_id', this.currentCompany.id);
  //   }
  // }

  // public get company(): any {
  //   return this.currentCompany;
  // }

  private cacheValue(index: string, value: any) {
    localStorage.setItem(index, JSON.stringify(value));
  }

  private deleteValueFormCache(index: string) {
    localStorage.removeItem(index);
  }

  getValueFromCache(index: string) {
    return JSON.parse(localStorage.getItem(index));
  }


  rol_actual$ = new EventEmitter<string>();
}
