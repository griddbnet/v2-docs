# Java Message Service & REST Notification Triggers

GridDB has a built-in trigger function which allows both REST (REpresentational State Transfer) and JMS (Java Message Service) notifications to be sent to your applications of choice. As a brief overview, you set this up by setting the Trigger type (REST vs JMS) and to which GridDB container this trigger will be set off when an event occurs (either a PUT or deletion of the container). 

The general flow of things for the REST notification will be as follows: add a trigger to a specific GridDB container, build and run a REST server, and then finally PUT to the GridDB container. On the JMS side of things, we will need to: build GridDB with a specific build flag, add a trigger, install activemq, and then run everything together.

## REST Notifcation

Due to the ubiquity of the Hypertext Transfer Protocol (HTTP), using the REST trigger notification will be an easier endeavor for us to engage in.

### Golang Server

For this demonstration, we will spin up a generic Go server which will send an email to the address of our choice whenever our container gets new data written into it. We will use [Sendgrid](https://sendgrid.com/) to handle the emailing. Here is what the Go server looks like in its entirety:

```golang
package main

import (
    "log"
    "fmt"
    "os"
    "net/http"
    "net/http/httputil"

    "github.com/gorilla/handlers"
    "github.com/gorilla/mux"
    "github.com/sendgrid/sendgrid-go"
    "github.com/sendgrid/sendgrid-go/helpers/mail"
)

func endPoint (w http.ResponseWriter, r *http.Request) {
    fmt.Println("Sending email...")
    res, err := httputil.DumpRequest(r, true)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(res))    
    sendEmail("israelimru@gmail.com", res)
}

func sendEmail(email, content string) {
    from := mail.NewEmail("Israel", "imru@fixstars.com")
    subject := "Test Email"
    to := mail.NewEmail("Israel", email)
    plainTextContent := "Testing sendgrid"
    htmlContent := "Available here: " + content
    message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
    client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
    response, err := client.Send(message)
    if err != nil {
        log.Println(err)
    } else {
        fmt.Println(response.StatusCode)
        fmt.Println(response.Body)
        fmt.Println(response.Headers)
    }
}


func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", endPoint)

    fmt.Println("starting server on 2828....")
    log.Fatal(http.ListenAndServe(":2828", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(r)))

}
```

The example server above is pretty self explanatory. Whenever the endpoint of our server is pinged (`http://localhost:2828/`), it will push out an email and log in the console if successful or not. And as a note, you can see the Sendgrid API key is set as an environment variable. You can set this by creating a file (`sendgrid.env`) with the following content: 

`export SENDGRID_API_KEY=<key here>`

and running 

```bash
$ source sendgrid.env
```

So, in one terminal, we can run this server and let it handle any requests we make with our trigger notification.


### Java Trigger Function

The native language connector for GridDB is Java, and so in order to get the trigger notification set for your container of choice, you will need to use Java. You can read the technical API document for triggers [here](http://www.toshiba.com/solutions/content/GridDB_API_Reference.html#sec-4).

Here is the simple example. We create a Java function which creates a trigger for the container "point01". We set it to ping our Go server everytime we add a row to that specific container.

Here is the entirety of the code: 


```java
import java.util.Arrays;
import java.util.HashSet;
import java.util.Properties;
import java.util.Date;
import java.net.URI;
import com.toshiba.mwcloud.gs.*;
import java.net.URISyntaxException;

public class TriggerNotification {

    static class Point {
        @RowKey Date timestamp;
        boolean active;
        double voltage;
    }

    public static void main(String[] args) throws GSException,URISyntaxException  {

        // Get a GridStore instance
        Properties props = new Properties();
        props.setProperty("notificationAddress", "239.0.0.1");
        props.setProperty("notificationPort", "31999");
        props.setProperty("clusterName", "defaultCluster");
        props.setProperty("user", "admin");
        props.setProperty("password", "admin");
        GridStore store = GridStoreFactory.getInstance().getGridStore(props);

        TimeSeries<Point> col = store.putTimeSeries("point01", Point.class);
        col.setAutoCommit(false);
        TriggerInfo trigger = new TriggerInfo();
        trigger.setType(TriggerInfo.Type.REST);
        trigger.setName("Tutorial");
        URI uri = new URI("http://127.0.0.1:2828/");
        trigger.setURI(uri);

        java.util.HashSet<TriggerInfo.EventType> events = new HashSet<TriggerInfo.EventType>();
        events.add(TriggerInfo.EventType.PUT);
        trigger.setTargetEvents(events);
        col.createTrigger(trigger);

        col.commit();

        store.close();
    }

}
```
First, we define our container's schema and then we connect to our GridDB instance. From there, we create the trigger with the proper info and then set the container to be triggered with our event type, which in this case is `PUT`.

So, compile this java function and run it. Now, let's add a row to this container and see if our Go server sends an email.

An easy way to put data into our container is to use the GridDB Sample code: 

```java
import java.util.Date;
import java.util.Properties;

import com.toshiba.mwcloud.gs.GSException;
import com.toshiba.mwcloud.gs.GridStore;
import com.toshiba.mwcloud.gs.GridStoreFactory;
import com.toshiba.mwcloud.gs.RowKey;
import com.toshiba.mwcloud.gs.RowSet;
import com.toshiba.mwcloud.gs.TimeSeries;
import com.toshiba.mwcloud.gs.TimeUnit;
import com.toshiba.mwcloud.gs.TimestampUtils;


// Storage and extraction of a specific range of time-series data
public class Sample2 {

    static class Point {
        @RowKey Date timestamp;
        boolean active;
        double voltage;
    }

    public static void main(String[] args) throws GSException {

        // Get a GridStore instance
        Properties props = new Properties();
        props.setProperty("notificationAddress", "239.0.0.1");
        props.setProperty("notificationPort", "31999");
        props.setProperty("clusterName", "defaultCluster");
        props.setProperty("user", "admin");
        props.setProperty("password", "admin");
        GridStore store = GridStoreFactory.getInstance().getGridStore(props);


        // Create a TimeSeries (Only obtain the specified TimeSeries if it already exists)
        TimeSeries<Point> ts = store.putTimeSeries("point01", Point.class);
        // Prepare time-series element data
        Point point = new Point();
        point.active = false;
        point.voltage = 100;

        // Store the time-series element (GridStore sets its timestamp)
        ts.append(point);

        // Extract the specified range of time-series elements: last six hours
        Date now = TimestampUtils.current();
        Date before = TimestampUtils.add(now, -6, TimeUnit.HOUR);

        RowSet<Point> rs = ts.query(before, now).fetch();

        while (rs.hasNext()) {
            point = rs.next();

            System.out.println(
                    "Time=" + TimestampUtils.format(point.timestamp) +
                    " Active=" + point.active +
                    " Voltage=" + point.voltage);
        }

        // Release the resource
        store.close();
    }

}
```

So compile and run

```bash
$ java Sample
```

And now let's check our Go's server output: 

```bash
$ go run main.go

starting server on 2828....
Sending email...
POST / HTTP/1.1
Host: 127.0.0.1:2828
Connection: close
Connection: close
Content-Length: 40
Content-Type: application/json

{ "container":"point01", "event":"put" }
202

map[Access-Control-Allow-Headers:[Authorization, Content-Type, On-behalf-of, x-sg-elas-acl] Access-Control-Allow-Methods:[POST] Access-Control-Allow-Origin:[https://sendgrid.api-docs.io] Access-Control-Max-Age:[600] Connection:[keep-alive] Content-Length:[0] Date:[Tue, 14 Dec 2021 00:50:24 GMT] Server:[nginx] Strict-Transport-Security:[max-age=600; includeSubDomains] X-Message-Id:[NvMZoMcaTke8bVq-ZTnQWA] X-No-Cors-Reason:[https://sendgrid.com/docs/Classroom/Basics/API/cors.html]]
```

Excellent! Our email was sent. 


## Java Message Service

As stated earlier, the Java Message Service (JMS) "is a message standard that allows application components based on the Java Platform Enterprice Edition (Java EE) to create, send, receive, and read messages". Essentially, it will work like our REST notification, except instead of sending out data through HTTP, it will send it through our JMS service we set up.

There are many different JMS providers that can be used in conjunction with our GridDB server, but for this example, we will be using [ActiveMQ](https://activemq.apache.org/). The reason for this is because under the hood, ActiveMQ is already the native provider for GridDB.

### GridDB Build Flags

There is, however, a rather big caveat on using JMS with GridDB: you will need to compile GridDB from source and enable ActiveMQ via a build flag. That is because JMS is disabled by default, and this includes the current installation packages available for download on [GitHub](https://github.com/griddb/griddb/releases).

So, if you are interested in using JMS with your GridDB instance, clone the [GitHub repo](https://github.com/griddb/griddb) and build from scratch: 


```bash
$ ./bootstrap.sh
$ ./configure --enable-activemq
$ make
```

And as a helpful tip, make sure you install `tcl.x86_64` using yum before you try to compile: `sudo yum install tcl.x86_64`.

And now that our GridDB has JMS enabled, let's set up our trigger and ActiveMQ broker.

### ActiveMQ Broker

To set up ActiveMQ, download it from their website: [https://activemq.apache.org/components/classic/download/](https://activemq.apache.org/components/classic/download/). And then, in a separate terminal, let it run in the background: 

```bash
$ ./bin/activemq console
```

With ActiveMQ running, you can open up your browser and see the dashboard for the broker on port 8161. You will also notice that the console is telling us which other ports are listening for connections with our ActiveMQ broker, namely ports: 61616, 5672, 61613, 1883, and 61614.

 For now, you can click and see the Queues and Topics but these will be empty. Let's create a JMS Queue with our Trigger function.

### JMS Trigger

Creating the trigger will look very similar to the REST notification with just a few changes. We will need to set the username/password as well as the JMS Destination name. This destination name will be the name shown in our ActiveMQ dashboard and can be anything we want. We will also need to choose if we would like to create a JMS Queue or a Topic. The differences between the two can be read about here: [https://activemq.apache.org/how-does-a-queue-compare-to-a-topic](https://activemq.apache.org/how-does-a-queue-compare-to-a-topic).

Here is the full code of our Trigger: 

```java
import java.util.Arrays;
import java.util.HashSet;
import java.util.Properties;
import java.util.Date;
import java.net.URI;
import com.toshiba.mwcloud.gs.*;
import java.net.URISyntaxException;

// Operaton on Collection data
public class JMSNotification {

    static class Point {
        @RowKey Date timestamp;
        boolean active;
        double voltage;
    }

    public static void main(String[] args) throws GSException,URISyntaxException  {

        // Get a GridStore instance
        Properties props = new Properties();
        props.setProperty("notificationAddress", "239.0.0.1");
        props.setProperty("notificationPort", "31999");
        props.setProperty("clusterName", "defaultCluster");
        props.setProperty("user", "admin");
        props.setProperty("password", "admin");
        GridStore store = GridStoreFactory.getInstance().getGridStore(props);

        TimeSeries<Point> col = store.putTimeSeries("point02", Point.class);
        col.setAutoCommit(false);
        TriggerInfo trigger = new TriggerInfo();
        trigger.setType(TriggerInfo.Type.JMS);
        URI uri = new URI("tcp://localhost:61616");
        trigger.setURI(uri);
        trigger.setJMSDestinationName("GridDB");
        trigger.setName("Tutorial2");
        trigger.setJMSDestinationType("queue");
        trigger.setUser("admin");
        trigger.setPassword("admin");

        java.util.HashSet<TriggerInfo.EventType> events = new HashSet<TriggerInfo.EventType>();
        events.add(TriggerInfo.EventType.PUT);
        trigger.setTargetEvents(events);
        col.createTrigger(trigger);
        col.commit();
        store.close();
    }

}
```

You will notice that the URI's port is set to 61616 -- this is the broker listening for connections to this port. You may incorrectly think the GridDB connection would take the `amqp://localhost:5672` port, but that is for ActiveMQ pub/sub applications. You can read more about this here: [https://www.tomitribe.com/blog/5-minutes-or-less-activemq-with-jms-queues-and-topics/](https://www.tomitribe.com/blog/5-minutes-or-less-activemq-with-jms-queues-and-topics/).

So, once again, compile and run this code and then add a row to the specified container (`point02`). 

Once you add a row to the container, GridDB should send over a message to our running ActiveMQ broker. If you check out the Queues section of your dashboard, you should now see a GridDB Queue set up.

<img here>

And you will notice that the message shows up as enqueued but none dequeued. This means our message is queued and waiting for a JMS consumer to be active to retrieve the message. You can also click the name in the dashboard to see the contents of the message: 

<img here>

To start up a JMS consumer in the console, you can use this [github repo's](https://www.tomitribe.com/blog/5-minutes-or-less-activemq-with-jms-queues-and-topics/) consumer java code. Change the Queue's destination name to GridDB and once you start it up, it will receive the message and the dashboard console will indiate one messge dequeued. 

# Conclusion

Trigger functions can really help a developer stay on top of important or sensitive containers without needing to manually check the GridDB instance every so often.



