import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI在环境变量中未定义');
}

/**
 * MongoDB 连接缓存
 * 在开发环境中，Next.js 的热重载会创建多个连接
 * 使用缓存可以避免连接数过多
 */

// let cached = global.mongoose;
// //第一次连接时，cached 为 undefined，global.mongoose 为 undefined，需要初始化
// if (!cached) {
//   cached = global.mongoose = { 
//     conn: null, //当前MongoDB连接对象
//     promise: null //正在建立连接的Promise对象
// };
// }

const cached =
  global.mongoose ??
  (global.mongoose = {
    conn: null,
    promise: null,
  });



//连接数据库
async function dbConnect() {
  //如果缓存中已经连接了数据库，直接返回
  if (cached.conn) {
    return cached.conn;
  }

  //如果缓存中没有连接，创建一个新的连接
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    //等待连接完成，并将连接对象缓存起来
    cached.conn = await cached.promise;
  } catch (e) {
    //如果连接失败，则将缓存中的连接对象设为 null，抛出错误，这样下次连接时会重新创建连接
    cached.promise = null;
    throw e;
  }

  //返回连接对象
  return cached.conn;
}

export default dbConnect;