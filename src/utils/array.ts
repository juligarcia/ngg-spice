export const map = <I, O>(
  input: Array<I>,
  transform: (i: I) => O
): Array<O> => {
  const length = input.length;
  const output: Array<O> = new Array(length);

  for (let i = 0; i < length; i++) {
    output[i] = transform(input[i]);
  }

  return output;
};

export const mutablyMap = <I, O>(input: Array<I>, transform: (i: I) => O) => {
  const length = input.length;
  const temporaryOutput = input as Array<I | O>;

  for (let i = 0; i < length; i++) {
    temporaryOutput[i] = transform(input[i]);
  }

  return temporaryOutput as Array<O>;
};

export const slice = <I>(
  input: Array<I>,
  start: number,
  end: number
): Array<I> => {
  const length = end - start;
  const output: Array<I> = new Array(length);

  for (let i = start; i < end; i++) {
    output[i - start] = input[i];
  }

  return output;
};

export const reduce = <I, O>(
  input: Array<I>,
  reductor: (output: O, current: I, index: number) => O,
  initialValue: O
): O => {
  let output = initialValue;
  const length = input.length;

  for (let i = 0; i < length; i++) {
    output = reductor(output, input[i], i);
  }

  return output;
};
