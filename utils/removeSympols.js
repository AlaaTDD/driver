
function removeSymbolsFromNumber(number) {
    const numberString = number.toString();
    const cleanNumberString = numberString.replace(/[^\d.]/g, '');
    const cleanNumber = parseFloat(cleanNumberString);
    return cleanNumber;
  }

module.exports = removeSymbolsFromNumber;