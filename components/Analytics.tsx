/**
 * 网站访问统计组件
 * 使用 counter.dev 进行轻量级、注重隐私的访问统计
 */
import Script from "next/script";

const COUNTER_DEV_ID = "7caf2630-1430-466f-a90b-100296dbe831";
const UTC_OFFSET = "8"; // UTC+8 北京时间

export default function Analytics() {
  return (
    <Script
      src="https://cdn.counter.dev/script.js"
      data-id={COUNTER_DEV_ID}
      data-utcoffset={UTC_OFFSET}
      strategy="afterInteractive"
      // 仅在生产环境启用统计
      {...(process.env.NODE_ENV === "production" ? {} : { defer: true })}
    />
  );
}
