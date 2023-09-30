/**
 * Class story contains functions related to a Story
 * This class will contain the following functions:
 * save a story -> will create a new row in the stories table
 * read a story -> get a story's contents by id
 * update a story -> update the contents of a story, only title and content can be updated
 * delete a story -> can only be done if the user id is the logged in user
 */

const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../helpers/expressError");

class Story {
    /**
     * Static Function save will create a new row in the stories table 
     */

    static async save (username, prompt, title, content){
        const currentTimeStamp = (new Date(Date.now())).toISOString();
        const user = await db.query(`
            SELECT id FROM users
            WHERE username = $1
        `, [username])

        const userId = user.rows[0].id
        const results = await db.query(`
            INSERT INTO stories
            (user_id, prompt, title, content, created_on, updated_on)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING title, content
        `,[userId, prompt, title, content, currentTimeStamp, currentTimeStamp]);

        const story = results.rows[0];

        return story;
    }
    /**
     * Static Function read will get the prompt, title, content, created_on (date), updated_on (date) based on the storyId 
     */

    static async read (storyId){
        const results = await db.query(`
            SELECT stories.prompt, stories.title, stories.content, stories.created_on, stories.updated_on, users.username
            FROM stories
            LEFT JOIN users
            ON users.id = stories.user_id
            WHERE stories.id = $1
        `, [storyId]);

        const story = results.rows[0];
        
        if (story){
            return story;
        }
        
        throw new NotFoundError(`No story with id ${storyId}`);
    }

    /**
     * Static function read all gets all available stories
     */

    /**
     * Static Function update will update the story, it should be passed the storyId, the new title or new content. Only
     * title and content should be editable 
     */

    static async update(username, storyId, title, content){
        const currentTimeStamp = (new Date(Date.now())).toISOString();
        const user = await db.query(`
                SELECT id FROM
                users
                WHERE username = $1
        `, [username])
        

        const story = await db.query(`
                SELECT user_id AS userId FROM
                stories
                WHERE id = $1
        `, [storyId])

        if (story.rows.length === 0) throw new NotFoundError(`No story with id ${storyId}`);
        const userId = user.rows[0].id;
        const userStoryId = story.rows[0].userid

        if (userId !== userStoryId) throw new UnauthorizedError(`You cannot edit this story`)
        const results = await db.query(`
                UPDATE stories SET title = $1, content = $2, updated_on = $3
                WHERE id = $4
                RETURNING title, content, created_on, updated_on 
        `, [title, content, currentTimeStamp, storyId]);

        const updatedStory = results.rows[0];

        if (updatedStory){
            return updatedStory;
        }
    }

    /**
     * Static function delete will delete a story based on the storyId
     */

    static async delete(username, storyId){
        const user = await db.query(`
                SELECT id FROM
                users
                WHERE username = $1
        `, [username])
        

        const story = await db.query(`
                SELECT user_id AS userId FROM
                stories
                WHERE id = $1
        `, [storyId])
        
        if (story.rows.length === 0) throw new NotFoundError(`No story with id ${storyId}`);
        const userId = user.rows[0].id;
        const userStoryId = story.rows[0].userid

        if (userId !== userStoryId) throw new UnauthorizedError(`You cannot delete this story`)
        
        const results = await db.query(`
            DELETE 
            FROM stories
            WHERE id = $1
            RETURNING id
        `,[storyId])

        return results.rows[0].id;
    }

    /**
     * Static function getStoriesByUser will get all stories by username
     */

    static async getStoriesByUser (username){
        const results = await db.query(`
            SELECT users.username, stories.title, stories.content, stories.id, stories.updated_on
            FROM stories
            LEFT JOIN users
            ON stories.user_id = users.id
            WHERE users.username = $1
            ORDER BY updated_on DESC
            `, [username])

        const stories = results.rows

        return stories;
    }

    static async getRecentStoriesByUser (username) {
        const results = await db.query(`
            SELECT users.username, stories.title, stories.id, stories.updated_on
            FROM stories
            LEFT JOIN users
            ON stories.user_id = users.id
            WHERE users.username = $1
            ORDER BY updated_on DESC LIMIT 5
        `, [username])

        const stories = results.rows

        return stories;
    }

    static async getAllUsers (username) {
        const usersData = await db.query(`
            SELECT username, id
            FROM users
            WHERE username != $1
        `, [username])
        const data = []
        const users = usersData.rows
        for (const user of users) {
            async function getStory (id) {
                const res = await db.query(`
                SELECT title, content
                FROM stories
                WHERE user_id = $1
                LIMIT 1
            `, [user.id])
            const story = res.rows[0]
            return story
            }
            const story = await getStory(user.id)
            data.push({
                user: user,
                story : story
            })
        }
        return data
    }
}

module.exports = Story;