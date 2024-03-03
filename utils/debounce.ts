export default function <T extends Function>(fn: T, wait: number): T {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}
