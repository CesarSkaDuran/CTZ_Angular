import { Deserializable } from './deserealizable';
//import { Role } from './role';
import { Permiso } from './permiso';
import { AppPatient } from './appPatient';

export class Role implements Deserializable {
  id: number;
  permiso_id: number;
  role: string;
  permiso: Permiso;


    /*
  fullName() {
    return `${this.name} ${this.last_name != null ? this.last_name : ''}`;
  }*/

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
