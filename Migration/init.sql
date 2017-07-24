CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- enums
CREATE TYPE genders AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE resource_types AS ENUM (
  'avatar',
  'video',
  'thumbnail'
);

CREATE TYPE react_types AS ENUM (
  'skip',
  'like',
  'dislike'
);

-- tables
CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email              TEXT                           NOT NULL UNIQUE CHECK (trim(email) <> ''),
  name               TEXT CHECK (trim(name) <> ''),
  mobile             TEXT CHECK (trim(mobile) <> ''),
  first_name         TEXT CHECK (trim(first_name) <> ''),
  last_name          TEXT CHECK (trim(last_name) <> ''),
  date_of_birth      DATE,
  gender             genders,
  avatar_resource_id UUID,
  about_me           TEXT,
  is_activated       BOOLEAN                        NOT NULL DEFAULT FALSE,
  registered_at      TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE resources (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type              resource_types NOT NULL,
  user_id           UUID                           NOT NULL REFERENCES users (id),
  cloud_url         TEXT                           NOT NULL CHECK (trim(cloud_url) <> ''),
  cloud_filename    TEXT                           NOT NULL CHECK (trim(cloud_filename) <> ''),
  updated_at        TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE videos_thumbnails (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_resource_id     UUID                           NOT NULL REFERENCES resources (id),
  thumbnail_resource_id UUID                           NOT NULL REFERENCES resources (id),
  image_size            NUMERIC                        NOT NULL DEFAULT 0,
  created_at            TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE hashtags (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE CHECK (trim(slug) <> ''),
  name TEXT NOT NULL CHECK (trim(name) <> '')
);

CREATE TABLE users_hashtags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hashtag_id UUID NOT NULL  REFERENCES hashtags (id),
  user_id    UUID NOT NULL  REFERENCES users (id)
);

CREATE TABLE react (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        react_types NOT NULL,
  user_id     UUID                           NOT NULL REFERENCES users (id),
  resource_id UUID                           NOT NULL REFERENCES resources (id),
  reacted_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE auth_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID                           NOT NULL REFERENCES users (id),
  created_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE videos_properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_resource_id UUID NOT NULL REFERENCES resources (id),
  description       TEXT NOT NULL CHECK (trim(description) <> '')
);

CREATE TABLE videos_hashtags (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hashtag_id        UUID NOT NULL  REFERENCES hashtags (id),
  video_resource_id UUID NOT NULL REFERENCES resources (id)
);


-- indices
CREATE INDEX users_avatar_resource_id_index
  ON users (avatar_resource_id);
CREATE INDEX resources_user_id_index
  ON resources (user_id);
CREATE INDEX users_hashtags_hashtag_id_user_id_index
  ON users_hashtags (hashtag_id, user_id);
CREATE INDEX react_user_id_resource_id_index
  ON react (user_id, resource_id);

-- relationships
ALTER TABLE users ADD CONSTRAINT users_resources_id_fk FOREIGN KEY (avatar_resource_id) REFERENCES resources (id);