declare module '*.graphql';

type DistributedOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;
