import { Deserializable } from './deserealizable';
//import { Doctor } from './doctor';

export class Productos implements Deserializable {
    id: number;
    nombre: String;
    codigo: String;
    precio:string;
    unidad_medida:string;
    created_at: Date;
    data: any[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}