## **Chapter 8: Transaction Management and Concurrency**

### **Introduction**

Welcome to one of the most foundational and powerful concepts in the database world. So far, we have treated database operations as isolated events. But in the real world, applications are constantly reading and writing data simultaneously. Dozens, thousands, or even millions of operations might be happening at the same time.

How does a database prevent chaos? What stops two people from booking the last seat on a flight at the exact same millisecond? What ensures that a multi-step bank transfer either completes fully or fails completely, but never leaves the money in limbo?

The answer lies in **Transaction Management**. A transaction is the mechanism that guarantees data remains accurate and consistent, even under heavy, concurrent use. This chapter explores the "all or nothing" principle of transactions via the **ACID** properties and dives deep into the concurrency control mechanisms that allow databases to perform magic behind the scenes.

---

### **8.1. Transactions and ACID**

A **transaction** is a sequence of one or more SQL operations performed as a single, logical unit of work. All operations within the transaction must succeed together. If even one of them fails, the entire transaction fails, and the database is left unchanged, as if the transaction never even started.

**The Classic Analogy: A Bank Transfer**
A bank transfer from Account A to Account B is the perfect example of a transaction. It consists of two operations:
1.  Debit $100 from Account A's balance.
2.  Credit $100 to Account B's balance.

These two operations are a single logical unit. We need a guarantee that both happen, or neither happens. It would be catastrophic if the debit succeeded but the credit failed, causing $100 to simply vanish. This guarantee is provided by the four properties of a reliable transaction, known by the acronym **ACID**.



#### **A - Atomicity (The "All or Nothing" Rule)**
* **What it is:** Atomicity guarantees that all operations within a transaction are completed as a single, indivisible unit. The transaction is a single "atom" of work.
* **Analogy:** A wedding vow. You can't be "partially married." Either the entire ceremony completes successfully and you are married, or something interrupts it, and the state reverts to unmarried.
* **Database Example (Violation):**
    1.  `BEGIN TRANSACTION;`
    2.  `UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 'A';` -> **Succeeds.**
    3.  `-- Power outage crashes the database server here! --`
    4.  `UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 'B';` -> **Never runs.**
* **How it's Enforced:** The database uses a **transaction log** (like a Write-Ahead Log or WAL). Before making a change, it writes its intention to the log. If a crash occurs, upon restart the database reviews the log. It sees an incomplete transaction and **rolls back** the changes that were made (in this case, crediting the $100 back to Account A), ensuring the database state is consistent.

#### **C - Consistency (The "Rule Follower")**
* **What it is:** Consistency ensures that a transaction can only bring the database from one valid state to another. All data integrity constraints (like `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK`) must be satisfied.
* **Analogy:** A chess game. You can only make moves that are legal according to the rules of chess. You can't move a pawn backward. Any move you make transitions the board from one valid state to another.
* **Database Example (Violation):**
    Imagine a `CHECK` constraint `CHECK (Balance >= 0)` on the `Accounts` table.
    1.  Account A has a balance of $50.
    2.  `BEGIN TRANSACTION;`
    3.  `UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 'A';`
    4.  `COMMIT;`
* **How it's Enforced:** The database will **reject** this `UPDATE` statement. Because committing the transaction would violate the `CHECK` constraint (the balance would become -$50), the database prevents the invalid state from ever being written, thus preserving consistency.

#### **I - Isolation (The "Personal Bubble")**
* **What it is:** Isolation ensures that concurrently executing transactions cannot interfere with each other. From any single transaction's point of view, it appears as if it is the only transaction running on the database.
* **Analogy:** Students taking an exam in a classroom. Each student works in their own "bubble." They can't see the answers of the student next to them until the exam is over and the papers are graded (committed).
* **Database Example (Violation):**
    1.  **Transaction 1 (T1):** `SELECT SUM(Balance) FROM Accounts;` -> Starts calculating the total wealth in the bank.
    2.  **Transaction 2 (T2):** A bank transfer from A to B runs concurrently. It debits $100 from A.
    3.  **T1:** Continues its calculation and now reads Account A's new, lower balance.
    4.  **T2:** Credits $100 to B and commits.
    5.  **T1:** Finishes its calculation.
* **The Problem:** T1's final sum will be off by $100 because it saw the state of the database *during* T2's execution. Proper isolation would have ensured T1 saw a consistent snapshot of the data, either from before T2 started or after T2 finished, but not a mix of both.

#### **D - Durability (The "Permanent Ink")**
* **What it is:** Durability guarantees that once a transaction has been successfully committed, its changes are permanent and will survive any subsequent system failure, such as a power outage or crash.
* **Analogy:** Sending a certified letter. Once you receive the delivery confirmation receipt, you have an ironclad guarantee that the letter was delivered. No subsequent event can "undeliver" it.
* **How it's Enforced:** This is also achieved via the **transaction log**. When a transaction commits, the database's first priority is to write the log records for that transaction to permanent storage (like a hard drive or SSD). The actual data files might be updated in memory first and flushed to disk later, but because the log is safely on disk, the database can always replay the committed transaction to restore the data after a crash.

