# TQL

TQL in NoSQL products and SQL-92 compliant SQL in NewSQL products are supported as database access languages.

*   What is TQL?  
    A simplified version of SQL prepared for NoSQL products. The support range is limited to functions such as search, aggregation, etc., using a container as a unit. TQL is employed by using the client API (Java, C language) of NoSQL products.
    

*   What is SQL?  
    SQL stands for "Structured Query Language", and it has been the standard query language for RDMS systems for years. Standardization of the language specifications is carried out in ISO to support the interface for defining and performing data operations in conformance with SQL-92 in GridDB. SQL uses the ODBC/JDBC of the new SQL product.
    

GridDB has a NoSQL interface to access containers and a NewSQL interface to access tables. The GridDB Standard Edition supports the NoSQL interface while the GridDB Advanced Edition supports both NoSQL and NewSQL interfaces. The range of access to tables and containers using these interfaces are shown below.

*   The NoSQL interface provides access to containers but not tables.
*   The NewSQL interface provides access to tables but not containers.

**More Information on TQL**

TQL supports a query corresponding to the SQL SELECT statement which is required to select data to be fetched, deleted or updated. It does not support management of data structure and transaction processing other than a selection query (such as manipulation of selected data).

All queries are expressed by the syntax below:

\[EXPLAIN \[ANALYZE\]\] SELECT (select expression) \[FROM (Collection or TimeSeries name)\]  \[WHERE (conditional expression)\] ORDER BY (Column name) \[ASC|DESC\] \[, (Column name) \[ASC|DESC\]\]* \[LIMIT (number) \[OFFSET (number)\]\]

A SELECT statement is used to narrow down Rows in a Collection or TimeSeries specified in the FROM clause according to the conditional expression in the WHERE clause and process the result set according to the select expression specifing target Column(s), a calculation formula, etc.

If a target Collection or TimeSeries is already specified, you need to omit the FROM clause or specify the same name as the target in the FROM clause. You should note that the FROM clause is case-insensitive. If the WHERE clause is omitted, all the Rows of a target Collection or TimeSeries are selected.

You can place EXPLAIN or EXPLAIN ANALYZE before a SELECT statement to obtain execution plan information and analysis information on execution results in relation to the SELECT statement. See the later section for more information.

Unlike SQL, you cannot extract only specific Column(s) except for aggregation operations. Additionally, clauses corresponding to the following are not available.

*   GROUP BY
*   HAVING
*   DISTINCT
*   FOR UPDATE ※can be carried out with the API
*   JOIN

ASCII characters in the keywords of the basic syntax and the names of functions, operators and enumeration constants described in the later sections can be written in lower case.
