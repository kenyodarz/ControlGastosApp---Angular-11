import { Description } from './description';
import { RegistroEntrada } from './RegistroEntrada';

export class Saldo {
  constructor(
    public idSaldo: number = null,
    public observaciones: string = null,
    public description: Description = null,
    public tipo: string = null,
    public fecha: Date = null,
    public cantidad: number = null,
    public users: string = null,
    public cerrado: boolean = null,
    public registroEntrada: RegistroEntrada = null
  ) {}
}
