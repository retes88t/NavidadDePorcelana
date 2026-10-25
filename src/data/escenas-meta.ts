import type { Escena } from './types'

export type EscenaMeta = Omit<Escena, 'lineas'>

export const escenasMeta: EscenaMeta[] = [
  {
    numero: 1,
    acto: 1,
    titulo: 'Un invitado distinguido',
    lugar: 'Comedor, con el árbol de Navidad cerca de la entrada',
    resumen: 'Adriana y Ana están preparando la mesa.',
  },
  {
    numero: 2,
    acto: 1,
    titulo: 'Bienvenidos',
    lugar: 'Portal de la casa y comedor',
    resumen: 'Llegan Nora, LuisFer, Chelo y Luis.',
  },
  {
    numero: 3,
    acto: 1,
    titulo: 'Reencuentros',
    lugar: 'Portal de la casa y comedor',
    resumen: 'Llega Astrid. Se encuentra con LuisFer.',
  },
  {
    numero: 4,
    acto: 1,
    titulo: 'Recuerdos',
    lugar: 'Portal de la casa, cocina y comedor',
    resumen: 'LuisFer habla con Ana sobre Astrid, Nora escucha.',
  },
  {
    numero: 5,
    acto: 2,
    titulo: 'La foto',
    lugar: 'Comedor decorado para la cena',
    resumen: 'Sesión de fotos. Pelea principal.',
  },
  {
    numero: 6,
    acto: 2,
    titulo: 'Ciclos',
    lugar: 'Cocina',
    resumen: 'Nora y Adriana hablan sobre LuisFer.',
  },
  {
    numero: 7,
    acto: 2,
    titulo: 'Tropiezos',
    lugar: 'Comedor, con el portal apagado',
    resumen: 'Nora pide a LuisFer hablar.',
  },
  {
    numero: 8,
    acto: 2,
    titulo: 'Otravez',
    lugar: 'Portal de la casa, con el comedor iluminado al fondo',
    resumen: 'Nora y LuisFer cortan.',
  },
  {
    numero: 9,
    acto: 3,
    titulo: '',
    lugar: 'Cocina, con el comedor en penumbra',
    resumen: 'Ana habla con Adriana para que salga de la cocina.',
  },
  {
    numero: 10,
    acto: 3,
    titulo: 'La cena',
    lugar: 'Comedor',
    resumen: 'Se sientan a cenar. Regresa Nora.',
  },
  {
    numero: 11,
    acto: 3,
    titulo: '¿Volvemos?',
    lugar: 'Comedor y cocina',
    resumen: 'Luis habla con Adriana. Salen LuisFer y Luis.',
  },
  {
    numero: 12,
    acto: 3,
    titulo: 'Navidad',
    lugar: 'Comedor',
    resumen: 'Limpian la casa. Todos se van a dormir.',
  },
]
