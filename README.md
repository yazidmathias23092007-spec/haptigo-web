# HaptiGo — Navegación Háptica Microespacial

Proyecto académico desarrollado para el curso **1ASI0784 - HCI for UX Design** (Sección 15398, Ciclo 2026-2) de la **Universidad Peruana de Ciencias Aplicadas (UPC)**.

## Enlaces del Proyecto
- **Repositorio GitHub:** https://github.com/yazidmathias23092007-spec/haptigo-web
- **Demo Web Desplegada (GitHub Pages):** https://yazidmathias23092007-spec.github.io/haptigo-web/
- **Prototipo UI/UX en Figma:** [Ver diseño en Figma](https://www.figma.com/design/xrCVmNOJr6pg3lfKOKrHUr/HaptiGo-%E2%80%94-TB2-%7C-Dise%C3%B1o-web-responsive?node-id=0-1&t=FrdeckEq1WbkDJTV-1)

## Descripción de la Solución
**HaptiGo** es un sistema complementario de asistencia para la navegación microespacial de personas con ceguera total o baja visión severa. Mediante un dispositivo portátil (*Haptic One*) equipado con sensor de proximidad frontal (`< 2 m`, cono de `35°`) y audio opcional por conducción ósea, comunica obstáculos elevados (a la altura del torso o la cabeza) a través de tres patrones vibrotáctiles progresivos sin sustituir el bastón blanco ni bloquear la percepción auditiva del entorno.

## Estructura del Repositorio
- `index.html`: Interfaz interactiva organizada en 7 vistas/diapositivas independientes con soporte semántico ARIA y cumplimiento WCAG 2.2 AA/AAA.
- `styles.css`: Sistema visual fiel al prototipo de Figma (*Dark 900* `#05070B`, *Teal 700* `#0B7A68`, *Red 700* `#D93025`) y diseño responsivo (*Desktop 1440px* y *Mobile 390px*).
- `script.js`: Navegación entre slides/secciones, simulador interactivo de proximidad (`0,2 m` a `2,5 m`), botón de seguridad con pulsación sostenida (`1,5 s`), storyboard accesible de 5 escenas, acordeón FAQ y validación de formulario.
- `manual-haptigo.txt`: Manual de inducción y uso seguro descargable en formato accesible.

## Integrantes del Equipo
- Arenas Cardenas, Lionel Aldo (`U20251G442`)
- Enriquez Yampul, Caleb Natanael (`U20251G448`)
- Espinoza Espinoza, Yazid Mathias (`U202517749`)
- Mogollon Salcedo, Luis Enrrique (`U20251F680`)
- Poma Rojas, Arnny (`U20251G342`)
- Salvador Pomasoncco, Kevin Leonardo (`U20251F988`)
