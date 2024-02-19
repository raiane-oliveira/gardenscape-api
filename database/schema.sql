-- gardenscape's database schema

CREATE TABLE IF NOT EXISTS "users" (
  "id" VARCHAR(40),
  "name" VARCHAR(64) NOT NULL,
  "email" VARCHAR(256) NOT NULL,
  "password" TEXT NOT NULL,
  "avatar_url" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),

  PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "gardens" (
  "id" VARCHAR(40),
  "name" VARCHAR(64) NOT NULL,
  "user_id" VARCHAR(40),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),

  PRIMARY KEY("id"),
  FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "plants" (
  "id" SERIAL,
  "api_plant_id" INT CHECK ("api_plant_id" > 0),
  "name" VARCHAR(256),

  PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "reminders" (
  "id" SERIAL,
  "datetime" TIMESTAMP NOT NULL,
  "plant_id" INT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),

  PRIMARY KEY("id"),
  FOREIGN KEY("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "plants_gardens" (
  "plant_id" INT,
  "garden_id" VARCHAR(40),
  "added_at" TIMESTAMP NOT NULL DEFAULT now(),

  FOREIGN KEY("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE,
  FOREIGN KEY("garden_id") REFERENCES "gardens"("id") ON DELETE CASCADE
);

CREATE PROCEDURE "get_user_garden_details"(user_id VARCHAR(40), garden_id INT)
LANGUAGE SQL
BEGIN ATOMIC
  SELECT * FROM "gardens" 
  JOIN "users" 
    ON "users"."id" = "gardens"."user_id"
  JOIN "plants_gardens" AS "pg" 
    ON "pg"."garden_id" = "gardens"."id"
  WHERE "users"."id" = user_id
    AND "gardens"."id" = garden_id;
END;