// Return a generic reducer function to update object with partial set of key/values
export function getGenericReducer<T>() {
  return (info: T, partialInfo: Partial<T>): T => {
    return {
      ...info,
      ...partialInfo,
    };
  };
}
