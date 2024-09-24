const inputEl = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const outputParagraph = document.getElementById("output");

// Sub-function 1: checks whether the input is valid
const isInputValid = (input) => {
  if (isNaN(input)) {
    outputParagraph.textContent = "Please enter a valid number";
    toggleOutput();
    return false;
  } else if (input === 0) {
    outputParagraph.textContent =
      "There is no zero(0) in the Roman numeral system";
    toggleOutput();
    return false;
  } else if (input === 1 || input < 0) {
    outputParagraph.textContent =
      "Please enter a number greater than or equal to 1";
    toggleOutput();
    return false;
  } else if (input >= 4000) {
    outputParagraph.textContent =
      "Please enter a number less than or equal to 3999";
    toggleOutput();
    return false;
  }

  return true;
};

// Sub-function 2: check whether the tempArr includes 4, 5 or 6-9 identical roman numbers. If so, it needs to be converted again respectively later. Here in this function, it should tell a) which roman numeral is being repeated and b) how many times does it repeat
const checkFourFiveOrMore = (tempArr) => {
  const matchFour = tempArr.join("").match(/.{4}/);
  const matchFive = tempArr.join("").match(/.{5}/);
  const matchMoreThanFive = tempArr.join("").match(/.{6,}/);
  let repeatedRomanNumeral;
  if (matchMoreThanFive) {
    repeatedRomanNumeral = matchMoreThanFive[0].split("")[0];
    return [matchMoreThanFive[0].length, repeatedRomanNumeral];
  } else if (matchFive) {
    repeatedRomanNumeral = matchFive[0].split("")[0];
    return [5, repeatedRomanNumeral];
  } else if (matchFour) {
    repeatedRomanNumeral = matchFour[0].split("")[0];
    return [4, repeatedRomanNumeral];
  }
  return false;
};

// Sub-function 3: According to the result of the sub-function 2, if the tempArr includes 4, 5 or 6-9 roman numerals (special case 9), convert it one more time. This function should return a new array, that replaces the current tempArr and will be added to the resultArr later on.
const convertFourFiveOrMore = ([
  repeatTimes,
  repeatedRomanNumeral,
  romanNumArr,
  tempArr,
]) => {
  if (repeatTimes === 4) {
    // IIII => IV
    return tempArr
      .slice(3)
      .concat(
        Array.from(romanNumArr[romanNumArr.indexOf(repeatedRomanNumeral) + 1])
      );
  } else if (repeatTimes === 5) {
    // IIIII => V
    return Array.from(
      romanNumArr[romanNumArr.indexOf(repeatedRomanNumeral) + 1]
    );
  } else if (repeatTimes >= 6) {    
    // IIIIIIIII (9 * I) ? IX : VIII (by 8 * I)
    return tempArr.slice(5).length === 4
      ? tempArr
          .slice(8)
          .concat(
            Array.from(
              romanNumArr[romanNumArr.indexOf(repeatedRomanNumeral) + 2]
            )
          )
      : Array.from(
          romanNumArr[romanNumArr.indexOf(repeatedRomanNumeral) + 1]
        ).concat(tempArr.slice(5));
  }
};

// Sub-function 4: show/hide ouputParagraph
const toggleOutput = () =>
  outputParagraph.textContent
    ? (outputParagraph.style.opacity = "1")
    : (outputParagraph.style.opacity = "0");

// Main function
const convertToRomanNumeral = (e) => {
  const inputInt =
    e.code === "Enter"
      ? parseInt(e.target.value)
      : parseInt(e.target.previousElementSibling.value);
  if (isInputValid(inputInt)) {
    // 1. initialization
    const inputIntArr = inputInt.toString().split("");
    let romanNumIndex = 0;
    const romanNumArr = ["I", "V", "X", "L", "C", "D", "M"];
    let tempArr = [];
    let resultArr = [];

    // 2. outer for-loop, loops through the length of the input digits, index from big to small => digits from right to left (in inner for-loop)
    for (let i = inputIntArr.length - 1; i >= 0; i--) {
      //inner for-loop, convert digit one by one, from right to left
      for (let x = 0; x < inputIntArr[i]; x++) {
        tempArr.unshift(romanNumArr[romanNumIndex * 2]); //index must be doubled, because the roman numerals in our initialized array have a step of 5 instead of 10
      }

      // Sub-function 2 and 3, check/convert repetition before the inhalt of the tempArr being added to the resultArr. Then beginns the next round of outer for-loop (next digit)
      if (checkFourFiveOrMore(tempArr)) {
        tempArr = convertFourFiveOrMore([
          ...checkFourFiveOrMore(tempArr),
          romanNumArr,
          tempArr,
        ]);
      } //end of inner for-loop 

      //add tempArr to the begin of the resultArr and reset tempArr
      resultArr = tempArr.concat(resultArr);
      tempArr = [];
      //as the digit being converted proceeds from right to left, update also the roman numeral to the next one
      romanNumIndex++;
    }

    outputParagraph.textContent = resultArr.join("");
    toggleOutput();
  }
};
convertBtn.addEventListener("click", (e) => convertToRomanNumeral(e));
inputEl.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    convertToRomanNumeral(e);
  }
});
