const inputEl = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const outputParagraph = document.getElementById("output");

// Sub-function 1: checks whether the input is valid
const isInputValid = (input) => {
  if (isNaN(input)) {
    outputParagraph.textContent = "Please enter a valid number";
    toggleOutput();
    inputEl.value = "";
    return false;
  } else if (input === 0) {
    outputParagraph.textContent =
      "There is no zero(0) in the Roman numeral system";
    toggleOutput();
    inputEl.value = "";
    return false;
  } else if (input === 1 || input < 0) {
    outputParagraph.textContent =
      "Please enter a number greater than or equal to 1";
    toggleOutput();
    inputEl.value = "";
    return false;
  } else if (input >= 4000) {
    outputParagraph.textContent =
      "Please enter a number less than or equal to 3999";
    toggleOutput();
    inputEl.value = "";
    return false;
  }

  return true;
};

// Sub-function 2: check whether the tempArr includes 4 or more identical roman numbers. If so, it needs to be converted again respectively later. Here in this function, it should tell a) which roman numeral is being repeated and b) how many times does it repeat
const checkFourOrMore = (tempArr) => {
  const matchFourOrMore = tempArr.join("").match(/.{4,}/);
  let repeatedRomanNumeral;
  if (!matchFourOrMore) return;
  repeatedRomanNumeral = matchFourOrMore[0].split("")[0];
  return [matchFourOrMore[0].length, repeatedRomanNumeral];
};

// Sub-function 3: According to the result of the sub-function 2, if the tempArr includes 4, 5 or 6-9 roman numerals (special case 9), convert it one more time. This function should return a new array, that replaces the current tempArr and will be added to the resultArr later on.
const convertFourOrMore = ([
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
    let romanNumIndex = (inputIntArr.length - 1) * 2;
    const romanNumArr = ["I", "V", "X", "L", "C", "D", "M"];
    let tempArr = [];
    let resultArr = [];

    // 2. outer for-loop, loops through the input digits from left to right ( from biger place value to smaller place value )
    for (let i = 0; i < inputIntArr.length; i++) {
      //inner for-loop, convert digit one by one
      for (let x = 0; x < inputIntArr[i]; x++) {
        tempArr.unshift(romanNumArr[romanNumIndex]);
      } //end of the inner for-loop

      // before the next digit being converted, the Sub-function 2 and 3 checks/handles repetition, than add the inhalt of the tempArr to the resultArr.
      if (checkFourOrMore(tempArr)) {
        tempArr = convertFourOrMore([
          ...checkFourOrMore(tempArr),
          romanNumArr,
          tempArr,
        ]);
      }
      //add tempArr to the resultArr and reset tempArr
      resultArr = resultArr.concat(tempArr);
      tempArr = [];
      //update also the roman numeral index (move two steps to the left, because the roman numerals in our array have a step of 5 instead 10 and just like the digit being handled, it shall move from biger value  to smaller value)
      romanNumIndex -= 2;
    }

    outputParagraph.textContent = `${inputEl.value} => ${resultArr.join("")}`;
    toggleOutput();
    inputEl.value = "";
  }
};
convertBtn.addEventListener("click", (e) => convertToRomanNumeral(e));
inputEl.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    convertToRomanNumeral(e);
  }
});
