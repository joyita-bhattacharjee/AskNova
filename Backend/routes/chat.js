import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// NOTE: protect is applied per-route (not globally)
// This prevents it from accidentally blocking /api/auth/* routes

//Get all threads — only threads belonging to the logged-in user
router.get("/thread", protect, async(req, res) => {
    try {
        const threads = await Thread.find({userId: req.user._id}).sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", protect, async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId, userId: req.user._id});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", protect, async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId, userId: req.user._id});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", protect, async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId, userId: req.user._id});

        if(!thread) {
            //create a new thread in DB linked to this user
            thread = new Thread({
                threadId,
                userId: req.user._id,
                title: message.slice(0, 60),
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;