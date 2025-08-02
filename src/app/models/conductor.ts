import { Deserializable } from './deserealizable';

export class Conductor implements Deserializable {
  id: number;
  name: string;
  email: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}