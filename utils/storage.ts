//工厂函数
function createStorage(getStorage: () => Storage) {
  function getSafeStorage(): Storage | null {
    try {
      return getStorage();
    } catch {
      return null;
    }
  }
  /**
   * 从存储中读取数据
   * @param {string} key 存储键名
   * @returns {T | null} 存储的数据（如果存在），否则返回null
   */
  // 从存储中读取数据
  function load<T = unknown>(key: string): T | null {
    const storage = getSafeStorage();
    if (!storage) return null;
    try {
      if (key) {
        const item = storage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
      return null;
    } catch (error: any) {
      throw new Error("读取存储失败,错误信息为：" + error.message);
    }
  }
  /**
   * 向存储中写入数据
   * @param {string} key 存储键名
   * @param {T} value 要写入的数据
   */
  // 向存储中写入数据
  function save<T>(key: string, value: T): void {
    const storage = getSafeStorage();
    if (!storage) return;
    try {
      if (key && value != null) {
        storage.setItem(key, JSON.stringify(value));
      }
    } catch (error: any) {
      if (error.name === "QuotaExceededError") {
        throw new Error("存储已满，无法写入数据");
      } else {
        throw new Error("写入存储失败,错误信息为：" + error.message);
      }
    }
  }
  /**
   * 从存储中删除数据
   * @param {string} key 存储键名
   */
  // 从存储中删除数据
  function remove(key: string): void {
    const storage = getSafeStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch (error: any) {
      throw new Error("删除存储失败,错误信息为：" + error.message);
    }
  }
  return {
    load,
    save,
    remove,
  };
}

export const localStore = createStorage(() => window.localStorage);
export const sessionStore = createStorage(() => window.sessionStorage);
