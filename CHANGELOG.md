## 0.2.0

* Change query arguments
    from
    ```
    (filter, projection, sort, page, limit)
    ```
    into
    ```
    (filter, select)
    ```
    with
    ```
    select = {projection, sort, page, limit}
    ```

* Change detail function into getByKey

* Add getById, getOne (get by filter), addChild, removeChild

* Add CONTAIN filter

* Add type STRING_ARRAY, INTEGER_ARRAY, FLOAT_ARRAY

## 0.1.7

* Add all function to BaseRepository