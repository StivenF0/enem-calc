import { calculateAverage } from "./average";
import { setPassingScoreStatus } from "./passingScore";
import { objectMap } from "./utils";

const passingScoreCheckElement = document.querySelector("#passingScoreCheck");
const passingScoreInputElement = document.querySelector("#passingScore");
const calculateButton = document.querySelector("#calculateButton");
const resultDialogElements = document.querySelectorAll("#result");
const correctCountInputs = {
  LT: document.querySelector("#correctAnswers #LT"),
  CH: document.querySelector("#correctAnswers #CH"),
  CN: document.querySelector("#correctAnswers #CN"),
  MT: document.querySelector("#correctAnswers #MT"),
  R: document.querySelector("#correctAnswers #R"),
};
const disciplineWeightsInputs = {
  LT: document.querySelector("#disciplineWeight #LT"),
  CH: document.querySelector("#disciplineWeight #CH"),
  CN: document.querySelector("#disciplineWeight #CN"),
  MT: document.querySelector("#disciplineWeight #MT"),
  R: document.querySelector("#disciplineWeight #R"),
};
const scoreMinMaxInputs = {
  LT: [
    document.querySelector("#scoreMinMax #LTMIN"),
    document.querySelector("#scoreMinMax #LTMAX"),
  ],
  CH: [
    document.querySelector("#scoreMinMax #CHMIN"),
    document.querySelector("#scoreMinMax #CHMAX"),
  ],
  CN: [
    document.querySelector("#scoreMinMax #CNMIN"),
    document.querySelector("#scoreMinMax #CNMAX"),
  ],
  MT: [
    document.querySelector("#scoreMinMax #MTMIN"),
    document.querySelector("#scoreMinMax #MTMAX"),
  ],
};

const settings = {
  defaults: {
    disciplineWeight: 1,
    minmax: {
      LT: [300.58, 801],
      CH: [323.29, 839.2],
      CN: [344.49, 875.3],
      MT: [372.59, 985.7],
    },
  },
  hasPassingScore: false,
};

passingScoreCheckElement.addEventListener("click", (e) => {
  // Function that resolves the status of the passing score input field.
  setPassingScoreStatus(e.target.checked, passingScoreInputElement);
  settings.hasPassingScore = e.target.checked;
});

calculateButton.addEventListener("click", () => {
  const result = calculateAverage(
    getCorrectCount(),
    getDisciplineWeights(),
    getDisciplineMinMax()
  );

  const passingScore = parseFloat(passingScoreInputElement.value);
  showResult(result, settings.hasPassingScore, passingScore);
});

function getCorrectCount() {
  const currentCount = objectMap(correctCountInputs, (elem) => {
    let value = parseInt(elem.value);
    if (!value) throw new Error("One of the fields were not filled in!");
    if (isNaN(value)) throw new Error("Not a Number!");
    return value;
  });
  return currentCount;
}

function getDisciplineWeights() {
  const currentWeights = objectMap(disciplineWeightsInputs, (elem) => {
    let value = parseFloat(elem.value);
    if (!value) value = settings.defaults.disciplineWeight;
    if (isNaN(value)) throw new Error("Not a Number!");
    return value;
  });
  return currentWeights;
}

function getDisciplineMinMax() {
  const currentMinMax = objectMap(scoreMinMaxInputs, (elemArray) => {
    let values = [
      parseFloat(elemArray[0].value),
      parseFloat(elemArray[1].value),
    ];
    for (let value in values) {
      if (!value) throw new Error("One of the fields were not filled in!");
      if (isNaN(value)) throw new Error("Not a Number!");
    }
    return values;
  });

  if (!currentMinMax.LT[0])
    currentMinMax.LT[0] = settings.defaults.minmax.LT[0];
  if (!currentMinMax.LT[1])
    currentMinMax.LT[1] = settings.defaults.minmax.LT[1];
  if (!currentMinMax.CH[0])
    currentMinMax.CH[0] = settings.defaults.minmax.CH[0];
  if (!currentMinMax.CH[1])
    currentMinMax.CH[1] = settings.defaults.minmax.CH[1];
  if (!currentMinMax.CN[0])
    currentMinMax.CN[0] = settings.defaults.minmax.CN[0];
  if (!currentMinMax.CN[1])
    currentMinMax.CN[1] = settings.defaults.minmax.CN[1];
  if (!currentMinMax.MT[0])
    currentMinMax.MT[0] = settings.defaults.minmax.MT[0];
  if (!currentMinMax.MT[1])
    currentMinMax.MT[1] = settings.defaults.minmax.MT[1];

  return currentMinMax;
}

function setMessageAverage(message) {
  resultDialogElements.forEach((element) => {
    element.innerHTML = message;
  });
}

function showResult(result, hasPassingScore, passingScore) {
  if (!hasPassingScore) {
    const message = `Sua média foi "${
      Math.round((result + Number.EPSILON) * 100) / 100
    }".`;
    setMessageAverage(message);
    return;
  }

  if (isNaN(passingScore)) throw new Error("Passing score is not a number!");
  if (result > passingScore) {
    const message = `Sua média foi "${
      Math.round((result + Number.EPSILON) * 100) / 100
    }". Você foi aprovado na chamada regular!`;
    setMessageAverage(message);
    return;
  }

  if (result === passingScore) {
    const message = `Sua média foi "${
      Math.round((result + Number.EPSILON) * 100) / 100
    }". Você é a nota de corte!`;
    setMessageAverage(message);
    return;
  }

  if (result < passingScore) {
    const message = `Sua média foi "${
      Math.round((result + Number.EPSILON) * 100) / 100
    }". Você foi reprovado na chamada regular, atenção a lista de espera!`;
    setMessageAverage(message);
    return;
  }
}
