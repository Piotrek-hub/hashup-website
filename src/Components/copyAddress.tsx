export const copyAddress = (mainAccountAddress: string) => {
    let splitedAddress = mainAccountAddress.split('');
    let shortAddress1 = [];
    let shortAddress2 = [];

    for(let i = 0; i < 4; i++)
        shortAddress1.push(splitedAddress[i]);
    for(let i = splitedAddress.length - 1; i > splitedAddress.length - 5; i--)
        shortAddress2.push(splitedAddress[i]);

    let fullAddress = shortAddress1.join('') + "..." + shortAddress2.join('');
    return fullAddress;
}