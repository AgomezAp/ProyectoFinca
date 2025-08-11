import { Schema, model, Document } from 'mongoose';

// 1. Definir la interfaz TypeScript
interface IReserva extends Document {
  nombre: string;
  cc: string;
  email: string;
  telefono: string;
  fechaLlegada: Date;
  fechaSalida: Date;
  cantidad: number;
  documento_f: string; // Almacenará la ruta o referencia al JPG
  documento_p: string; // Almacenará la ruta o referencia al JPG
  rostro: string;     // Almacenará la ruta o referencia al JPG
  terminos: boolean;
  confirmado: boolean;
}

// 2. Definir el esquema Mongoose
const ReservaSchema = new Schema<IReserva>({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  cc: {
    type: String,
    required: [true, 'El documento de identidad es obligatorio'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  fechaLlegada: {
    type: Date,
    required: [true, 'La fecha de llegada es obligatoria']
  },
  fechaSalida: {
    type: Date,
    required: [true, 'La fecha de salida es obligatoria'],
    validate: {
      validator: function(this: IReserva, value: Date) {
        return value > this.fechaLlegada;
      },
      message: 'La fecha de salida debe ser posterior a la fecha de llegada'
    }
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad de personas es obligatoria'],
    min: [2, 'La cantidad mínima es 1 persona'],
    max: [15, 'La cantidad máxima es 15 personas']
  },
  documento_f: {
    type: String,
    required: [true, 'El documento frontal es obligatorio'],
    // validate: {
    //   validator: (v: string) => v.startsWith('data:image/jpeg;base64,'),
    //   message: 'El documento frontal debe ser un JPG en base64'
    // }
  },
  documento_p: {
    type: String,
    required: [true, 'El documento posterior es obligatorio'],
    // validate: {
    //   validator: (v: string) => v.startsWith('data:image/jpeg;base64,'),
    //   message: 'El documento frontal debe ser un JPG en base64'
    // }
  },
  rostro: {
    type: String,
    required: [true, 'La foto de rostro es obligatoria'],
    // validate: {
    //   validator: (v: string) => v.startsWith('data:image/jpeg;base64,'),
    //   message: 'El documento frontal debe ser un JPG en base64'
    // }
  },
  terminos: {
    type: Boolean,
    required: true,
    validate: {
      validator: (value: boolean) => value === true,
      message: 'Debe aceptar los términos y condiciones'
    }
  },
  confirmado: {
    type: Boolean,
    default: null
  }
}, );

export const Reserva = model<IReserva>('Reserva', ReservaSchema);