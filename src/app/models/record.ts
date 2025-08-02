import { Deserializable } from './deserealizable';
import { Patient } from '../models/patient';

export class Record implements Deserializable {
  id: number;
  identification: any;
  conclusion: string;
  motive: string;
  patient: Patient;
  created_at: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}