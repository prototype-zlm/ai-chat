import { createPortal } from "react-dom";

// 封装一个通用的弹窗组件，接收一个client？还有宽高参数？
export default function Dialog({
  children,
  width = 400,
  height = 400, //默认高度自适应，超出最大高度时滚动条
  title = "Dialog",
  onClose = () => {},
  isOpen = false,
}: Readonly<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  title?: string;
  onClose?: () => void;
  isOpen?: boolean;
}>) {
  if (!isOpen) {
    return null;
  }
  return createPortal(
    <>
      {/* 弹窗部分 */}
      <div
        className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white p-4 rounded-md shadow-md overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
      >
        {/* title */}
        <div className="w-full flex justify-between items-center">
          <h4 className="text-lg font-bold">{title}</h4>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 cursor-pointer"
          >
            X
          </button>
        </div>
        {/* content */}
        <div className="flex-1 w-full min-h-0">{children}</div>
      </div>
      {/* 遮罩部分 */}
      <div
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="z-40 fixed top-0 left-0 w-full h-full bg-black/50"
      ></div>
    </>,
    document.body,
  );
}
