import { useSyncExternalStore } from "react";

type Listener = () => void;

const versions = new Map<string, number>();
const listeners = new Map<string, Set<Listener>>();

const getVersion = (key: string) => versions.get(key) ?? 0;

const subscribe = (key: string, listener: Listener) => {
  let bucket = listeners.get(key);
  if (!bucket) {
    bucket = new Set();
    listeners.set(key, bucket);
  }
  bucket.add(listener);
  return () => {
    bucket?.delete(listener);
  };
};

export const invalidate = (key: string) => {
  const nextVersion = getVersion(key) + 1;
  versions.set(key, nextVersion);
  listeners.get(key)?.forEach((listener) => listener());
};

export const useInvalidationKey = (key: string) =>
  useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => getVersion(key)
  );
