import { Deserializable } from './deserealizable';
import { Patient } from '../models/patient';

export class Permiso implements Deserializable {
    id: number;
    crear_pedido: number;
    editar_pedido: number;
    status: number;
    ver_usuarios: number;
    editar_usuarios: number;
    ver_clientes: number;
    editar_clientes: number;
    ver_vendedores: number;
    editar_vendedores: number;
    ver_conductores: number;
    editar_conductores: number;
    cerrar_dia: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}