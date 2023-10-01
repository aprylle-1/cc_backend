/**
 * Class User contains functions related to a User
 * This class will contain the following functions
 * create a user -> will create a new user in the database
 * authenticate -> will check if username exists and that the password is the same
 * delete user -> should only work if the user is deleting their own account
 * get a user's stories -> gets all the user's stories
 */

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../helpers/expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    /**
     * Static function register allows users to create an account
     * Will only ask for username and password
     * will only return username
     */

    static async register (username, firstname, lastname, password){
        const duplicateCheck = await db.query(
            `SELECT username, password
             FROM users
             WHERE username = $1
            `,
            [username]
        );
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Username ${username} already exists.`);
        }
        else {
            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const results = await db.query(`
                INSERT INTO users
                (username, firstname, lastname, password)
                VALUES ($1, $2, $3, $4)
                RETURNING username, firstname, lastname
            `,
            [username, firstname, lastname, hashedPassword]
            );

            const newUser = results.rows[0];

            return newUser;
        }
    };

    static async authenticate (username, password){
        const result = await db.query(
            `
                SELECT username, password
                FROM users
                WHERE username = $1
            `,
            [username]
        );

        const user = result.rows[0];
        if (user){
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword){
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username or password.");
    }

    static async follow (followerUsername, followingUsername) {

        const respFollower = await db.query(
            `
                SELECT id FROM users
                WHERE username = $1
            `,[followerUsername]);

        const followerId = respFollower.rows[0].id;

        const respFollowing = await db.query(
            `
                SELECT id FROM users
                WHERE username = $1
            `, [followingUsername]);

        const followingId = respFollowing.rows[0].id;

        const check = await db.query(
            `
                SELECT * FROM following
                WHERE following_id = $1 AND follower_id = $2
            `,[followingId, followerId])
        
        if (check.rows.length > 0) throw new BadRequestError(`${followerUsername} is already following ${followingUsername}`)

        await db.query(`
            INSERT INTO following
            VALUES ($1, $2)
        `,[followerId, followingId])
        return "successfully followed"
    }

    static async unfollow (followerUsername, followingUsername) {

        const respFollower = await db.query(
            `
                SELECT id FROM users
                WHERE username = $1
            `,[followerUsername]);

        const followerId = respFollower.rows[0].id;

        const respFollowing = await db.query(
            `
                SELECT id FROM users
                WHERE username = $1
            `, [followingUsername]);

        const followingId = respFollowing.rows[0].id;

        const check = await db.query(
            `
                SELECT * FROM following
                WHERE following_id = $1
            `,[followingId])
        
        if (!check.rows.length > 0) throw new BadRequestError(`${followerUsername} is not following ${followingUsername}`)

        await db.query(`
            DELETE 
            FROM following
            WHERE follower_id = $1 AND following_id = $2
        `,[followerId, followingId])
        return "successfully unfollowed"
    }

    static async getFollowingUsers (username) {
        // const user = await db.query(`
        //     SELECT id FROM users
        //     WHERE username = $1
        // `, [username])

        // console.log(user)
        // if (user.rows.length === 0)throw new NotFoundError("This user does not exists");
        const results = await db.query(`
            SELECT u1.username, u2.username
            FROM following
            JOIN users u1 ON u1.id = following.follower_id
            JOIN users u2 on u2.id = following.following_id
            WHERE u1.username = $1
        `, [username])

        const following = results.rows
        return following
    }

    static async feed (usernames) {
        if (usernames.length > 0){
            let query = ""
            for (let i = 0; i < usernames.length; i++){
                query += `$${i+1} ,`
            }
            query = query.substring(0, query.length - 1)
    
            const results = await db.query(`
                SELECT users.username, stories.title, stories.content, stories.id, stories.updated_on
                FROM stories
                LEFT JOIN users
                ON stories.user_id = users.id
                WHERE users.username IN (${query})
                ORDER BY updated_on DESC
            `,[...usernames])
    
            const stories = results.rows
            return stories;
        }
        else {
            return [];
        }
    }

    static async getKEY () {
        const data = await db.query(`
            SELECT key FROM keys
            WHERE id = $1
        `,[1]);
        return data.rows[0].key
    }
}

module.exports = User;