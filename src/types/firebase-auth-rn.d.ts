// firebase/auth's package.json "exports" map lists a bare "types" condition
// before its "react-native" condition, so TypeScript always resolves the
// web typings and never sees RN-only exports like getReactNativePersistence
// — even though it exists and works fine at runtime via Metro. This just
// restores the missing type.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
