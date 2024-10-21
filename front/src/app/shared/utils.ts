export function getRandomListElem<T>(list: T[]): T {
  if (!list.length) {
    throw new Error("List is empty");
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export function getRandomEnumValue<T extends object>(enumObject: T): T[keyof T] {
  const enumValuesList = Object.values(enumObject);
  if (!enumValuesList.length) {
    throw new Error("Enum is empty");
  }
  const randomIndex = Math.floor(Math.random() * enumValuesList.length);
  return enumValuesList[randomIndex];
}
