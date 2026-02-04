// counter.dev 类型声明
declare global {
  interface Window {
    counterDevConfig?: {
      path?: string;
      [key: string]: any;
    };
  }
}

export {};
