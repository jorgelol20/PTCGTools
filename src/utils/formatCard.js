export function formatCard (card, language) {
    console.log("Miau")
    if (card != null && card != undefined) {
        if (card.name) {
            return card;
        }
        if (card[0].id === "sv04-175") {
            card[0].category = "Pokémon";
            card[0].stage = t('basic');
        }
        switch (card[0].category) {
            case "Pokémon":
            case "Pokemon":
                if (card[0].abilities) {
                    if (card[0].id === "me01-028") {
                        card[0].stage = t('basic');
                    }
                    return {
                        name: card[0].name,
                        expansion: card[0].set.name,
                        cardNumber: card[0].localId,
                        cardId: card[0].id,
                        category: card[0].category,
                        pokemonType: card[0].stage,
                        rarity: card[0].rarity,
                        abilitieText: card[0].abilities.effect,
                        image: card[0].image + '/low.webp',
                        quantity: card[1],
                        productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                        avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                        lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                        productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                        avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                        lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                        isFallbackLanguage: card[2] ?? false,
                        language: language,
                        legal: card[0].legal
                    }
                } else {
                    return {
                        name: card[0].name,
                        expansion: card[0].set.name,
                        cardNumber: card[0].localId, 
                        cardId: card[0].id,
                        category: card[0].category,
                        pokemonType: card[0].stage,
                        rarity: card[0].rarity,
                        image: card[0].image + '/low.webp',
                        quantity: card[1],
                        productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                        avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                        lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                        productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                        avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                        lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                        isFallbackLanguage: card[2] ?? false,
                        language: language,
                        legal: card[0].legal
                    }
                }
            default:
                return {
                    name: card[0].name,
                    expansion: card[0].set.name,
                    cardNumber: card[0].localId,
                    cardId: card[0].id,
                    category: card[0].category,
                    rarity: card[0].rarity,
                    image: card[0].image + '/low.webp',
                    quantity: card[1],
                    productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                    avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                    lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                    productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                    avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                    lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                    isFallbackLanguage: card[2] ?? false,
                    language: language,
                    legal: card[0].legal
                }
        }
    }
    return undefined;
}