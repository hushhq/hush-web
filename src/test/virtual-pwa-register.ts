type RegisterSWOptions = {
  onNeedRefresh?: () => void;
  onRegisterError?: (err: unknown) => void;
};

export function registerSW(_options?: RegisterSWOptions): () => Promise<void> {
  return async () => {};
}