---

### **8.2. Concurrency Control**

Concurrency control is the set of mechanisms a DBMS uses to manage the simultaneous execution of transactions in a way that preserves the isolation property and prevents data corruption.

#### **Concurrency Problems**
When isolation is not properly managed, several classic problems can occur:

1.  **Dirty Read:** A transaction reads data that has been modified by another transaction but has **not yet been committed**.
    * **Example:**
        * **T1:** `UPDATE Employees SET Salary = 90000 WHERE EmployeeID = 101;`
        * **T2:** `SELECT Salary FROM Employees WHERE EmployeeID = 101;` -> **Reads $90,000.** T2 now uses this value for a report.
        * **T1:** `ROLLBACK;` -> The salary change is undone. The actual salary is still $80,000.
    * **Result:** T2 has made a business decision based on "dirty," incorrect data that never officially existed.

2.  **Non-Repeatable Read:** A transaction reads the same row twice but gets different values each time because another transaction modified and committed the data in between the reads.
    * **Example:**
        * **T1:** `SELECT Salary FROM Employees WHERE EmployeeID = 101;` -> **Reads $80,000.**
        * **T2:** `UPDATE Employees SET Salary = 95000 WHERE EmployeeID = 101; COMMIT;`
        * **T1:** `SELECT Salary FROM Employees WHERE EmployeeID = 101;` -> **Reads $95,000.**
    * **Result:** The data T1 is working with is inconsistent within its own lifespan. The first read is no longer repeatable.

3.  **Phantom Read:** A transaction runs the same query twice but gets a different set of rows each time because another transaction has inserted or deleted rows that match the query's `WHERE` clause.
    * **Example:**
        * **T1:** `SELECT COUNT(*) FROM Employees WHERE DepartmentID = 5;` -> **Result is 10.**
        * **T2:** `INSERT INTO Employees (..., DepartmentID) VALUES (..., 5); COMMIT;` -> A new employee is added to department 5.
        * **T1:** `SELECT COUNT(*) FROM Employees WHERE DepartmentID = 5;` -> **Result is now 11.**
    * **Result:** A "phantom" row has appeared, making the results of the first query inconsistent with the second.

#### **Locking Mechanisms**
The traditional way to prevent concurrency problems is by using locks.

* **Shared (S) Lock:** Also called a Read Lock. Multiple transactions can hold a shared lock on the same resource simultaneously. If T1 holds an S lock, other transactions can also get an S lock, but no transaction can get an Exclusive lock.
* **Exclusive (X) Lock:** Also called a Write Lock. Only one transaction can hold an exclusive lock on a resource at any given time. If T1 holds an X lock, no other transaction can acquire *any* lock (shared or exclusive) on that resource until T1 releases it.

**Lock Compatibility Matrix**

| Lock Held         | Lock Requested: S | Lock Requested: X |
| :---------------- | :---------------- | :---------------- |
| **Shared (S)**    | OK                | Wait              |
| **Exclusive (X)** | Wait              | Wait              |

#### **Transaction Isolation Levels**
Databases allow you to trade off performance for consistency by choosing an **isolation level**. A stricter level prevents more anomalies but reduces concurrency.

| Isolation Level      | Dirty Read  | Non-Repeatable Read | Phantom Read | Common Default                     |
| :------------------- | :---------- | :------------------ | :----------- | :--------------------------------- |
| **Read Uncommitted** | Allowed     | Allowed             | Allowed      | Rarely used                        |
| **Read Committed**   | Not Allowed | Allowed             | Allowed      | **PostgreSQL, Oracle, SQL Server** |
| **Repeatable Read**  | Not Allowed | Not Allowed         | Allowed      | **MySQL**                          |
| **Serializable**     | Not Allowed | Not Allowed         | Not Allowed  | Highest level, less common         |

* **Read Committed (Most Common):** Each statement in a transaction sees a snapshot of the database as it was at the start of that *statement*. This prevents dirty reads but allows non-repeatable and phantom reads. It offers a good balance of performance and consistency.
* **Serializable:** This is the strictest level. It ensures that transactions execute as if they were running one after another in some serial order. It prevents all anomalies but can significantly reduce concurrency.

#### **Multi-Version Concurrency Control (MVCC)**
Many modern databases (like PostgreSQL and Oracle) use a more advanced technique called MVCC to achieve high concurrency.

* **The Core Idea:** "Readers don't block writers, and writers don't block readers."
* **How it Works (Simplified):** When a row is updated, the database doesn't overwrite the old data. Instead, it creates a **new version** of the row. Each transaction is given a "snapshot ID" when it starts. When that transaction reads data, the database shows it the version of the row that was valid at the time of its snapshot, ignoring any newer versions created by other concurrent transactions. This allows read queries to proceed without needing to wait for write locks, dramatically improving performance for mixed read/write workloads.
