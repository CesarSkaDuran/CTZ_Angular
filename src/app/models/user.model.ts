import { Deserializable } from './deserealizable';
import { Role } from './role';
import { Permiso } from './permiso';
import { Conductor } from './conductor';
import { AppPatient } from './appPatient';

export class User implements Deserializable {
  id: number;
  name: string;
  last_name: string;
  photo: string;
  role_id: number;
  role: Role;
  permiso: Permiso;
  conductor: Conductor;
  app_patient: AppPatient;
  
  fullName() {
    return `${this.name} ${this.last_name != null ? this.last_name : ''}`;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
