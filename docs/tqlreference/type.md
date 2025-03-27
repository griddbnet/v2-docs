# Data type

This section shows the definitions of types specifying the value constraints for fields and query operations.

## Primitive

Here are shown the definitions of primitive types which cannot be represented by a combination of any other types.

### Boolean (BOOL)

Represents the values: TRUE or FALSE.

### String (STRING)

Represents a sequence of zero or more Unicode code points (characters) excluding the NULL character (U+0000). 
Refer to GridDB [Architecture](../architecture/structure-of-griddb.md) for the upper limit size.

### Integer

Represents integer values as follows:
- BYTE: -2<sup>7</sup> to 2<sup>7</sup>-1 (8-bit)
- SHORT: -2<sup>15</sup> to -2<sup>15</sup>-1 (16-bit)
- INTEGER: -2<sup>31</sup> to -2<sup>31</sup>-1 (32-bit)
- LONG: -2<sup>63</sup> to -2<sup>63</sup>-1 (64-bit)

### Floating point

Represents the IEEE754 floating point numbers. The following types are available depending on the precision.
- FLOAT: Single-precision type (32-bit)
- DOUBLE: Double-precision type (64-bit)

Note. In principle, arithmetic precision conforms to the IEEE754 specifications; however, it might vary depending on the runtime environment.

### Time (TIMESTAMP)

Represents the combination of a date consisting of year, month and day, and a time consisting of hour, minute and second. Refer to the Annex [Range of values](annex/#label_range_of_values) for the display range.

### Spatial (GEOMETRY)

Represents the spatial structure. Refer to GridDB [Architecture](../architecture/structure-of-griddb.md) for the upper limit size. 
It does not support non-numeric numbers (NAN) and positive and negative infinity (INF, -INF) as the number of coordinates represented by each structure. In addition, it is capable of storing SRID (Spatial Reference System Identifier) as an integer value, but does not support coordinate range limit by the coordinate system represented by the SRID and the coordinate conversion by the conversion of SRID.

### BLOB

Represents binary data, such as image and sound. Refer to GridDB [Architecture](../architecture/structure-of-griddb.md) for the upper limit size.

## Composite

Here are shown the definitions of types which can be represented by a combination of primitive types.

### Array

Represent a sequence of values. The following types are available for array values. The length of an array indicates the number of array elements. The minimum size is 0. 
Refer to GridDB [Architecture](../architecture/structure-of-griddb.md) for the upper limit size. The element of array cannot be set to NULL.
- Boolean
- String 
- Integer
- Floating point
- Time
