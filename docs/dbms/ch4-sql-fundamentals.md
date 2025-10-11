---
sidebar_position: 4
title: Part 3 · SQL Fundamentals
---
Welcome to Part 3, where we transition from theory to practice. Having designed our database, we now need a way to communicate with it. That language is **SQL (Structured Query Language)**. SQL is the universal standard for managing and querying relational databases.

This chapter focuses on the absolute fundamentals. We will break SQL down into its sub-languages (DDL, DML, DQL, etc.) and provide clear, practical examples for each core command. By the end, you will be able to create database structures, add and modify data, and ask questions of your database.

---

## **Chapter 4: SQL Fundamentals**

### **4.1. Introduction to SQL**

**What is SQL?**
SQL, often pronounced "sequel" or "S-Q-L," stands for Structured Query Language. It's a declarative programming language designed specifically for managing data held in a relational database management system (RDBMS). "Declarative" means you tell the database *what* you want, and the database figures out *how* to get it for you.

**Why is SQL so important?**
* **Standardization:** It's an ANSI/ISO standard, meaning the core commands work across different database systems (like PostgreSQL, MySQL, SQL Server) with only minor variations in syntax for advanced features.
* **Powerful:** It can handle vast amounts of data and complex queries with concise commands.
* **Accessible:** The syntax is relatively easy to read and understand, resembling natural English.

---

### **4.2. Data Definition Language (DDL)**

DDL statements are used to **define and manage the database structure or schema**. These commands build and modify the "container" that holds your data. Think of them as the architectural blueprints.

#### **`CREATE`**
Used to create new database objects like tables, indexes, or views. The most common use is `CREATE TABLE`.

**Syntax:**
```sql
CREATE TABLE table_name (
    column1_name data_type [constraints],
    column2_name data_type [constraints],
    ...
    [table_constraints]
);
```

**Example:** Let's create two tables for a library database: `Authors` and `Books`.

```sql
-- Create the Authors table first, since Books will refer to it.
CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    BirthYear INT
);

-- Create the Books table with a foreign key to Authors.
CREATE TABLE Books (
    BookID INT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    PublicationYear INT CHECK (PublicationYear > 1000),
    AuthorID INT,
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);
```

  * **Explanation:** We've created two tables. `Authors` has a primary key `AuthorID`. `Books` has its own primary key and a `CHECK` constraint to ensure the year is valid. Critically, it includes a `FOREIGN KEY` constraint that links `Books.AuthorID` to `Authors.AuthorID`, enforcing referential integrity.

-----

#### **`ALTER`**

Used to modify an existing database object. You can add, delete, or modify columns in an existing table.

**Syntax:**

  * `ALTER TABLE table_name ADD column_name data_type;`
  * `ALTER TABLE table_name DROP COLUMN column_name;`
  * `ALTER TABLE table_name RENAME COLUMN old_name TO new_name;`

**Example:** Let's add a `Genre` column to our `Books` table and a `Nationality` column to `Authors`.

```sql
-- Add a new column for Genre to the Books table
ALTER TABLE Books ADD Genre VARCHAR(50);

-- Add a new column for Nationality to the Authors table
ALTER TABLE Authors ADD Nationality VARCHAR(50);
```

  * **Result:** The `Books` and `Authors` tables now have these new columns, which will be `NULL` for any existing rows.

-----

#### **`DROP`**

Used to permanently delete an entire database object. **Use with extreme caution!**

**Syntax:**
`DROP TABLE table_name;`

**Example:** If we wanted to completely remove the `Books` table.

```sql
-- This command will permanently delete the Books table and all its data.
DROP TABLE Books;
```

  * **Important:** You often cannot drop a table that is being referenced by a foreign key in another table (like our `Authors` table). You would need to drop the referencing table (`Books`) first.

-----

#### **`TRUNCATE`**

Used to quickly delete all rows from a table, but the table structure itself remains. It's much faster than `DELETE` for wiping a table clean.

**Syntax:**
`TRUNCATE TABLE table_name;`

**Example:**

```sql
-- This removes all rows from Books, but the table (columns, constraints) still exists.
TRUNCATE TABLE Books;
```

-----

### **4.3. Data Manipulation Language (DML)**

DML statements are used to **manage the data within the schema objects**. If DDL builds the house, DML puts the furniture in and moves it around.

#### **`INSERT`**

Used to add new rows of data into a table.

**Syntax:**
`INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);`

**Example:** Let's populate our tables with some authors and books.

```sql
-- Insert authors into the Authors table
INSERT INTO Authors (AuthorID, FirstName, LastName, BirthYear, Nationality)
VALUES
(1, 'George', 'Orwell', 1903, 'British'),
(2, 'J.R.R.', 'Tolkien', 1892, 'British'),
(3, 'Isaac', 'Asimov', 1920, 'Russian-American');

-- Insert books into the Books table, linking them to authors
INSERT INTO Books (BookID, Title, PublicationYear, AuthorID, Genre)
VALUES
(101, '1984', 1949, 1, 'Dystopian'),
(102, 'Animal Farm', 1945, 1, 'Political Satire'),
(201, 'The Hobbit', 1937, 2, 'Fantasy'),
(202, 'The Lord of the Rings', 1954, 2, 'Fantasy'),
(301, 'Foundation', 1951, 3, 'Science Fiction');
```

