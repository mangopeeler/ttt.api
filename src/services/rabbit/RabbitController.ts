import { Request, Response } from 'express';
import amqp, { Connection, Channel, Replies, ConsumeMessage } from 'amqplib';
import Bluebird from 'bluebird';

  

export function connectChannel(callback: Function) {

  amqp.connect("amqp://localhost", 
  
    async (err: any, connection: Connection) => {
    
      if(err){
        console.log('An error has occurred while connecting to rabbit.');
      }
      else {
        const channel = await connection.createChannel();
        console.log('Created connection to channel.');
        channel.assertExchange('hw4', 'direct', { durable: false });
        const assertQueue = await channel.assertQueue('', { exclusive: true });
        callback(channel, assertQueue);
      }

  });
}

export async function listen(keys: string[], callback: Function){

  connectChannel(
    async (channel: Channel, queue : Replies.AssertQueue) => {

      keys.forEach(

        (key, i) => {
          channel.bindQueue(queue.queue, 'hw4', key);
        }
      )
    
      channel.consume(queue.queue, 
        (msg: ConsumeMessage|null) => {
          if(msg != null){
            console.log(msg);
            callback(msg.content.toString());
          }
        },
        {
          noAck: true
        }
      )
    }
  );


}

export function speak(key: string, msg: string){


  connectChannel(

    (channel: Channel, queue : Replies.AssertQueue) => {

      channel.publish('hw4', key, Buffer.from(msg));

    }

  );

}