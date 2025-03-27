# Indexes

Indexes exist to make queries and searches more efficient. When dealing with very large data sets, these indexes save on precious time and resources. A condition-based search can be processed quickly by creating an index for the columns of a container. There are 3 types of index - hash index (HASH), tree index (TREE) and space index (SPATIAL). A hash index is used in an equivalent-value search when searching with a query in a container. Besides equivalent-value search, a tree index is used in comparisons including the range (bigger/same, smaller/same etc.). The index that can be set differs depending on the container type and column data type.

*   Hash Index
    *   An equivalent value search can be conducted quickly but this is not suitable for searches that read the rows sequentially.
    *   Columns of the following data type can be set in a collection. Cannot be set in a TimeSeries container.
        *   String
        *   Bool
        *   Byte
        *   Short
        *   Integer
        *   Long
        *   Float
        *   Double
        *   Timestamp
*   Besides equivalent-value search, a tree index
    *   is used in comparisons including the range (bigger/same, smaller/same etc.).
    *   This can be used for columns of the following data type in any type of container, except for columns corresponding to a rowkey in a TimeSeries container.
        *   String
        *   Bool
        *   Byte
        *   Short
        *   Integer
        *   Long
        *   Float
        *   Double
        *   Timestamp
*   Space Index
    *   Can be used for only GEOMETRY columns in a collection. This is specified when conducting a spatial search at a high speed.

Although there are no restrictions on the no. of indexes that can be created in a container, creation of an index needs to be carefully designed. An index is updated when the rows of a configured container are inserted, updated or deleted. Therefore, when multiple indexes are created in a column of a row that is updated frequently, this will affect the performance in insertion, update or deletion operations.

An index is created in a column as shown below.

*   A column that is frequently searched and sorted.
*   A column that is frequently used in the condition of the WHERE section of TQL
*   High cardinality column (containing few duplicated values)
