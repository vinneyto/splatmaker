let pendingSplatFile: File | null = null;

export function setPendingSplatFile(file: File) {
  pendingSplatFile = file;
}

export function takePendingSplatFile(): File | null {
  const file = pendingSplatFile;
  pendingSplatFile = null;
  return file;
}
