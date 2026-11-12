/* ==========================================================
   DATA — única fuente de verdad del torneo (según el documento
   oficial y las skills 01-09). Ningún módulo hardcodea contenido.
   ========================================================== */
(function (A) {
  const EST_OFFSET_H = 5; // EST = UTC-5

  A.data = {
    event: {
      name: "APEX MASTERS 2026",
      subtitle: "CHALLENGER CHAMPIONSHIP",
      venue: "Arena eSports Nexus",
      // 14 Nov 2026 09:00 EST  →  14:00 UTC
      startUtc: Date.UTC(2026, 10, 14, 9 + EST_OFFSET_H, 0, 0),
      // 15 Nov 2026 23:00 EST  →  16 Nov 04:00 UTC
      endUtc: Date.UTC(2026, 10, 15, 23 + EST_OFFSET_H, 0, 0),
      estOffsetH: EST_OFFSET_H,
      fee: 50,
      prizePool: 5000,
      minAge: 16,
      minRankIndex: 12, // Platino 1 (ver ranks)
      maxTeams: 32,
    },

    kpis: [
      { value: "32 EQUIPOS", label: "224 Atletas Digitales" },
      { value: "$5,000 USD", label: "Prize Pool Oficial", cls: "gold" },
      { value: "360Hz + RTX 4070 Ti", label: "Hardware Stage", cls: "cyan" },
      { value: "500 ASISTENTES", label: "Auditorio Presencial" },
    ],

    ranks: [
      "Hierro 1", "Hierro 2", "Hierro 3", "Bronce 1", "Bronce 2", "Bronce 3",
      "Plata 1", "Plata 2", "Plata 3", "Oro 1", "Oro 2", "Oro 3",
      "Platino 1", "Platino 2", "Platino 3", "Diamante 1", "Diamante 2", "Diamante 3",
      "Ascendente 1", "Ascendente 2", "Ascendente 3", "Inmortal 1", "Inmortal 2", "Inmortal 3", "Radiante",
    ],

    // 8 grupos x 4 equipos, ordenados por seed (1 = cabeza de serie). Equipos de ejemplo.
    groups: {
      A: [["Vortex Protocol", "VXP"], ["Neon Harbinger", "NHB"], ["Crimson Reign", "CRG"], ["Static Phantoms", "STP"]],
      B: [["Obsidian Wolves", "OBW"], ["Pulse Syndicate", "PLS"], ["Iron Mirage", "IRM"], ["Zenith Raiders", "ZNR"]],
      C: [["Cobalt Strike", "CBS"], ["Ghost Circuit", "GCT"], ["Ember Vanguard", "EMV"], ["Helix Order", "HXO"]],
      D: [["Nova Cartel", "NVC"], ["Rift Hunters", "RFH"], ["Saber Division", "SBD"], ["Lunar Syndicate", "LNS"]],
      E: [["Titan Forge", "TNF"], ["Echo Tempest", "ECH"], ["Viper Cell", "VPC"], ["Quantum Rush", "QTR"]],
      F: [["Black Mesa Five", "BMF"], ["Silent Orbit", "SLO"], ["Redline Esports", "RLE"], ["Frost Protocol", "FRP"]],
      G: [["Hydra Gaming", "HYD"], ["Solar Flare", "SLF"], ["Night Circuit", "NTC"], ["Kraken Squad", "KRK"]],
      H: [["Phoenix Dawn", "PHD"], ["Arctic Vector", "ARV"], ["Rogue Signal", "RGS"], ["Onyx Legion", "ONX"]],
    },

    phases: [
      { id: "p1", n: "01", title: "Grupos GSL", day: "Día 1 · Online", body: "8 grupos de 4 equipos en formato Dual Tournament. Bo1 inicial y de ganadores/perdedores; Decider Bo3. Clasifican los 2 mejores de cada grupo (16 equipos)." },
      { id: "p2", n: "02", title: "Playoffs Doble Eliminación", day: "Día 1/2", body: "Upper Bracket Bo3 y Lower Bracket Bo1 hasta la Final del Lower (Bo3). Octavos el sábado; cuartos en adelante, presencial." },
      { id: "p3", n: "03", title: "Gran Final", day: "Día 2 · Presencial", body: "Campeón Upper vs. Campeón Lower en serie Bo5, con ventaja de veto de mapa para el finalista del Upper Bracket." },
    ],

    tiebreakers: [
      "Enfrentamiento directo (Head-to-Head)",
      "Diferencia de rondas ganadas vs. perdidas (Round Differential)",
      "Mayor cantidad de rondas ganadas como Atacante",
      "Partida extra (Tiebreaker) en Armas Cortas / Muerte Repentina",
    ],

    schedule: [
      {
        id: "d1", date: [2026, 11, 14], label: "Jornada 1", sub: "Sáb 14 Nov · Online (Discord / Start.gg)",
        items: [
          { s: "08:00", e: "09:00", t: "Acreditación y Check-In", d: "Validación de 32 capitanes" },
          { s: "09:00", e: "09:30", t: "Reunión de Capitanes / Briefing", d: "Reglas, vetos y sorteo de servidor" },
          { s: "09:30", e: "12:00", t: "Fase de Grupos · Ronda 1", d: "16 partidas simultáneas", bo: "Bo1" },
          { s: "12:00", e: "14:30", t: "Fase de Grupos · Ronda 2", d: "Ganadores y perdedores", bo: "Bo1" },
          { s: "14:30", e: "15:30", t: "Receso Técnico / Almuerzo", d: "" },
          { s: "15:30", e: "18:30", t: "Fase de Grupos · Decider", d: "Definición de los 16 clasificados", bo: "Bo3" },
          { s: "18:30", e: "21:00", t: "Playoffs · Octavos de Final", d: "8 partidas eliminatorias", bo: "Bo1" },
        ],
      },
      {
        id: "d2", date: [2026, 11, 15], label: "Jornada 2", sub: "Dom 15 Nov · Presencial · Arena eSports Nexus",
        items: [
          { s: "09:00", e: "10:00", t: "Llegada de Equipos / Warm-up", d: "Verificación de periféricos y audio" },
          { s: "10:00", e: "10:30", t: "Ceremonia de Apertura", d: "Main Stage / Twitch" },
          { s: "10:30", e: "13:00", t: "Cuartos de Final", d: "Stage A & B en simultáneo", bo: "Bo3" },
          { s: "13:00", e: "15:30", t: "Semifinales Upper Bracket", d: "Main Stage", bo: "Bo3" },
          { s: "15:30", e: "16:30", t: "Showmatch & Activación de Patrocinadores", d: "Dinámicas con los 500 asistentes" },
          { s: "16:30", e: "18:30", t: "Final de Lower Bracket", d: "Main Stage", bo: "Bo3" },
          { s: "18:30", e: "22:30", t: "GRAN FINAL", d: "Main Stage · Broadcast", bo: "Bo5", final: true },
          { s: "22:30", e: "23:00", t: "Ceremonia de Premiación", d: "Trofeo, medallas y MVP" },
        ],
      },
    ],

    requirements: [
      { k: "Edad mínima", v: "16 años cumplidos al 14 de noviembre de 2026. Menores de 18 requieren autorización firmada por su tutor." },
      { k: "Rango mínimo", v: "Platino 1 verificado en Riot ID activo (anti-smurfing), auditado vía Riot API / Tracker." },
      { k: "Plantilla", v: "5 titulares + hasta 2 suplentes por equipo (máx. 224 jugadores en total)." },
      { k: "Cuota", v: "$50 USD por equipo vía Stripe, PayPal o transferencia corporativa." },
    ],

    rules: [
      { cat: "Elegibilidad", t: "Edad mínima", d: "16 años cumplidos al 14 de noviembre de 2026. Los menores de 18 deben adjuntar autorización legal firmada por su tutor." },
      { cat: "Elegibilidad", t: "Rango mínimo (anti-smurf)", d: "Platino 1 verificado en un Riot ID activo. Se audita historial competitivo, nivel de cuenta y rango para evitar cuentas secundarias." },
      { cat: "Elegibilidad", t: "Plantilla", d: "5 titulares y hasta 2 suplentes registrados. Solo un suplente registrado puede ingresar durante una serie." },
      { cat: "Formato", t: "Fase de grupos GSL", d: "32 equipos en 8 grupos de 4. Bo1 en partidas iniciales y de ganadores/perdedores; Decider Bo3. Clasifican los 2 mejores de cada grupo." },
      { cat: "Formato", t: "Playoffs", d: "Doble eliminación para 16 equipos. Upper Bracket Bo3; Lower Bracket Bo1 hasta la Final de Lower Bracket (Bo3)." },
      { cat: "Formato", t: "Gran Final", d: "Campeón Upper vs. Campeón Lower en Bo5. El finalista proveniente del Upper Bracket tiene ventaja de veto de mapa." },
      { cat: "Formato", t: "Check-in de partida", d: "Cada cruce abre sala privada en Discord (por ejemplo #mesa-partida-01) con check-in 15 minutos antes del inicio." },
      { cat: "Hardware", t: "Equipos provistos", d: "La organización provee PC y monitor en la Arena. Cada jugador lleva ratón, teclado, alfombrilla y auriculares propios." },
      { cat: "Hardware", t: "Auriculares", d: "Solo auriculares analógicos jack 3.5mm. Se prohíben auriculares USB con software o ecualización externa." },
      { cat: "Hardware", t: "Periféricos prohibidos", d: "Macros por hardware o software, Snap Tap / Rapid Trigger no homologado, botones turbo y scripts de retroceso." },
      { cat: "Protocolo técnico", t: "Desconexión temprana (< 30 s)", d: "Si ocurre antes de que haya daño entre jugadores: Remake obligatorio con los mismos agentes y mapa." },
      { cat: "Protocolo técnico", t: "Desconexión prolongada (> 30 s)", d: "La ronda en curso continúa. Al terminar, pausa técnica de hasta 10 minutos acumulados por mapa." },
      { cat: "Protocolo técnico", t: "Latencia / ping alto (fase online)", d: "Con más de 100 ms constantes, el equipo dispone de 10 minutos para ingresar a un suplente registrado o continuar con 4 jugadores." },
      { cat: "Protocolo técnico", t: "Tiempos de juego", d: "Ronda 100 s · Compra 30 s · Spike 45 s · Tiempo muerto táctico: 1 por equipo y mapa, de 60 s." },
      { cat: "Fair Play", t: "Cero tolerancia", d: "Hacks, aimbots, wallhacks, colusión o amaños y agresiones físicas o verbales implican descalificación, veto permanente y confiscación total de premios." },
      { cat: "Fair Play", t: "Puntualidad", d: "Un retraso de hasta 5 minutos en el check-in recibe advertencia; más de 10 minutos implica penalización." },
    ],

    sanctions: [
      { n: 1, name: "Advertencia", when: "Retraso ≤ 5 min o conducta antideportiva menor." },
      { n: 2, name: "Penalización", when: "Pérdida de fase de vetos o −3 rondas en el mapa actual. Aplica por reincidencia o retraso > 10 min." },
      { n: 3, name: "Derrota 13-0", when: "Insultos graves, pausas injustificadas reiteradas o negación a jugar." },
      { n: 4, name: "Descalificación y Veto", when: "Hacks, Aimbots, Wallhacks, colusión o agresiones. Veto permanente y confiscación total de premios." },
    ],

    hardware: [
      { k: "Estaciones", v: "10 PCs Stage (2 stages de 5)" },
      { k: "CPU", v: "Intel Core i7-13700K / AMD Ryzen 7 7800X3D" },
      { k: "Memoria", v: "32 GB DDR5" },
      { k: "GPU", v: "NVIDIA GeForce RTX 4070 Ti" },
      { k: "Almacenamiento", v: "SSD NVMe 1 TB" },
      { k: "Monitor", v: "ZOWIE XL2566K · 240/360 Hz · DyAc⁺ · 0.5 ms" },
      { k: "Escenario visual", v: "3 pantallas LED P2.5" },
      { k: "Periféricos", v: "Ratón, teclado, alfombrilla y auriculares jack 3.5 mm: propios del jugador" },
    ],

    wan: [
      { k: "Enlace principal", v: "Fibra dedicada simétrica 1 Gbps" },
      { k: "Respaldo", v: "4G/5G Enterprise con Failover automático" },
      { k: "Energía", v: "UPS Online de doble conversión · 30 min de autonomía" },
    ],

    vlans: [
      { id: "VLAN 10", name: "Competidores Stage", metric: "< 15 ms", d: "Stage A & B. Prioridad máxima de QoS, aislamiento estricto entre clientes y latencia objetivo menor a 15 ms hacia los servidores oficiales de VALORANT." },
      { id: "VLAN 20", name: "Broadcast / Casters", metric: "50 Mbps", d: "50 Mbps dedicados con IP fija pública para los encoders de transmisión." },
      { id: "VLAN 30", name: "Staff y Arbitraje", metric: "Privada", d: "Red privada para jueces, mesa de control y prensa acreditada." },
      { id: "VLAN 40", name: "Wi-Fi Público", metric: "5 Mbps/usuario", d: "Wi-Fi aislado con rate-limiting de 5 Mbps por dispositivo para no saturar el enlace principal." },
    ],

    zones: [
      { id: "a", key: "Stage A", sub: "5 PCs", d: "Cabina insonorizada con 5 PCs, líneas Ethernet directas y circuito eléctrico independiente." },
      { id: "b", key: "Stage B", sub: "5 PCs", d: "Cabina insonorizada con 5 PCs, líneas Ethernet directas y circuito eléctrico independiente." },
      { id: "c", key: "Broadcast Studio", sub: "2 croma · 3 PTZ 4K", d: "Escritorio de transmisión VIP/Casters, 2 croma keys, iluminación LED profesional, 3 cámaras PTZ 4K y consolas de audio independientes." },
      { id: "d", key: "Auditorio", sub: "500 asistentes", d: "Gradas ergonómicas para 500 asistentes, pantalla LED gigante central, sonido surround y zona de activación de marcas." },
      { id: "r", key: "Sala de Arbitraje", sub: "4 estaciones réplica", d: "Oficina privada con 4 estaciones de monitoreo con réplica directa de las partidas en tiempo real." },
    ],

    broadcast: [
      { k: "Plataformas", v: "Twitch y YouTube" },
      { k: "Calidad", v: "1080p / 60 FPS" },
      { k: "Software", v: "OBS Studio / vMix · NDI · NVENC" },
      { k: "Overlays API", v: "Marcador de series, Map Veto en vivo y estadísticas K/D/A, ACS y economía, alimentados desde Start.gg / Battlefy" },
      { k: "Comercial", v: "Logos Silver en overlays, banners Bronze rotativos y spot de 30 s para Gold entre mapas" },
    ],

    prizes: [
      { place: 1, pct: 50, perks: ["Trofeo Máximo APEX", "Medallas de Oro", "Cupo Regional Tier-1"] },
      { place: 2, pct: 25, perks: ["Medallas de Plata", "Licencias de periféricos"] },
      { place: 3, pct: 15, perks: ["Medallas de Bronce", "Kits de marcas aliadas"] },
      { place: 4, pct: 10, perks: ["Diploma de Honor", "Pases de temporada"] },
    ],
    mvp: "Trofeo individual MVP + Teclado/Ratón del Patrocinador Gold",

    sponsors: [
      { tier: "gold", name: "Gold Sponsor", price: "$3,500 USD", perks: ["Logo en camiseta oficial", "Mención por mapa de los casters", "Stand de 20 m² en la Arena", "Comercial de 30 s en el stream", "Aporte del Kit MVP"] },
      { tier: "silver", name: "Silver Sponsor", price: "$1,500 USD", perks: ["Logo secundario en overlays", "Banner en la Arena", "Presencia en fotocall oficial", "Menciones en redes sociales"] },
      { tier: "bronze", name: "Bronze Sponsor", price: "$500 USD / In-Kind", perks: ["Logo en la web oficial", "Productos en Welcome Kits", "Sorteos en vivo en stream y Showmatch"] },
    ],

    committee: [
      { name: "Carlos Mendoza", role: "Director General del Evento", email: "direccion@apexmasters.com" },
      { name: "Sofia Arismendi", role: "Head Referee", email: "arbitraje@apexmasters.com" },
      { name: "Ing. Roberto Gómez", role: "Coordinador de Infraestructura", email: "tech@apexmasters.com" },
      { name: "Valentina Ríos", role: "Community & Broadcast Manager", email: "prensa@apexmasters.com" },
    ],
    credits: "Comité Organizador Multidisciplinario de eSports & Nexus Tech — Jorge Garcia, Erwin Ortiz, Santiago Candanoza.",

    // Reemplazar por los enlaces oficiales cuando existan.
    links: [
      { label: "Discord Oficial", href: "https://discord.com" },
      { label: "Start.gg", href: "https://www.start.gg" },
      { label: "Twitch", href: "https://www.twitch.tv" },
      { label: "YouTube", href: "https://www.youtube.com" },
    ],
  };
})((window.APEX = window.APEX || {}));
