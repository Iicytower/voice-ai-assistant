export enum TypeOfBracketsWrapper {
  Square = 'quare',
  Curly = 'curly',
}

export function extractJsonFromString(
  input: string,
  parse = false,
  typeOfBracketsWrapper = TypeOfBracketsWrapper.Curly,
): string {
  const jsonStart = input.indexOf(
    typeOfBracketsWrapper === TypeOfBracketsWrapper.Square ? '[' : '{',
  );
  const jsonEnd = input.lastIndexOf(
    typeOfBracketsWrapper === TypeOfBracketsWrapper.Square ? ']' : '}',
  );

  if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
    return '[]'; // No valid JSON found
  }

  const jsonString = input.substring(jsonStart, jsonEnd + 1);

  try {
    // Try to parse the extracted string to validate it
    const value = JSON.parse(jsonString);
    return parse ? value : jsonString;
  } catch (error: unknown) {
    console.log(input);
    console.log(error);
    return '[]'; // Invalid JSON
  }
}
