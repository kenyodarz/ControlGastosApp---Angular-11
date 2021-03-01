import { Proyecto } from 'src/app/core/models/Proyecto';
import { User } from 'src/app/core/models/User';
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
