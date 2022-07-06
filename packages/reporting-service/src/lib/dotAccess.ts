// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dotAccess = (parent: Record<string, any>, key: string): unknown => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return key.split('.').reduce((val, curr) => val?.[curr], parent);
};
