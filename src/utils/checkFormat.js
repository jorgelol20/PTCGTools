export function checkFormat (legal) {
    if(legal === undefined){
        return 'other'
    }
    if(legal.standard === true){
        return 'standard';
    }else if(legal.standard === false && legal.expanded === true){
        return 'expanded';
    }else if(legal.standard === false && legal.expanded === false){
        return 'ilegal';
    }
    return 'other'
}