-----

#### **`UPDATE`**

Used to modify existing rows in a table. The `WHERE` clause is crucial to specify *which* rows to update.

**Syntax:**
`UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE condition;`

**Example:** Let's correct a publication year and add a genre to an existing book.

```sql
-- The publication year for 'The Lord of the Rings' is complex, let's update it to the first volume's date
-- and add a more specific genre.
UPDATE Books
SET PublicationYear = 1954, Genre = 'High Fantasy'
WHERE BookID = 202;
```

  * **Pitfall:** **Forgetting the `WHERE` clause is a catastrophic mistake.** If you run `UPDATE Books SET Genre = 'Sci-Fi';` without a `WHERE` clause, **every single book in your table will have its genre changed to 'Sci-Fi'.**

-----

#### **`DELETE`**

Used to remove existing rows from a table. Like `UPDATE`, the `WHERE` clause is essential.

**Syntax:**
`DELETE FROM table_name WHERE condition;`

**Example:** Let's remove the book 'Animal Farm' from our database.

```sql
-- Delete the row corresponding to 'Animal Farm'
DELETE FROM Books
WHERE BookID = 102;
```

  * **Pitfall:** Again, forgetting the `WHERE` clause will delete **all rows** from the table. `DELETE FROM Books;` is functionally similar to `TRUNCATE TABLE Books;`, but `DELETE` is slower as it typically logs each row deletion.

-----

### **4.4. Data Query Language (DQL)**

DQL is used to **retrieve data** from the database. It is the most frequently used part of SQL. The `SELECT` statement is its cornerstone.

#### **`SELECT`**

Used to query the database and retrieve data that matches criteria that you specify.

**Syntax:**
`SELECT column1, column2, ... FROM table_name WHERE condition;`

**Example 1: Selecting all columns from a table**
The asterisk (`*`) is a wildcard for "all columns."

```sql
-- Get all information about all authors
SELECT * FROM Authors;
```

**Result:**
| AuthorID | FirstName | LastName | BirthYear | Nationality      |
| :------- | :-------- | :------- | :-------- | :--------------- |
| 1        | George    | Orwell   | 1903      | British          |
| 2        | J.R.R.    | Tolkien  | 1892      | British          |
| 3        | Isaac     | Asimov   | 1920      | Russian-American |

-----

**Example 2: Selecting specific columns with a filter**

```sql
-- Get the titles and publication years of all Fantasy books
SELECT Title, PublicationYear
FROM Books
WHERE Genre = 'Fantasy' OR Genre = 'High Fantasy';
```

**Result:**
| Title                 | PublicationYear |
| :-------------------- | :-------------- |
| The Hobbit            | 1937            |
| The Lord of the Rings | 1954            |

-----

**Example 3: Sorting the results with `ORDER BY`**

```sql
-- Get all book titles and sort them alphabetically
SELECT Title
FROM Books
ORDER BY Title ASC; -- ASC for ascending (A-Z), DESC for descending (Z-A)
```

**Result:**
| Title                 |
| :-------------------- |
| 1984                  |
| Foundation            |
| The Hobbit            |
| The Lord of the Rings |

-----

### **4.5. Data Control Language (DCL)**

DCL statements are used to **manage permissions and access control** within the database. They determine who can do what.

  * **`GRANT`**: Gives a specific user permissions to perform certain tasks.
  * **`REVOKE`**: Takes away permissions from a user.

**Conceptual Example:**

```sql
-- Give a user named 'analyst' the ability to only SELECT data from the Books table.
GRANT SELECT ON Books TO analyst;

-- Take away that permission.
REVOKE SELECT ON Books FROM analyst;
```

-----

### **4.6. Transaction Control Language (TCL)**

TCL statements are used to manage transactions, which are sequences of operations performed as a single logical unit of work. Transactions ensure data integrity using the ACID properties.

  * **`COMMIT`**: Saves all the work done in the current transaction.
  * **`ROLLBACK`**: Undoes all the work done in the current transaction, restoring the database to the state it was in before the transaction began.
  * **`SAVEPOINT`**: Sets a point within a transaction to which you can later roll back.

**Conceptual Example:**

```sql
-- Start a transaction (in some databases, this is implicit)
BEGIN TRANSACTION;

-- Delete a book
DELETE FROM Books WHERE BookID = 201; -- The Hobbit is deleted

-- Oh no, that was a mistake! Let's undo it.
ROLLBACK; -- The deletion is undone, and The Hobbit is back in the table.

-- Let's try again, but this time we are sure.
BEGIN TRANSACTION;
DELETE FROM Books WHERE BookID = 201;
COMMIT; -- The deletion is now permanent and saved.
```
