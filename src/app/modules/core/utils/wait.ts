export function wait(ms: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve.bind(null), ms);
  });
}
