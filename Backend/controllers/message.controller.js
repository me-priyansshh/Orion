//=========== ALL IMPORTS ==========//
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

//============ SEND MESSAGE CONTROLLER ===============//
export const sendMessageController = async (req, res) => {
    try {
        
       const senderId = req.id;
       const receiverId = req.params.id;
       const { message } = req.body;

       if(!message){
        return res.status(400).send({
            message: "Message is required"
        });
       };

       let conversation = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
       });

       if(!conversation){
        conversation = await Chat.create({
            participants: [senderId, receiverId],
        });
       };

       const newMessages = await Message.create({
        senderId,
        receiverId,
        message,
       });

      if(newMessages){
           conversation.messages.push(newMessages._id);
      };

      await Promise.all([
        conversation.save(),
        newMessages.save(),
      ]);

      //Implement Socket io

      return res.status(200).send({
        message: "Message sent successfully",
        conversation,
        newMessages,
      });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error sending message"
        });
    }
}

//============ GET MESSAGES CONTROLLER ===============//
export const getMessagesController = async (req, res) => {
     try {
         
      const senderId = req.id;
      const receiverId = req.params.id;

      const chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if(!chat){
        return res.status(404).send({
            message: [],
        });
      };

      return res.status(200).send({
        message: "Messages fetched successfully",
        messages: chat?.messages,
      });

     } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error getting messages"
        });
     }
}