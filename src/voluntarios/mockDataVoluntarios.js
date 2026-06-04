// src/voluntarios/mockDataVoluntarios.js
export const mockVoluntarios = [
  {
    id: "00001",
    responsableEntidad: "María García",
    perteneceA: "ONG Solidaridad",
    telefono: "600 111 111",
    email: "maria.garcia@gmail.com",
    localidad: "Málaga capital",
    domicilio: "Calle de la Victoria, 15",
    distrito: "Centro",
    observaciones: "Voluntaria recurrente. Prefiere turno de mañana.",
    horasSueltas: false, // 1º caso de Franja Completa (30%)
    horaComienzo: null,
    horaFinal: null,
    asignaciones: [
      {
        tiendaId: 101,
        tiendaNombre: "Supermercado Centro",
        turnos: [
          { turnoId: "T1", dia: "Lunes", franjaHoraria: "Mañana" },
          { turnoId: "T2", dia: "Miércoles", franjaHoraria: "Tarde" },
        ],
      },
    ],
  },
  {
    id: "00002",
    responsableEntidad: "Carlos López",
    perteneceA: "Asociación Vecinal Sur",
    telefono: "600 222 222",
    email: "carlos.lopez@hotmail.com",
    localidad: "Rincón de la Victoria",
    domicilio: "Avenida del Mediterráneo, 45",
    distrito: null,
    observaciones: "Solo dispone de vehículo propio los fines de semana.",
    horasSueltas: true, // 1º caso de Horas Sueltas (70%)
    horaComienzo: "10:30",
    horaFinal: "13:30",
    asignaciones: [
      {
        tiendaId: 103,
        tiendaNombre: "Lidl Reding",
        turnos: [
          { turnoId: "T3", dia: "Lunes", franjaHoraria: "10:30 - 13:30" },
        ],
      },
    ],
  },
  {
    id: "00003",
    responsableEntidad: "Lucía Pérez",
    perteneceA: "Cruz Roja Málaga",
    telefono: "600 333 333",
    email: "lucia.perez@cruzroja.es",
    localidad: "Málaga capital",
    domicilio: "Paseo de Reding, 12",
    distrito: "Este",
    observaciones: "Puede coordinar a un grupo de hasta 5 personas.",
    horasSueltas: true, // 2º caso de Horas Sueltas (70%)
    horaComienzo: "09:00",
    horaFinal: "12:15",
    asignaciones: [
      {
        tiendaId: 102,
        tiendaNombre: "CARREFOUR LARIOS",
        turnos: [
          { turnoId: "T4", dia: "Martes", franjaHoraria: "09:00 - 12:15" },
        ],
      },
      {
        tiendaId: 103,
        tiendaNombre: "Lidl Reding",
        turnos: [
          { turnoId: "T5", dia: "Jueves", franjaHoraria: "09:00 - 12:15" },
        ],
      },
    ],
  },
  {
    id: "00004",
    responsableEntidad: "Javier Ruiz",
    perteneceA: "Cáritas Diocesana",
    telefono: "600 444 444",
    email: "jruiz@caritas.org",
    localidad: "Marbella",
    domicilio: "Avenida Ricardo Soriano, 47",
    distrito: null,
    observaciones: "",
    horasSueltas: true, // 3º caso de Horas Sueltas (70%)
    horaComienzo: "17:15",
    horaFinal: "19:45",
    asignaciones: [
      {
        tiendaId: 104,
        tiendaNombre: "Mercadona Marbella",
        turnos: [
          { turnoId: "T6", dia: "Sábado", franjaHoraria: "17:15 - 19:45" },
        ],
      },
    ],
  },
  {
    id: "00005",
    responsableEntidad: "Ana Sánchez",
    perteneceA: "ONG Solidaridad",
    telefono: "600 555 555",
    email: "asanchez@gmail.com",
    localidad: "Málaga capital",
    domicilio: "Avenida de Velázquez, 80",
    distrito: "Carretera de Cádiz",
    observaciones: "Acaba de registrarse. Pendiente de asignar tienda.",
    horasSueltas: false, // 2º caso de Franja Completa (30%)
    horaComienzo: null,
    horaFinal: null,
    asignaciones: [], // Sin asignaciones
  },
  {
    id: "00006",
    responsableEntidad: "David Gómez",
    perteneceA: "Bancosol Oficial",
    telefono: "600 666 666",
    email: "dgomez@bancosol.es",
    localidad: "Málaga capital",
    domicilio: "Bulevar Louis Pasteur, 10",
    distrito: "Teatinos-Universidad",
    observaciones: "Voluntario comodín, dispuesto a ir a cualquier zona.",
    horasSueltas: true, // 4º caso de Horas Sueltas (70%)
    horaComienzo: "11:00",
    horaFinal: "14:00",
    asignaciones: [
      {
        tiendaId: 105,
        tiendaNombre: "ALCAMPO CENTRO",
        turnos: [
          { turnoId: "T7", dia: "Lunes", franjaHoraria: "11:00 - 14:00" },
        ],
      },
      {
        tiendaId: 106,
        tiendaNombre: "Día Teatinos",
        turnos: [
          { turnoId: "T8", dia: "Miércoles", franjaHoraria: "11:00 - 14:00" },
        ],
      },
    ],
  },
  {
    id: "00007",
    responsableEntidad: "Elena Fernández",
    perteneceA: "Asociación Vecinal Sur",
    telefono: "600 777 777",
    email: "efernandez@gmail.com",
    localidad: "Málaga capital",
    domicilio: "Calle Héroe de Sostoa, 100",
    distrito: "Carretera de Cádiz",
    observaciones:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    horasSueltas: true, // 5º caso de Horas Sueltas (70%)
    horaComienzo: "18:00",
    horaFinal: "21:00",
    asignaciones: [
      {
        tiendaId: 107,
        tiendaNombre: "Maskom Centro",
        turnos: [
          { turnoId: "T9", dia: "Domingo", franjaHoraria: "18:00 - 21:00" },
        ],
      },
    ],
  },
  {
    id: "00008",
    responsableEntidad: "Miguel Ángel Torres",
    perteneceA: "Cruz Roja Málaga",
    telefono: "600 888 888",
    email: "mtorres@cruzroja.es",
    localidad: "Torremolinos",
    domicilio: "Calle San Miguel, 12",
    distrito: null,
    observaciones: "De baja temporal por motivos personales hasta diciembre.",
    horasSueltas: true, // 6º caso de Horas Sueltas (70%)
    horaComienzo: "09:30",
    horaFinal: "12:30",
    asignaciones: [], // Sin asignaciones
  },
  {
    id: "00009",
    responsableEntidad: "Sofía Ramírez",
    perteneceA: "Cáritas Diocesana",
    telefono: "600 999 999",
    email: "sramirez@caritas.org",
    localidad: "Málaga capital",
    domicilio: "Avenida de la Rosaleda, 5",
    distrito: "Centro",
    observaciones: "",
    horasSueltas: true, // 7º caso de Horas Sueltas (70%)
    horaComienzo: "16:30",
    horaFinal: "20:30",
    asignaciones: [
      {
        tiendaId: 108,
        tiendaNombre: "Aldi Rosaleda",
        turnos: [
          { turnoId: "T10", dia: "Lunes", franjaHoraria: "16:30 - 20:30" },
          { turnoId: "T11", dia: "Martes", franjaHoraria: "16:30 - 20:30" },
        ],
      },
    ],
  },
  {
    id: "00010",
    responsableEntidad: "Antonio Martín",
    perteneceA: "ONG Solidaridad",
    telefono: "611 000 000",
    email: "amartin@gmail.com",
    localidad: "Mijas",
    domicilio: "Calle Las Lagunas, 3",
    distrito: null,
    observaciones: "Prefiere que no se le asigne la recogida de cajas pesadas.",
    horasSueltas: false, // 3º caso de Franja Completa (30%)
    horaComienzo: null,
    horaFinal: null,
    asignaciones: [
      {
        tiendaId: 101,
        tiendaNombre: "Supermercado Centro",
        turnos: [{ turnoId: "T12", dia: "Viernes", franjaHoraria: "Tarde" }],
      },
    ],
  },
];
