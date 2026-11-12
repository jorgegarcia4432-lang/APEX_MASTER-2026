# PROMPT MAESTRO & ESPECIFICACIÓN DE PROYECTO WEB — ANTIGRAVITY
## Proyecto: Portal Oficial **APEX MASTERS 2026: CHALLENGER CHAMPIONSHIP** (VALORANT)

---

### 1. CONTEXTO E IDENTIDAD DEL PROYECTO
Construye una aplicación web moderna, responsiva, ultrarrápida y visualmente impactante para el torneo oficial de eSports **APEX MASTERS 2026: CHALLENGER CHAMPIONSHIP**, disciplina **VALORANT (Tactical FPS 5v5)**.

- **Fechas Oficiales:** 14 y 15 de Noviembre de 2026 | Horario: 09:00 - 21:00 EST (Gran Final hasta 23:00 EST).
- **Modalidad:** Híbrida (Día 1: Fase de Grupos y Octavos Online | Día 2: Playoffs, Semifinales y Gran Final Presencial en **Arena eSports Nexus**).
- **Organización:** Comité Organizador Multidisciplinario de eSports & Nexus Tech (Integrantes: Jorge Garcia, Erwin Ortiz, Santiago Candanoza).
- **Capacidad:** 32 Equipos (5 titulares + 2 suplentes = 224 jugadores) | Auditorio presencial para 500 asistentes.

---

### 2. DIRECCIÓN DE ARTE Y SISTEMA DE DISEÑO (UI/UX TIER-1 ESPORTS)
- **Paleta de Colores (Dark Tactical Theme):**
  - Fondo Principal: `#090D16` (Obsidian Deep)
  - Superficies / Tarjetas: `#111827` con bordes sutiles `rgba(255, 255, 255, 0.08)` y efecto *glassmorphism*.
  - Color Primario (Acento VALORANT): `#FF4655` (Crimson Tactical Red)
  - Color Secundario (Tech/Cyber): `#00E5FF` (Cyan Pulse)
  - Color Oro / Prize Pool: `#F59E0B` (Championship Gold)
  - Texto Principal: `#F8FAFC` | Texto Secundario: `#94A3B8`
- **Tipografía:**
  - Títulos y Encabezados: *Rajdhani*, *Chakra Petch* o *Space Grotesk* (en mayúsculas, tracking amplio, estilo HUD táctico).
  - Cuerpo de texto: *Inter* o *Plus Jakarta Sans*.
  - Datos numéricos, horarios, pings y precios: *JetBrains Mono*.
- **Micro-interacciones:**
  - Efectos *hover* con bordes brillantes en tarjetas, cortes diagonales (`clip-path`) estilo interfaz táctica, transiciones suaves en pestañas de cronograma y brackets, y barra de navegación fija (*sticky navbar*) con indicador de estado `EN VIVO / REGISTRO ABIERTO`.

---

### 3. ARQUITECTURA DE SECCIONES Y COMPONENTES DE LA PÁGINA WEB

#### A. Barra de Navegación (Navbar)
- Logo tipográfico **APEX MASTERS 2026** con insignia `VALORANT 5v5`.
- Enlaces de navegación suave: `Inicio`, `Formato`, `Cronograma`, `Reglamento`, `Arena & Tech`, `Premios`, `Sponsors`.
- Botón CTA destacado: **`INSCRIBIR EQUIPO ($50 USD)`** (abre modal de registro interactivo).

#### B. Hero Section (Impacto Inicial)
- Etiqueta superior: `14 - 15 NOVIEMBRE 2026 • HÍBRIDO: ONLINE + ARENA ESPORTS NEXUS`.
- Título H1 monumental: **APEX MASTERS 2026: CHALLENGER CHAMPIONSHIP**.
- Subtítulo: *"El torneo regional de VALORANT con estándares Tier-1. 32 escuadras, $5,000 USD en premios y gloria presencial en Arena LAN."*
- **Contador Regresivo en Tiempo Real** apuntando al `14 de Noviembre de 2026, 09:00:00 EST`.
- **Tarjetas KPI Rápidas (4 columnas):**
  1. `32 EQUIPOS` (224 Atletas Digitales)
  2. `$5,000 USD` (Prize Pool Oficial)
  3. `360Hz + RTX 4070 Ti` (Hardware Stage)
  4. `500 ASISTENTES` (Auditorio Presencial)
- Botones de acción: **`Registrar Escuadra`** (primario rojo) y **`Descargar Reglamento Oficial`** (secundario contorno).

