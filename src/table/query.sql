CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX (id),
    INDEX (email)
);

CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    class_name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (id)
);

CREATE TABLE IF NOT EXISTS students (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    age INT,
    course VARCHAR(10),
    user_id CHAR(36) UNIQUE,
    student_code VARCHAR(50) UNIQUE,
    class_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    INDEX (id),
    INDEX (user_id),
    INDEX (class_id)
);

CREATE TABLE IF NOT EXISTS teachers (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) UNIQUE,
    level VARCHAR(10),
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (id),
    INDEX (user_id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(30) UNIQUE,
    year ENUM('1', '2', '3', '4'),
    semester ENUM('1', '2'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (id)
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
    id CHAR(36) PRIMARY KEY,
    teacher_id CHAR(36),
    subject_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX (id),
    INDEX (teacher_id),
    INDEX (subject_id)
);

CREATE TABLE IF NOT EXISTS student_classes (
    id CHAR(36) PRIMARY KEY,
    student_id CHAR(36),
    class_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX (id),
    INDEX (class_id),
    INDEX (student_id)
);

CREATE TABLE IF NOT EXISTS rooms (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (id),
    INDEX (name)
);

CREATE TABLE IF NOT EXISTS room_availability (
    id CHAR(36) PRIMARY KEY,
    room_id CHAR(36),
    available_date DATE,
    period VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX (id),
    INDEX (room_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (id),
    INDEX (user_id)
);

CREATE TABLE IF NOT EXISTS timetables (
    id CHAR(36) PRIMARY KEY,
    class_id CHAR(36),
    teacher_subject_id CHAR(36),
    room_id CHAR(36),
    period VARCHAR(5),
    day_of_week INT,
    status ENUM('ready', 'pending', 'canceled'),
    lesson ENUM('Morning', 'Afternoon', 'Evening'),
    start_date_study DATE,
    end_date_study DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (teacher_subject_id) REFERENCES teacher_subjects(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    INDEX (id),
    INDEX (class_id),
    INDEX (status),
    INDEX (lesson),
    INDEX (room_id),
    INDEX (teacher_subject_id)
);



ALTER TABLE timetables 
ADD UNIQUE unique_class (class_id,
day_of_week,
lesson,
period),
ADD UNIQUE unique_teacher (teacher_subject_id,
day_of_week,
lesson,
period),
ADD UNIQUE unique_room (room_id,
day_of_week,
lesson,
period);