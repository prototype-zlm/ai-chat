import { forwardRef, useImperativeHandle,useState,useEffect,useRef } from "react";

type TipsMessageProps = {}

export interface State {
  type:"error" | "success" | "info";
  message:string;
  duration?:number;
}

export interface TipsMessageRef {
  ShowMessage: (state:State) => void;
  HideMessage: () => void;
}

const TipsMessage = forwardRef<TipsMessageRef,TipsMessageProps>((_, ref) => {
  const [message, setMessage] = useState<State | null>(null);
  const [ messageKey, setMessageKey ] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  //组件被卸载前，清除定时器
  useEffect(()=>{
   return () => {
    if(timerRef.current) clearTimeout(timerRef.current);
   }
  },[])


  useImperativeHandle(ref, () => ({
    // 显示消息
    ShowMessage: (state:State) => {
      // 清除上一个定时器
      if(timerRef.current) clearTimeout(timerRef.current);
      // 存储消息内容和消息类型
      setMessage(state);
      //更新key，触发重新渲染，让消息显示动画生效
      setMessageKey(pre => pre + 1);
      // 保存定时器id
      timerRef.current = setTimeout(() => {
        setMessage(null);
        // 清除定时器id
        timerRef.current = null;
      }, state?.duration ?? 6000);
    },
    // 隐藏消息
    HideMessage: () => {
      setMessage(null);
      // 清除定时器id
      timerRef.current = null;
    }


  }));
  if (!message) {
    return null;
  }

  return (
      <div key={messageKey} className={`tips-message ${message.type}`}>
        {message.message}
      </div>
    )
});

export default TipsMessage;
