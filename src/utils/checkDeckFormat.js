import expansionDictionary from '../assets/db/expansionSet.json';
const sets = Object.entries(expansionDictionary);
const invalidExpandedSets = sets.slice(0, 75).map(key => key[1]);

const checkEnergy = (card) => {
        switch (card) {
            case "Energía Lucha":
            case "Fight Energy":
            case "Fighting Energy":
            case "Energía Oscura":
            case "Darkness Energy":
            case "Energía Fuego":
            case "Fire Energy":
            case "Energía Planta":
            case "Grass Energy":
            case "Energía Rayo":
            case "Lightning Energy":
            case "Energía Psíquica":
            case "Psychic Energy":
            case "Energía Agua":
            case "Water Energy":
            case "Energía Metálica":
            case "Metal Energy":
            case "Energía Hada":
            case "Fairy Energy":
                return true;
            default:
                return false;
        }
    }

const checkCardsQuantity = (deck) => {
    let isValidDeck = true;
    deck.map((card) => {
        if (card.cardId != null && !checkEnergy(card.name)) {
            if (card.quantity > 4) {
                isValidDeck = false;
            }
        }
    });
    return isValidDeck;
}




const checkGLCCardsQuantity = (deck) => {
    let isGlcDeck = true;
    deck.map((card) => {
        if (card.cardId != null && !checkEnergy(card.name)) {
            if (card.quantity > 1) {
                isGlcDeck = false;
            }
        }
    });
    return isGlcDeck;
}
const glcBannedCards = (id) => {
    if (id == undefined) return true
    switch (id) {
        case 'xy4-99':
        case 'xy4-118':
        case 'sm5-114':
        case 'xy7-74':
        case 'sm7-133':
        case 'sma-SV85':
        case 'swsh4.5-21':
        case 'hgss1-103':
        case 'xy1-130':
        case 'bw11-113':
        case 'xy4-111':
        case 'base4-124':
        case 'xy10-114':
        case 'sm1-136':
        case 'sm2-166':
        case 'g1-74':
        case 'xy12-90':
        case 'bw4-92':
        case 'base1-96':
            return false;
        default:
            return !invalidExpandedSets.includes(id.split('-')[0])
    }
}

export function checkDeckFormat(deck) {
    if (deck === null) {
        return false
    }
    const cardsNum = deck.reduce((cont, card) => cont + (Number(card?.quantity) || 0),
        0);
    if (cardsNum !== 60) return [false, false, false]
    let isStandard = checkCardsQuantity(deck);
    let isExpanded = checkCardsQuantity(deck);
    let isGlc = true;
    deck.map((card) => {
        if (card?.legal != null) {
            if (card.legal.standard === false) {
                isStandard = false;
            }
            if (card.legal.expanded === false) {
                isExpanded = false;
                if (!glcBannedCards(card.cardId)) {
                    isGlc = false;
                }
            }
        }
    });
    isGlc = checkGLCCardsQuantity(deck);
    return [isStandard, isExpanded, isGlc]
}