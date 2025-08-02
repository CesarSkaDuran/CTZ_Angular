import { Deserializable } from './deserealizable';

export class AppPatient implements Deserializable {
    id: number;
    name: string;


    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}