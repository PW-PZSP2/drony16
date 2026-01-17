CREATE TABLE "user" (
    user_id       SERIAL NOT NULL,
    user_name     TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password      TEXT NOT NULL,
    role          CHAR(3) NOT NULL,  -- aoc (admin, operator, client -> 1/0)
    phone_number  TEXT NOT NULL,
    is_blocked    CHAR(1) NOT NULL,
    creation_date DATE NOT NULL,
	localisation  TEXT,
    area          INTEGER,
    description   TEXT,
    PRIMARY KEY (user_id)
);

CREATE TABLE attachment (
    attachment_id    SERIAL NOT NULL,
    name             TEXT NOT NULL,
    description      TEXT,
    file_path        TEXT NOT NULL,
    operator_id INTEGER,
    PRIMARY KEY (attachment_id)
);

CREATE TABLE operator_service (
    entry_id           SERIAL NOT NULL,
    service_id 		   INTEGER,
	operator_id		   INTEGER,
    PRIMARY KEY (entry_id)
);

CREATE TABLE service (
    service_id SERIAL NOT NULL,
    name       TEXT NOT NULL,
    PRIMARY KEY (service_id)
);

CREATE TABLE service_parameter (
    parameter_id       SERIAL NOT NULL,
    name               TEXT NOT NULL,
    unit               TEXT NOT NULL,
    service_id 		   INTEGER,
    PRIMARY KEY (parameter_id)
);

CREATE TABLE "order" (
    order_id                SERIAL NOT NULL,
    name                    TEXT NOT NULL,
    creation_date           DATE NOT NULL,
    description             TEXT,
    raid_date               CHAR(1) NOT NULL,
    completion_date         CHAR(1) NOT NULL,
    deadline                DATE NOT NULL,
    location                TEXT NOT NULL,
    operator_selection_date DATE,
    service_id      		INTEGER,
    score                   INTEGER,
    opinion                 TEXT,
    state                   TEXT NOT NULL,
    client_id          		INTEGER,
	operator_id				INTEGER,
    PRIMARY KEY (order_id)
);

CREATE TABLE order_parameter (
    entry_id                       SERIAL NOT NULL,
    value                          TEXT NOT NULL,
    order_id                 	   INTEGER,
    parameter_id 				   INTEGER,
    PRIMARY KEY (entry_id)
);

CREATE TABLE reported_operator (
    report_id      SERIAL NOT NULL,
    "date"         DATE NOT NULL,
    order_id 	   INTEGER,
	operator_id	   INTEGER,
    PRIMARY KEY (report_id)
);

ALTER TABLE attachment
    ADD CONSTRAINT attachment_operator_fk FOREIGN KEY (operator_id)
        REFERENCES "user"(user_id);

ALTER TABLE operator_service
    ADD CONSTRAINT operator_service_service_fk FOREIGN KEY (service_id)
        REFERENCES service(service_id);

ALTER TABLE operator_service
    ADD CONSTRAINT operator_service_operator_fk FOREIGN KEY (operator_id)
        REFERENCES "user"(user_id);

ALTER TABLE "order"
    ADD CONSTRAINT order_client_fk FOREIGN KEY (client_id)
        REFERENCES "user"(user_id);

ALTER TABLE "order"
    ADD CONSTRAINT order_operator_fk FOREIGN KEY (operator_id)
        REFERENCES "user"(user_id);

ALTER TABLE "order"
    ADD CONSTRAINT order_service_fk FOREIGN KEY (service_id)
        REFERENCES service(service_id);

ALTER TABLE order_parameter
    ADD CONSTRAINT order_parameter_order_fk FOREIGN KEY (order_id)
        REFERENCES "order"(order_id);

ALTER TABLE order_parameter
    ADD CONSTRAINT order_parameter_parameter_fk FOREIGN KEY (parameter_id)
        REFERENCES service_parameter(parameter_id);

ALTER TABLE reported_operator
    ADD CONSTRAINT reported_operator_order_fk FOREIGN KEY (order_id)
        REFERENCES "order"(order_id);

ALTER TABLE reported_operator
    ADD CONSTRAINT reported_operator_operator_fk FOREIGN KEY (operator_id)
        REFERENCES "user"(user_id);

ALTER TABLE service_parameter
    ADD CONSTRAINT service_parameter_service_fk FOREIGN KEY (service_id)
        REFERENCES service(service_id);

ALTER TABLE "user"
    ADD COLUMN latitude FLOAT;
ALTER TABLE "user"
    ADD COLUMN longitude FLOAT;

ALTER TABLE "order"
    ADD COLUMN latitude FLOAT;
ALTER TABLE "order"
    ADD COLUMN longitude FLOAT;

CREATE TABLE homepage_content (
    id            INTEGER DEFAULT 1 NOT NULL,
    content       JSONB NOT NULL,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by    INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT homepage_content_single_row CHECK (id = 1),
    CONSTRAINT homepage_content_updated_by_fk FOREIGN KEY (updated_by)
        REFERENCES "user"(user_id)
);

-- GIN index for efficient JSONB querying
CREATE INDEX idx_homepage_content_jsonb ON homepage_content USING GIN (content);

-- trigger to update 'updated_at' on content change
CREATE OR REPLACE FUNCTION update_homepage_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_homepage_timestamp
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_timestamp();
