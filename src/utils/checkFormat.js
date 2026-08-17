const checkGLC = (id, name) => {
    if (name.includes(" ex")) return false;
    if (name.includes(" V")) return false;
    if (name.includes(" EX")) return false;
    if (name.includes("-EX")) return false;
    if (name.includes("VMAX")) return false;
    if (name.includes(" GX")) return false;
    if (name.includes("BREAK")) return false;
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
    }
    return true;
}

export function checkFormat(legal, id = null, name = "") {
    if (legal === undefined || legal === null || !legal) {
        return 'other'
    }
    if (legal.standard === true) {
        return 'standard';
    } else if (legal.standard === false && legal.expanded === true) {
        return checkGLC(id, name) ? 'expandedglc' : 'expanded';
    } else if (legal.standard === false && legal.expanded === false) {
        return checkGLC(id, name) ? 'glc' : 'ilegal';
    }
    return 'other'
}