#### C. Formato de Competencia y Llaves Interactivas
- Visualización clara de las 3 fases del torneo con selector de pestañas:
  - **Fase 1: Grupos GSL (Día 1 Online):** 8 grupos de 4 equipos. Formato *Dual Tournament* (Bo1 inicial, Decider Bo3). Clasifican Top 2 por grupo (16 equipos).
  - **Fase 2: Playoffs Doble Eliminación (Día 1/2):** Upper Bracket (Bo3) y Lower Bracket (Bo1 hasta Final Lower Bo3).
  - **Fase 3: Gran Final Presencial (Día 2):** Campeón Upper vs. Campeón Lower en serie **Bo5** con ventaja de veto de mapa para el finalista de Upper.
- **Acordeón / Tarjeta de Desempates Oficiales:**
  1. Enfrentamiento directo (*Head-to-Head*).
  2. Diferencia de rondas (*Round Differential*).
  3. Rondas ganadas en bando Atacante.
  4. Partida extra (*Tiebreaker*) Armas Cortas / Muerte Repentina.

#### D. Cronograma Interactivo (Día 1 vs. Día 2)
Implementar un **switch/pestañas interactivas** para alternar entre ambas jornadas (Horario EST):

**Pestaña 1: Jornada 1 — Sábado 14 Nov (Online - Discord / Start.gg)**
- `08:00 - 09:00`: Acreditación y Check-In (Validación de 32 capitanes).
- `09:00 - 09:30`: Reunión de Capitanes / Briefing (Reglas, vetos y sorteo de servidor).
- `09:30 - 12:00`: Fase de Grupos - Ronda 1 (Bo1 - 16 partidas simultáneas).
- `12:00 - 14:30`: Fase de Grupos - Ronda 2 (Bo1 - Ganadores y perdedores).
- `14:30 - 15:30`: Receso Técnico / Almuerzo.
- `15:30 - 18:30`: Fase de Grupos - Decider (Bo3 - Definición de 16 clasificados).
- `18:30 - 21:00`: Playoffs - Octavos de Final (Bo1 - 8 partidas eliminatorias).

**Pestaña 2: Jornada 2 — Domingo 15 Nov (Presencial - Arena eSports Nexus)**
- `09:00 - 10:00`: Llegada de Equipos / Warm-up (Verificación de periféricos y audio).
- `10:00 - 10:30`: Ceremonia de Apertura (Main Stage / Twitch).
- `10:30 - 13:00`: Cuartos de Final (Bo3 - Stage A & B en simultáneo).
- `13:00 - 15:30`: Semifinales Upper Bracket (Bo3 - Main Stage).
- `15:30 - 16:30`: Showmatch & Activación de Patrocinadores.
- `16:30 - 18:30`: Final de Lower Bracket (Bo3 - Main Stage).
- `18:30 - 22:30`: **GRAN FINAL (Bo5 - Main Stage Broadcast)**.
- `22:30 - 23:00`: Ceremonia de Premiación (Trofeo, medallas y MVP).

#### E. Reglamento, Fair Play y Escala de Sanciones
- **Requisitos de Jugador:** Edad mínima 16 años (autorización firmada si es <18), Rango mínimo **Platino 1** verificado (Anti-Smurfing).
- **Periféricos en Arena:** La organización provee PC y monitor; jugadores llevan ratón, teclado, alfombrilla y auriculares **jack 3.5mm**. Prohibidos macros, *Snap Tap/Rapid Trigger* no homologado y auriculares USB con software externo.
- **Protocolo Técnico:** Remake si hay desconexión `< 30s` sin daño; pausa técnica máx. `10 min` al terminar ronda si es `> 30s`. Tiempo muerto táctico: `60s` por mapa.
- **Tabla Visual de Sanciones (4 Niveles):**
  - *Nivel 1 (Advertencia):* Retraso <= 5 min o conducta menor.
  - *Nivel 2 (Penalización):* Pérdida de vetos o -3 rondas (reincidencia / retraso > 10 min).
  - *Nivel 3 (Derrota 13-0):* Insultos graves, pausas abusivas o negación a jugar.
  - *Nivel 4 (Descalificación y Veto):* Cero tolerancia a Hacks, Aimbots, Wallhacks, colusión o agresiones.

