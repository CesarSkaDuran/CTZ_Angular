import { Deserializable } from './deserealizable';

export class Patient implements Deserializable {
  id: number;
  identification: string;
  name: string;
  email: string;
  civil_status: string;
  position: string;
  birth_date: string;
  phone?: string;
  company: string;
  partner_name: string;
  partner_profession: string;
  profile_url: any;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}