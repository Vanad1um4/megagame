export function getRandomListElem<T>(list: T[]): T {
  if (list.length === 0) {
    throw new Error("List is empty");
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export function getRandomEnumValue<T extends object>(enumObject: T): T[keyof T] {
  const enumValues = Object.values(enumObject);
  if (enumValues.length === 0) {
    throw new Error("Enum is empty");
  }
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}
