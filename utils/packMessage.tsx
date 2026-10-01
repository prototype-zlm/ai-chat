import { ContentPartType } from "@/types/chat";

interface addFile {
  type: "image";
  result: string;
}

//处理message，当有文件时，message是对象结构，否则为纯string
export function packMessage(message:string, addFiles: addFile[]):string | ContentPartType[] {
  if(addFiles.length === 0) return message
  let fileParts: ContentPartType[] = addFiles.map((item)=>{
    return {
      type: "image_url",
      image_url: {
        url: item.result,
      },
    }
  })
  let packedMessage: ContentPartType[] = [
    {
        type: 'text',
        text: message,
    },
    ...fileParts
  ]
  return packedMessage
}