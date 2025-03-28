# Querying IoT dataset in Jupyter Notebook


In our second tutorial looking at data analysis of the IoT sensor data
using GridDB CE's new JDBC functionality we're going to use Jupyter
Notebook along with JayDeBeAPI to query the Casas Dataset we ingested
into GridDB with Kafka in this tutorial series. Assuming you are running
Centos 7 and Python3 installed from EPEL with GridDB and the GridDB
driver installed per their respective instructions. Install Jupyter
NoteBook, JayDeBeAPI (Python's JDBC support) and other requirements:

``` bash
$ sudo pip3.6 install notebook matplotlib JayDeBeApi JPype1==0.6.3 
```

Launch Jupyter:

``` bash
$ mkdir tutorial2
$ cd tutorial2
$ jupyter notebook
```

Jupyter will start start the server and may launch your browser. If your
browser does not launch, navigate to to <http://your_local_ip:8888>
Create a new notebook from the button in the top right corner and copy
and paste the following code into the notebook, this simple code queries
all of the Casas Motion sensors and plots how many records they have
recorded:

``` python
import jaydebeapi
import matplotlib.pyplot as plt

def query_sensor(curs, table):
    curs.execute("select count(*) from "+table)
    return curs.fetchall()[0][0]

conn = jaydebeapi.connect("com.toshiba.mwcloud.gs.sql.Driver", "jdbc:gs://239.0.0.1:41999/defaultCluster", ["admin", "admin"], "/usr/share/java/gridstore-jdbc.jar")
curs = conn.cursor()
curs.execute("select * from \"#tables\"")
sensors = []
results = []
for table in curs.fetchall():
    try:
        if table[1].split("_")[1].startswith("M"):
            sensors.append(table[1])
            results.append(query_sensor(curs, table[1]))
    except:
        pass
    
fig = plt.figure()
ax = fig.add_axes([0,0,1,1])

ax.bar(sensors,results)
plt.xticks(rotation=90)
plt.show()
```

The data stream is very simple, the records only show when a sensor was
turned on or off. To determine how long a sensor was on for requires a
more complex query. Now we can plot a much more advanced query that
shows off the capabilities of SQL versus TQL.

``` python
import jaydebeapi
import pandas as pd
    
conn = jaydebeapi.connect("com.toshiba.mwcloud.gs.sql.Driver", "jdbc:gs://239.0.0.1:41999/defaultCluster", ["admin", "admin"], "/usr/share/java/gridstore-jdbc.jar")
curs = conn.cursor()
    
sql ="""select TO_EPOCH_MS(dt)/1000 as start, TO_EPOCH_MS((select min(dt) from """+table+""" where dt > a.dt   and message = 'OFF'  ))/1000,
    TIMESTAMPDIFF(SECOND, (select min(dt) from """+table+""" where dt > a.dt  and message = 'OFF' ), dt )
from """+table+""" as a where a.message = 'ON' order by dt asc; """
curs.execute(sql)
data = curs.fetchall()
print(data)
print(pd.DataFrame(data, columns=["On", "Off", "Duration"]))
```

One trick you may notice is using Pandas to print the data instead of
print. Pandas gives a nice tabular output without having to code any
loops to print the list:

``` python
            On           Off  Duration
0  1309416847  1.309417e+09      13.0
1  1309417097  1.309418e+09    1190.0
2  1309417389  1.309418e+09     898.0
3  1309418175  1.309418e+09     111.0
4  1309423271  1.309441e+09   18192.0
5  1309441925  1.309442e+09     162.0
6  1309442280           NaN       NaN
```

Instead of Python's simple output:


``` python
[(1309416847, 1309416861, 13), (1309417097, 1309418287, 1190), (1309417389, 1309418287, 898), (1309418175, 1309418287, 111), (1309423271, 1309441463, 18192), (1309441925, 1309442088, 162), (1309442280, None, None)]
```

Now, let's have a closer look at the query:

``` sql
select TO_EPOCH_MS(dt)/1000 as start,    TO_EPOCH_MS((select min(dt) from """+table+""" where dt > a.dt   and message = 'OFF'  ))/1000,   TIMESTAMPDIFF(SECOND, (select min(dt) from """+table+""" where dt > a.dt  and message = 'OFF' ), a.dt )from """+table+""" as a where a.message = 'ON' order by a.dt asc;
```

The black part of the query is straight forward, selecting all messages
that signify where the motion sensor was turned on and order and
ordering them by timestamp from first to the last. The red part of the
query finds next time the sensor is turned off using the timestamp from
the outer black part of the query. Finally, to find the duration that
the sensor was on, TIMESTAMPDIFF is used in the blue portion of the
query. It uses the same logic as the red query to find the end timestamp
and then the timestamp from the outer black query as the start. In our
next tutorial on the Casas data set we'll look at more advanced analysis
and visualization with Apache Zepplin.
