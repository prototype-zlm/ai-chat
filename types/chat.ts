//当类型被多个组件使用时，建议将其提取到一个单独的文件中

 export interface UsageType {
    total_tokens: number;  //总token数
    prompt_tokens: number;  //输入token数
    prompt_tokens_details:{
      cached_tokens: number;  //缓存命中的输入token数
    }
    completion_tokens: number;  //输出token数
    completion_tokens_details:{
      reasoning_tokens: number;  //推理token数
    }
  }

type TextPart = {
  type: "text";
  text: string;
}
type ImagePart = {
  type: "image_url";
  image_url:{
    url: string;
  };
}
export type ContentPartType = TextPart | ImagePart;


export interface ChatMessageType{
  role: "system" | "user" | "assistant" | "tool";
  content: string | ContentPartType[];
};

export interface DialogueMessageType {
  _id: string;
  dialogueId: string;
  role: "user" | "assistant" | "loading" | "error";
  content: string | ContentPartType[];
  thinking?: string;
  createdAt: number;
  usage?: UsageType;
}

export interface DialogueType {
  _id: string;
  userId: string;
  name: string;
  isMessage: boolean; //是否有对话消息
  createdAt: number;
  updatedAt: number;
}


export interface userInfoType{
  _id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  activeModel: string | null;
  createdAt: number;
  updatedAt: number;
}

export type ModelProtocolType = "openai";
export interface modelInfoType{
  _id: string;
  userId: string;
  protocol: ModelProtocolType;
  model: string;
  apiKey: string;
  baseUrl: string;
  createdAt: number;
  updatedAt: number;
}

 export interface AddCustomModelRequest {
  modelId?: string;
  protocol: ModelProtocolType;
  model: string;
  apiKey: string;
  baseUrl: string;
}