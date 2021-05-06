export function time(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve.bind(null), ms);
  });
}
