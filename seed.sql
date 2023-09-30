\connect capstone_2_backend;

DROP TABLE stories;
DROP TABLE users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER 
    REFERENCES users (id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_on TIMESTAMPTZ,
    updated_on TIMESTAMPTZ
);