#### F. Ecosistema Tecnológico & Arena eSports Nexus
Mostrar con tarjetas técnicas de estilo *blueprint* / ingeniería:
- **Hardware Stage (10 PCs):** Intel Core i7-13700K / Ryzen 7 7800X3D, 32GB RAM DDR5, RTX 4070 Ti, NVMe 1TB, Monitores **ZOWIE XL2566K 240Hz/360Hz DyAc⁺ (0.5ms)** y 3 pantallas LED P2.5.
- **Red LAN/WAN & VLANs:** Fibra simétrica dedicada **1 Gbps** + respaldo 4G/5G Failover + UPS Online 30 min. Segmentación L3:
  - `VLAN 10`: Competidores Stage (< 15 ms ping).
  - `VLAN 20`: Broadcast / Casters (50 Mbps dedicados IP fija).
  - `VLAN 30`: Staff y Arbitraje.
  - `VLAN 40`: Wi-Fi Público (5 Mbps por usuario).
- **Layout del Recinto:** Stage A & B insonorizados, Broadcast Studio (2 croma keys, 3 cámaras PTZ 4K), Auditorio (500 gradas + pantalla gigante) y Sala de Arbitraje (4 estaciones réplica).
- **Broadcast:** Transmisión en vivo por **Twitch y YouTube** a **1080p / 60 FPS** (OBS Studio NDI/NVENC con overlays API en tiempo real).

#### G. Bolsa de Premios ($5,000 USD) y Patrocinadores
- **Podio Interactivo de Premios:**
  - **1.er Lugar (50%):** `$2,500.00 USD` + Trofeo Máximo APEX + Medallas de Oro + Cupo Regional Tier-1.
  - **2.º Lugar (25%):** `$1,250.00 USD` + Medallas de Plata + Licencias de periféricos.
  - **3.er Lugar (15%):** `$750.00 USD` + Medallas de Bronce + Kits de marcas aliadas.
  - **4.º Lugar (10%):** `$500.00 USD` + Diploma de Honor + Pases de temporada.
  - **Premio Especial MVP Final:** Trofeo individual MVP + Teclado/Ratón de Patrocinador Gold.
- **Niveles de Patrocinio (B2B / Sponsors):**
  - *Gold Sponsor ($3,500 USD):* Logo en camiseta oficial, mención por mapa, stand de 20m² en arena, comercial de 30s en stream.
  - *Silver Sponsor ($1,500 USD):* Logo secundario en overlays, banner en arena, fotocall y redes sociales.
  - *Bronze Sponsor ($500 USD / In-Kind):* Logo en web oficial, productos en kits de bienvenida y sorteos en vivo.
  - Botón de contacto comercial para empresas interesadas.

#### H. Modal Interactivo de Inscripción de Equipos (4 Pasos)
Al hacer clic en **"Inscribir Equipo"**, abrir un formulario multipaso funcional con validación en cliente:
1. **Datos del Equipo y Capitán:** Nombre del equipo, Tag (3-4 letras), Discord ID del capitán y correo electrónico.
2. **Plantilla (5 Titulares + 2 Suplentes Opcionales):** Campos para Riot ID (`Usuario#TAG`), edad (>=16) y rango actual (selector con validación mínima **Platino 1**).
3. **Resumen de Pago ($50.00 USD):** Selección de método (Stripe / PayPal / Transferencia Corporativa) y aceptación del Reglamento Oficial y Fair Play.
4. **Confirmación Simulada:** Generación inmediata de código de registro y vista previa del **Código QR de Acreditación**.

#### I. Directorio del Comité Organizador y Footer
- **Equipo Directivo:**
  - *Carlos Mendoza* — Director General del Evento (`direccion@apexmasters.com`)
  - *Sofia Arismendi* — Head Referee (`arbitraje@apexmasters.com`)
  - *Ing. Roberto Gómez* — Coordinador de Infraestructura (`tech@apexmasters.com`)
  - *Valentina Ríos* — Community & Broadcast Manager (`prensa@apexmasters.com`)
- **Créditos del Proyecto:** Comité Organizador Multidisciplinario de eSports & Nexus Tech (Jorge Garcia, Erwin Ortiz, Santiago Candanoza).
- Enlaces rápidos a Discord Oficial, Start.gg, Twitch, YouTube y Reglamento PDF.

---

### 4. INSTRUCCIONES TÉCNICAS DE IMPLEMENTACIÓN PARA ANTIGRAVITY
1. Genera el proyecto completo con código limpio, modular y listo para producción (HTML5/CSS3/JS moderno o React + Tailwind CSS según el entorno activo de Antigravity).
2. Asegura diseño **100% responsivo** (Mobile First adaptado a pantallas UltraWide de gaming).
3. Incluye datos precargados realistas (equipos de ejemplo en grupos, horarios exactos, calculadora de premios y filtros de búsqueda en el reglamento) para que la página sea completamente funcional desde el primer renderizado.
4. No dejes secciones vacías ni textos *Lorem Ipsum*; utiliza exclusivamente la información oficial especificada en este documento.
