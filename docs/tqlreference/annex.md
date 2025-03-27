# Appendix

<a id="label_range_of_values"></a>
## Range of values

Describe the range of values such as the upper limit of the value, etc. 
Refer to GridDB [Architecture](../architecture/structure-of-griddb.md) for the restriction values of the system.

### Values that may be adopted by basic datatypes
The values that may be adopted by the basic datatypes below are as follows.

| Type           | Representable values                                                                    |
|----|-----------|
| Boolean (BOOL) | TRUE/FALSE                                                                              |
| BYTE           | \-2<sup>7</sup> to 2<sup>7</sup>-1                                                      |
| SHORT          | \-2<sup>15</sup> to 2<sup>15</sup>-1                                                    |
| INTEGER        | \-2<sup>31</sup> to 2<sup>31</sup>-1                                                    |
| LONG           | \-2<sup>63</sup> to 2<sup>63</sup>-1                                                    |
| FLOAT          | Conforming to IEEE754                                                                   |
| DOUBLE         | Conforming to IEEE754                                                                   |
| TIMESTAMP      | 1970/1/1 to 9999/12/31(UTC). Accuracy is in milliseconds. Leap seconds are not handled. |


Value that can be used to TQL operation in spatial (GEOMETRY) type is any arbitrary value returned by the ST\_GeomFromText function. Among these values, the value that can be stored containers is excluding the QUADRATICSURFACE structure.

The range of values of objects mapped onto the basic types through API may be different from those of the above basic types. The value out of the described range cannot be registered into containers. But the value may be used in the other operations, such as constructing a search condition. For example, a java.util.Date object to be mapped onto TIMESTAMP by Java API can have a value before the year 1970 that cannot be stored in containers, and the value can be used as a RowKey condition of a RowKeyPredicate object or in a sampling query. However, in that case, it is possible that an error occurs when obtaining rows by the condition. For the representation range of the object itself to be mapped onto the above basic types, see the definition of the object type.
