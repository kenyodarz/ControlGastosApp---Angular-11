import { Description } from 'src/app/core/models/description';
import { User } from 'src/app/core/models/User';
import { Informe } from './Informe';
export class RegistroSalida {
  constructor(
    public idRegistroSalida: number = null,
    public observaciones: string = null,
    public description: Description = null,
    public tipo: string = null,
    public fecha: Date = null,
    public cantidad: number = null,
    public users: User = null,
    public informe: Informe = null
  ) {}
}
