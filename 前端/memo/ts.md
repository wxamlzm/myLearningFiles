```const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
    let timer: ReturnType<typeof setTimeout>
    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  }
```
