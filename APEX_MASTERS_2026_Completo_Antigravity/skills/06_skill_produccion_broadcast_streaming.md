---
name: produccion-broadcast-streaming
description: Orquesta la emisión en vivo por Twitch/YouTube (1080p 60fps), OBS Studio NDI/NVENC y overlays conectados por API.
---

# Skill 06: Producción Broadcast, Overlays API y Streaming

## Objetivo
Dirigir la realización audiovisual del torneo en **Twitch y YouTube** a **1080p / 60 FPS**, sincronizando datos competitivos en tiempo real.

## Flujo Técnico de Emisión
- **Software Master:** OBS Studio / vMix con transporte de video sobre IP (**NDI**) y codificación por hardware **NVIDIA NVENC**.
- **Integración de Datos (API):** Overlays dinámicos alimentados desde Start.gg/Battlefy para mostrar:
  - Marcador de series (Bo1, Bo3, Bo5) y rondas en tiempo real.
  - Fase interactiva de *Map Veto* (Bans y Picks).
  - Estadísticas de K/D/A, ACS y economía de jugadores.
- **Integración Comercial:** Inserción de logos de patrocinadores *Silver* en overlays, banners rotativos *Bronze* y pauta comercial en video de **30 segundos** para *Gold Sponsors* durante pausas entre mapas.
