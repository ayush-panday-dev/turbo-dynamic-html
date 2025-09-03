interface catching {
  value: string;
  ttl?: Date;
}
export class MemoryCatching {
  private static catcheValues: Record<string, catching> = {};
  public static insertCatche(
    key: string,
    value: catching["value"],
    options: Omit<catching, "value">
  ) {
    this.catcheValues[key] = {
      ...options,
      value: value,
    };
  }
  public static getFromCatch(key: string) {
    const catche = this.catcheValues[key];
    if (!catche) {
      return null;
    }
    if (catche.ttl && new Date() > catche.ttl) {
      delete this.catcheValues[key];
      return null;
    }
    return catche;
  }
}
