---
name: arquitectura-red-lan-vlans
description: Diseña, audita y configura la topología de red LAN/WAN, segmentación VLAN L3, QoS y respaldo eléctrico UPS de la Arena.
---

# Skill 04: Arquitectura de Red LAN/WAN y Respaldo Eléctrico

## Objetivo
Garantizar latencia ultra-baja (< 15 ms), cero pérdida de paquetes y alta disponibilidad energética en **Arena eSports Nexus**.

## Especificaciones de Conectividad WAN
- **Enlace Principal:** Fibra óptica dedicada simétrica de **1 Gbps** (subida/bajada).
- **Redundancia:** Enlace secundario **4G/5G Enterprise** con conmutación automática (*Failover*).

## Topología de Segmentación VLAN (Switches Administrables L3)
- **VLAN 10 (Competidores - Stage A & B):** Prioridad máxima QoS, aislamiento estricto entre clientes, latencia objetivo **< 15 ms** hacia servidores oficiales de VALORANT.
- **VLAN 20 (Broadcast / Casters):** Ancho de banda garantizado de **50 Mbps dedicados** con IP pública fija para encoders de transmisión.
- **VLAN 30 (Staff y Arbitraje):** Red privada para jueces, mesa de control y prensa acreditada.
- **VLAN 40 (Público / Asistentes):** Red Wi-Fi aislada con *rate-limiting* de **5 Mbps por dispositivo** para evitar saturación del enlace principal.

## Respaldo Energético (UPS)
- Protección mediante sistemas **UPS Online de doble conversión** con autonomía mínima de **30 minutos** cubriendo las 10 estaciones Stage, switches L3 y mesa de producción.
