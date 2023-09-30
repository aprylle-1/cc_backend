/** 
 * Routes for register and login
 * Each route should return a JWT signed token
*/

const jsonschema = require("jsonschema");

const User = require("../models/user");
const Story = require ("../models/story")
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../helpers/expressError");

router.get("/getAPIKEY", async function(req, res, next){
    try{
        const OPEN_AI_API_KEY = await User.getKEY()
        return res.json({
            key : OPEN_AI_API_KEY
        })
    }
    catch(err){
        next(err)
    }
})
router.post("/following", async function (req, res, next){
    try{
        const { username } = req.body
        const following = await User.getFollowingUsers(username)
        return res.status(201).json({
            followingList : following
        })
    }
    catch(err){
        next(err)
    }
})

router.post("/follow", async function (req, res, next){
    try{
            const { followerUsername, followingUsername } = req.body;
            const message = await User.follow(followerUsername, followingUsername);
            return res.status(201).json({
                message : message
            })
    }
    catch(err){
        next(err)
    }
})

router.delete("/unfollow", async function (req, res, next){
    try{
        const { followerUsername, followingUsername } = req.body;
        const message = await User.unfollow(followerUsername, followingUsername);
        return res.status(201).json({
            message : message
        })
    }
    catch(err){
        next(err)
    }
})

router.get("/:username/feed", async function (req, res, next){
    try{
        const { username } = req.params;
        // const data = []
        const following = await User.getFollowingUsers(username);
        const usernames = following.map(user=>user.username)
        const stories = await User.feed(usernames)
        return res.status(201).json({
            stories : stories
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router;