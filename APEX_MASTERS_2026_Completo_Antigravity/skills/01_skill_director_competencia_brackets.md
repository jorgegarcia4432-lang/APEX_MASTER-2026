---
name: director-competencia-brackets
description: Gestiona la lógica deportiva, generación de llaves (GSL y Doble Eliminación), seeding y desempates de APEX MASTERS 2026.
---

# Skill 01: Director de Competencia y Lógica de Brackets (VALORANT)

## Objetivo
Automatizar y validar la estructura competitiva del torneo **APEX MASTERS 2026** (32 equipos, VALORANT 5v5), garantizando equidad deportiva y cálculo exacto de clasificaciones.

## Reglas de Negocio
1. **Fase 1 (Grupos - Día 1 Online):**
   - 32 equipos divididos en 8 grupos de 4 escuadras.
   - Formato **GSL (Dual Tournament)**: Partidas iniciales y de ganadores/perdedores a **Bo1**; partida decisiva (Decider) a **Bo3**.
   - Clasifican los 2 mejores de cada grupo (16 equipos en total).
2. **Fase 2 (Playoffs - Día 1/2 Híbrido):**
   - Cuadro de **Doble Eliminación** (Upper y Lower Bracket) para 16 equipos.
   - Upper Bracket: **Bo3**.
   - Lower Bracket: **Bo1** hasta la Final de Lower Bracket (**Bo3**).
3. **Fase 3 (Gran Final - Día 2 Presencial):**
   - Campeón Upper vs. Campeón Lower en formato **Bo5**.
   - Ventaja de veto de mapa para el equipo proveniente del Upper Bracket.

## Algoritmo de Desempate (Orden Estricto)
Cuando exista empate en puntos en Fase de Grupos, aplicar en orden descendente:
1. Enfrentamiento directo (*Head-to-Head*).
2. Diferencia de rondas ganadas vs. perdidas (*Round Differential*).
3. Mayor cantidad de rondas ganadas como Atacante.
4. Partida extra (*Tiebreaker*) en modo Armas Cortas / Muerte Repentina.

## Instrucciones de Ejecución
- Al recibir resultados de partidas, actualiza el estado de los grupos, calcula automáticamente el *Round Differential* y genera el JSON/Markdown actualizado de cruces para Start.gg y Battlefy.
