// src/utils/parseDeckList.js

const basicEnergies = new Set([
    "Energía Lucha", "Fight Energy", "Energía Incolora", "Colorless Energy",
    "Energía Oscura", "Darkness Energy", "Dark Energy", "Energía Fuego",
    "Fire Energy", "Energía Planta", "Grass Energy", "Energía Rayo",
    "Lightning Energy", "Energía Psíquica", "Psychic Energy", "Energía Agua",
    "Water Energy", "Energía Metálica", "Metal Energy", "Energía Hada", "Fairy Energy"
]);

export function parseDeckList(text) {
    return text.split('\n')
        .filter((lane) => {
            const trimedLane = lane.trim();
            return !(trimedLane.includes("Pokémon: ") || trimedLane.includes("Pokemon: ") ||
                     trimedLane.includes("Trainer: ") || trimedLane.includes("Entrenador: ") ||
                     trimedLane.includes("Energy: ") || trimedLane.includes("Energía: ") ||
                     trimedLane === "" || trimedLane.includes("Cartas totales: ") ||
                     trimedLane.includes("Total Cards: "));
        })
        .map((card) => {
            card = card.trim();
            // El último grupo captura el número + un sufijo de letra opcional (se descarta)
            const match = card.match(/^(\d+)\s+(.+?)\s+([A-Z\d-]{2,})\s+(\d+)[a-zA-Z]?$/i);
            let returnCard = undefined;
            if (match !== null) {
                if (match[2].includes('Energy') || match[2].includes('Energía')) {
                    const isBasicEnergy = basicEnergies.has(match[2]) ||
                        /^Basic \{[A-Z]\} Energy$/.test(match[2]) ||
                        /^Basic \{[A-Z]\} Energy Energy$/.test(match[2]);
                    returnCard = isBasicEnergy
                        ? { quantity: match[1], name: match[2] }
                        : { quantity: match[1], name: match[2], expansion: match[3], number: match[4] };
                } else {
                    returnCard = { quantity: match[1], name: match[2], expansion: match[3], number: match[4] };
                }
            }
            return returnCard;
        });
}