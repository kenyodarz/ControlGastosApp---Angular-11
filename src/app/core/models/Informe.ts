import { Proyecto } from 'src/app/models/Proyecto';
import { User } from 'src/app/models/User';
export class Informe {
  constructor(
    public idInforme: number = null,
    public anulado: boolean = null,
    public fecha: Date = null,
    public users: User = null,
    public credito: number = null,
    public debito: number = null,
    public total: number = null,
    public proyecto: Proyecto = null
  ) {}
}
