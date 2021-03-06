## 0.7.0
* Query by multiple ids

## 0.6.0
* Delete draft database
* Upload Controller

## 0.5.0
* Refactor
* Update to babel 6
* Add bin nest-omit
* Create api

## 0.4.2 (01-05-2015)
* Add Read List of Objects From Csv

## 0.4.0
* Add Travis CI Coverage

## 0.3.3 (12-19-2015)
* Get Config routes
* Get Schema routes
* validate-update routes
* Register Route
* CreatedTime, ModifiedTime Plugin

## 0.3.2
* Support Get All

## 0.3.0
* Add create-controller

    Usage
    ```javascript
    import {createController} from 'base-repository';

    ```
* Handle more exception for BaseRepository
* Add BaseRepository tests

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