const Story = require("../models/story");
const express = require("express");
const router = new express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const jsonschema = require("jsonschema")
const saveStorySchema = require("../schemas/storySave.json")
const updateStorySchema = require("../schemas/storyUpdate.json")
const { BadRequestError } = require("../helpers/expressError");

router.post("/getall", async function (req, res, next){
    try{
        const { username } = req.body
        const data = await Story.getAllUsers(username)
        return res.json({
            data : data
        })
    }
    catch(err){
        next(err)
    }
})

router.get("/:username", async function (req, res, next){
    try{
        const {username} = req.params
        const stories = await Story.getStoriesByUser(username);
        return res.status(200).json({
            stories : stories
        })
    }
    catch(err){
        next(err)
    }
})

router.get("/:username/recent", async function (req, res, next){
    try{
        const {username} = req.params
        const stories = await Story.getRecentStoriesByUser(username);
        return res.status(200).json({
            stories : stories
        })
    }
    catch(err){
        next(err)
    }
})

router.post("/save", ensureLoggedIn, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, saveStorySchema);
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const {prompt, title, content} = req.body
        const username = res.locals.user.username
        console.log(username)
        const newStory = await Story.save(username, prompt, title, content);
        return res.status(201).json({
            story : newStory
        });
    }
    catch(err){
        next(err)
    }
});

router.get("/:id/read", async function (req, res, next){
    try{
        let {id} = req.params;
        const story = await Story.read(id);
        console.log(story)
        return res.status(200).json({
            story : story
        })
    }
    catch(err){
        next(err)
    }
});

router.patch("/:id/update", ensureLoggedIn, async function (req, res, next){
    try{
        const validator = jsonschema.validate(req.body, updateStorySchema);
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { title, content, username } = req.body
        const id = req.params.id
        const updatedStory = await Story.update(username, id, title, content)

        return res.json({
            updated_story : updatedStory
        })
    }
    catch(err){
        next(err);
    }
})

router.delete("/:id/delete", ensureLoggedIn, async function (req, res, next){
    try{
        const username = res.locals.user.username;
        const id = req.params.id;
        const deletedStory = await Story.delete(username, id);

        return res.json({
            message : `deleted story ${deletedStory}`
        });
    }
    catch(err){
        next(err);
    }
})

module.exports = router;