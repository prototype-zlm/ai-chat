import { ContentPartType } from "@/types/chat";

//处理content中的文本内容，因为react-markdown只能接收纯string类型
export function getTextContent(content:string | ContentPartType[]) {
  if (typeof content === 'string') {
    return content;
  }
  return content.map((item)=>{
    if(item.type === 'text'){
        return item.text;
    }
  }).join('');
}