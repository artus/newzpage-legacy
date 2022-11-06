type Executor<Input> = () => Promise<Input>;
type MappingExecutor<Input, Output> = (value: Input) => Promise<Output>;

export class Try<Input> {

  constructor(
    readonly value: Input | null, 
    readonly error: Error | null = null
    ) {
      // Do nothing
  }

  public isFailure() {
    return !!this.error;
  }

  public isSuccess() {
    return !this.error;
  }

  public async map<Output>(mappingExecutor: MappingExecutor<Input, Output>): Promise<Try<Output>> {
    if (this.isFailure()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Try.failure(this.error!) as Try<Output>;
    }

    try {
      const result = await mappingExecutor(this.value as Input);
      return Try.success(result);
    } catch (error) {
      return Try.failure(error as Error) as Try<Output>;
    }
  }

  public async getOrThrow(): Promise<Input> {
    if (this.isFailure()) {
      console.log("is error, throwing", this.error);
      throw this.error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.value!;
    }
  }

  private static failure(error: Error) {
    return new Try(null, error);
  }

  private static success<T>(value: T) {
    return new Try<T>(value);
  }

  static async of<T>(executor: Executor<T>): Promise<Try<T>> {
    try {
      const result = await executor();
      return this.success(result);
    } catch (error) {
      return this.failure(error as Error) as Try<T>;
    }
  }
}