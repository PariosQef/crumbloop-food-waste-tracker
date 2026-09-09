const DonationOutcome = require(
  "../models/DonationOutcome"
);

// Sigmoid converts any number into probability 0–1.
const sigmoid = (value) => {
  return 1 / (1 + Math.exp(-value));
};

// Normalise features into roughly comparable ranges.
const createFeatures = (record) => {
  return [
    1, // bias/intercept
    record.surplusWeightKg / 100,
    record.distanceKm / 20,
    record.estimatedPickupMinutes / 180,
    record.availableCapacityKg / 200,
    record.reliabilityScore / 100
  ];
};

const dotProduct = (weights, features) => {
  return weights.reduce(
    (total, weight, index) =>
      total + weight * features[index],
    0
  );
};

const trainModel = async () => {
  const records =
    await DonationOutcome.find({});

  if (records.length < 20) {
    throw new Error(
      "Not enough training records. At least 20 donation outcomes are required."
    );
  }

  const learningRate = 0.08;
  const iterations = 2500;

  // Bias + five features
  let weights = [0, 0, 0, 0, 0, 0];

  for (
    let iteration = 0;
    iteration < iterations;
    iteration += 1
  ) {
    const gradients = [
      0, 0, 0, 0, 0, 0
    ];

    for (const record of records) {
      const features =
        createFeatures(record);

      const prediction = sigmoid(
        dotProduct(weights, features)
      );

      const error =
        prediction - record.successful;

      for (
        let index = 0;
        index < weights.length;
        index += 1
      ) {
        gradients[index] +=
          error * features[index];
      }
    }

    for (
      let index = 0;
      index < weights.length;
      index += 1
    ) {
      weights[index] -=
        learningRate *
        (gradients[index] / records.length);
    }
  }

  return {
    weights,
    trainingRecords: records.length
  };
};

const predictDonationSuccess = (
  weights,
  {
    surplusWeightKg,
    distanceKm,
    estimatedPickupMinutes,
    availableCapacityKg,
    reliabilityScore
  }
) => {
  const features = createFeatures({
    surplusWeightKg,
    distanceKm,
    estimatedPickupMinutes,
    availableCapacityKg,
    reliabilityScore
  });

  const probability = sigmoid(
    dotProduct(weights, features)
  );

  return Math.round(probability * 100);
};

module.exports = {
  trainModel,
  predictDonationSuccess
};