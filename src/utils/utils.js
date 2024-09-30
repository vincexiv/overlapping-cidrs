function cidrValidity(cidr){
    if(typeof cidr !== 'string'){
        return { valid: false, message: ''}
    } else {
        const splitted = cidr.split('/')
        const [a, b, c, d, err] = splitted[0].split('.')
        if(err){
            return { okay: false, error: 'Invalid net address'}
        }

        const e = splitted[1]

        for(const x of [a, b, c, d]){
            if(x.match(/0+\d+/)){ // No leading zeros allowed. Example is 10.001.000.0/16 (should be 10.1.0.0/16)
                return { okay: false, error: 'Invalid net address'}
            } else {
                let bin = parseInt(x).toString(2)
                if(x < 0 || x > 256 || bin === 'NaN'){
                    return { okay: false, error: 'Invalid net address'}
                } 
            }
        }
        
        if(!e || e < 0 || e > 32){
            return { okay: false, error: 'Invalid net mask'}
        } else if(e.match(/0+\d+/)){ // No leading zeros allowed. Example is 10.0.0.0/0021 (should be 10.0.0.0/21)
            return { okay: false, error: 'Invalid net mask' }
        }

        return { okay: true, error: ''}
    }
}

function replaceValues(ip_address_binary, net_mask_decimal, value) {
    let binary_array = ip_address_binary.split('')
    let i = 32 - parseInt(net_mask_decimal)
    while(i > 0){
        binary_array[ip_address_binary.length - i] = value
        i--
    }
    return binary_array.join('')  
}

function getIpRangeDecimal(ip_address_binary, net_mask_decimal){
    const min_binary = replaceValues(ip_address_binary, net_mask_decimal, 0)
    const max_binary = replaceValues(ip_address_binary, net_mask_decimal, 1)
    return {
        min: parseInt(min_binary, 2),
        max: parseInt(max_binary, 2)
    }
}

function getIpAddressBinary(cidr){
    const splitted = cidr.split('/')
    const [a, b, c, d] = splitted[0].split('.')
    
    let binary = ''
    for(const x of [a, b, c, d]){
        let bin = parseInt(x).toString(2)
        while(bin.length < 8){
            bin = '0' + bin
        }
        binary += bin
    }

    return binary
}

function rangeOverlap(range1, range2){
    if(range2.min < range1.min || range2.max < range1.max){
        const temp = range1
        range1 = range2
        range2 = temp
    }

    return range1.max >= range2.min ? range1.max - range2.min + 1 : 0
}

function checkMatch(cidrs){
    const {cidr_1, cidr_2} = cidrs

    const cidr_1_validity = cidrValidity(cidr_1)
    const cidr_2_validity = cidrValidity(cidr_2)

    if(!cidr_1_validity.okay){
        return {message: `CIDR 1: ${cidr_1_validity.error}`, state: 'error'}
    } else if(!cidr_2_validity.okay){
        return {message: `CIDR 2: ${cidr_2_validity.error}`, state: 'error'}
    } else {
        const cidr_1_binary = getIpAddressBinary(cidr_1)
        const cidr_2_binary = getIpAddressBinary(cidr_2)

        const cidr_1_net_mask = cidr_1.split("/")[1]
        const cidr_2_net_mask = cidr_2.split("/")[1]

        const cidr_1_range = getIpRangeDecimal(cidr_1_binary, cidr_1_net_mask)
        const cidr_2_range = getIpRangeDecimal(cidr_2_binary, cidr_2_net_mask)

        const overlap = rangeOverlap(cidr_1_range, cidr_2_range)
        if(overlap){
            return {message: `The CIDR blocks overlap. They share ${overlap.toLocaleString()} ip addresses`, state: 'error'}
        } else {
            return {message: 'The CIDR blocks don\'t overlap', state: 'okay'}
        }
    }
}

export { checkMatch }