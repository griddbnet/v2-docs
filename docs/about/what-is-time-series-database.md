# What is a Time Series Database?

![Google Trend](/GoogleTrends.png)

 Looking at above the Google Trends Chart, one can surmise that advancements in data storage systems and the big data revolution in recent years have reignited interest in Time Series databases.

## What is Time Series data?
Time series data is a series of values ​​where the time information (timestamp) corresponds to data recorded or an event that happened at that point in time. The data can have both regular and fluctuating intervals. For example, temperature recordings would be recorded at a set time, every minute or hour, while a stock price would be recorded every time a trade is completed.

Time Series data is usually a log or "append-only", records are rarely updated except upon deletion when they expire. You wouldn't update values in your web server logs and the same holds true for most Time Series data collections.

Depending on the latency required, individual records can be inserted one at a time but are often inserted in bulk. Messaging systems such as Kafka can queue individual records to be inserted in bulk or client applications can be cache configured to insert once a certain period.

## What are Time Series Databases?
Simply put, a Time Series database is a database that specializes storing and querying time series data. While it's possible to store and query in other relational and NoSQL databases, a Time Series database will have specialized time-related functions such as:

- **Time Weighted Averages:** When time records are inserted at irregular intervals, normal AVERAGE aggregations will return incorrect results. GridDB's TIME_AVG function provides this feature.
- **Time Downsampling:** In many applications, Time Series data is recorded at very high resolution but is often only needed to be queried at a lower resolution, for example to populate data in a graph. With a GridDB's TIME_SAMPLING function, data will be returned at the requested interval and if there isn't an exact match to particular interval's time stamp, metrics will be interpolated between the timestamp before and after.
- **Easier comparison operators:** Time Series databases allow you to compare timestamps in multiple ways, not just one simple function call with the comparative timestamp as a string.
- **More effective compression:** Since a Time Series database knows the key values are timestamps it can more effectively compress and index the data it stores. GridDB's storeCompressionMode option enables compression, offering up to a 3x reduction in storage required.
- **Automatic data expiration:** As time goes on, old data no longer holds value or it no longer becomes necessary to be stored. To address this, GridDB and most other Time Series databases have functions to enable the database to automatically prune data that is older than a set time in a rolling fashion.
- **Insert/Append Optimized:** While Time Series data can be updated, it is much more common for new data to be inserted so many Time Series databases will use a log or transaction based data storage backend.

## What Applications Use Time Series Data?

It can be argued that nearly all data could be Time Series data. For example, you may only care about the current price of a product you wish to buy, but it could also be useful to see historical prices for that product to decide if it's worth waiting for it to go on sale. Thus product information which would typically be stored in a document oriented database is at least partially suitable for storage in a Time Series database.

### Internet of Things
The Internet of Things (IoT) may be the most talked about user of Time Series data with millions of devices recording sensor data. Typical examples include temperature or producing environmental events such as doors locking and unlocking. With the vast quantity of data being recorded, it's imperative to use a Time Series database to efficiently store, process, and analyze the incoming data. GridDB's Key-Container data model works especially well for IoT workloads, where Time Series data for each device is stored in an individual container.

### Financial Transactions
A ledger might be the original Time Series database, tracking credits, debits, and balances over time. Receipts or sale histories all have metrics Stock trades also fit the Time Series data model well with both the most recent value and all previous trade prices and volume all having significance.

### Application Monitoring
Server logs are one of the simplest, most obvious examples of Time Series data but there are many different types of application monitoring is used. Telemetry uploaded by a mobile application can be stored in a Time Series database so developers can examine usage patterns to improve their application. Server metrics can be monitored to see peak and trough usage allowing system administers to not only better plan capacity, but also look for anomalies.

## How is Time Series Data Used?

We've talked about why you need a Time Series database and what Time Series data is used for...

- **Billing/Reporting:** Often using aggregation functions that compute the SUM or COUNT of a metric. reports or bills are generated at regular intervals.
- **Visualization:** A plot of a metric over time is one of the most common places we see Time Series data on a day to day basis, whether it's data from the stock market or the weather.
- **Alerting:** In monitoring applications, if a metric exceeds a threshold an alert can be sent over the prescribed messaging system. One common example of this is in Industrial IoT where machine sensors are monitored so that maintenance staff can be alerted if their values are outside of normal operating thresholds.

## Examples of Time Series Applications

We hope we have successfully convinced you that Time Series data is more important and prominent than you may have originally imagined. Please consider the following: the entire emerging industry of IoT is entirely reliant on Time Series data. So whether you are building a vehicle management system, or planning out a next-generation smart city, Time Series data and and the management of this data will likely be a key component in ensuring everything runs properly and efficiently.

To build on that, modern logging/analytics applications have also grown increasingly complex and data-hungry. Grafana, for example, is excellent and built on top of a foundation of Time Series Database. Check out our project page to see how GridDB works well with Grafana. Get started with GridDB now and see how easy it is to *Go Faster* with your application and Grow BIGGER with your ever-increasing time series data.