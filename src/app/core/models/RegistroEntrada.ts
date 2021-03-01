import { Description } from 'src/app/models/description';
import { User } from 'src/app/models/User';
import { Informe } from './Informe';
export class RegistroEntrada {
  constructor(
    public idRegistro: number = null,
    public observaciones: string = null,
    public description: Description = null,
    public tipo: string = null,
    public fecha: Date = null,
    public cantidad: number = null,
    public users: User = null,
    public cerrado: boolean = null,
    public informe: Informe = null
  ) {}
}
