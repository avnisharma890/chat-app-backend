const mongoose = require('mongoose');
const Conversation = require("../models/conversation");
const Message = require("../models/Message");
const {io, getReceiverSocketId  } = require("../socket/socket.js");

const sendMessage = async (req,res) => {
    try {
        const senderId = new mongoose.Types.ObjectId(req.id);
        const receiverId = new mongoose.Types.ObjectId(req.params.id);
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        
        await Promise.all([gotConversation.save(), newMessage.save()]);

        // SOCKET ID
        const receiverSocketid = getReceiverSocketId(receiverId);
        if(receiverSocketid) {
            io.to(receiverSocketid).emit("newMessage", newMessage);
        }
        
        return res.status(201).json({
            newMessage,
            message: "Message sent successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to send message`
        })
    }
}

const getMessage = async(req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const converse = await Conversation.findOne({
            participants: {$all: [senderId,receiverId]}
        }).populate("messages");
        console.log(converse.messages);
        
        if(!converse) {
            return res.status(400).json({
                message: "no conversation found",
                data: []
            });
        }

        return res.status(200).json({
            message: "message sent",
            data: converse.messages
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {sendMessage, getMessage};