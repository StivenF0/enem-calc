import { objectMap } from "./utils";

export function calculateAverage(
  correctCount,
  disciplineWeights,
  disciplineMinMax
) {
  // correctCount = {
  //   LT: 45,
  //   CH: 45,
  //   CN: 45,
  //   MT: 45,
  //   R: 1000,
  // };

  // disciplineWeights = {
  //   LT: 1,
  //   CH: 1,
  //   CN: 1,
  //   MT: 1,
  //   R: 1,
  // };

  // const disciplineMinMax = {
  //   LT: [300, 800],
  //   CH: [300, 800],
  //   CN: [300, 800],
  //   MT: [300, 800],
  // };

  const IRTfactor = objectMap(
    disciplineMinMax,
    (value) => (value[1] - value[0]) / 45
  );

  const average =
    ((correctCount.LT * IRTfactor.LT + disciplineMinMax.LT[0]) *
      disciplineWeights.LT +
      (correctCount.CH * IRTfactor.CH + disciplineMinMax.CH[0]) *
        disciplineWeights.CH +
      (correctCount.CN * IRTfactor.CN + disciplineMinMax.CN[0]) *
        disciplineWeights.CN +
      (correctCount.MT * IRTfactor.MT + disciplineMinMax.MT[0]) *
        disciplineWeights.MT +
      correctCount.R * disciplineWeights.R) /
    (disciplineWeights.LT +
      disciplineWeights.CH +
      disciplineWeights.CN +
      disciplineWeights.MT +
      disciplineWeights.R);

  return average;
}
