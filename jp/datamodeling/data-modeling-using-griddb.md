# Data modeling using GridDB

Storing Data in Collection

The flow of storing data in a Collection is shown below. First, if there is no Collection to store data in, create a new Collection following the procedure below:

1.  Get a GridStore instance.
2.  Create a Collection.

You can store data in an existing Collection with the following procedure:

1.  Get a GridStore instance.
2.  Get a collection.
3.  Set operation parameters
4.  Create indexes.
5.  Create values to be stored.
6.  Store values in the Collection
7.  Perform a commit a proper intervals
8.  Release the GridStore instance.

Storing data in a TimeSeries container follows the exact same procedure.

This examples below are intended to provide an application which has the following capabilities:

*   Storing facility information
*   Storing alarm history
*   Storing sensor data
*   Searching for and displaying facility information and sensor data showing abnormality

The following sections describe client programs which implement each capability based on the schema definitions shown in the previous chapter.

### 4.2.1 Storing Facility Information

Technically, in the monitoring system, the information on facility configuration and specifications needs to be stored in a database. For simplicity, however, this section shows a sample program which loads facility information collectively from a CSV file storing the data. An outline of the processing flow is shown below.

1.  Connect to a server and get a GridStore instance.
2.  Create a facility information Collection name with a specified name ("equipment_col") in GridStore.
3.  Create indexes to be used for search.
4.  Store a value repeatedly while reading a CSV file, as follows:
    *   4-1. Analyze a read CSV-formatted line and create a facility information object to store.
    *   4-2. Store (put) the created facility information object in the facility information Collection.
    *   4-3. Perform a commit if repeated the predetermined number of times.
5.  Release the GridStore instance if all CSV-formatted lines are processed.

A concrete sample program is shown below:

  1:  package pvrms;
  2:  
  3:  import java.io.FileReader;
  4:  import java.io.IOException;
  5:  import java.text.ParseException;
  6:  import java.util.Properties;
  7:  
  8:  import au.com.bytecode.opencsv.CSVReader;
  9:  
 10:  import com.toshiba.mwcloud.gs.Collection;
 11:  import com.toshiba.mwcloud.gs.GSException;
 12:  import com.toshiba.mwcloud.gs.GridStore;
 13:  import com.toshiba.mwcloud.gs.GridStoreFactory;
 14:  import com.toshiba.mwcloud.gs.RowKey;
 15:  
 16:  // Facility information
 17:  class Equip {
 18:      @RowKey String id;
 19:      String   name;
 20:      //Blob     spec; // For simplicity, spec information is not used.
 21:  }
 22:  
 23:  public class SimplePv0 {
 24:  
 25:      /*
 26:       * Load facility information from a CSV file.
 27:       */
 28:      public static void main(String\[\] args) throws GSException, ParseException, IOException {
 29:  
 30:          // Specify a server.
 31:          final String gsServer     = "127.0.0.1";
 32:          final String gsPort       = "10001";
 33:          final String user         = "admin";
 34:          final String password     = "admin";
 35:  
 36:          final String equipColName = "equipment_col";
 37:  
 38:          // Get a GridStore instance.
 39:          final Properties prop = new Properties();
 40:          prop.setProperty("host", gsServer);
 41:          prop.setProperty("port", gsPort);
 42:          prop.setProperty("user", user);
 43:          prop.setProperty("password", password);
 44:          final GridStore store = GridStoreFactory.getInstance().getGridStore(prop);
 45:  
 46:  
 47:          // Read a CSV file.
 48:          String dataFileName = "equipName.csv";
 49:          CSVReader reader = new CSVReader(new FileReader(dataFileName));
 50:          String\[\] nextLine;
 51:  
 52:          /*
 53:           *  Create a Collection.
 54:           */
 55:          Collection equipCol = store.putCollection(equipColName, Equip.class);
 56:  
 57:          /*
 58:           *  Create indexes for Columns.
 59:           */
 60:          equipCol.createIndex("id");
 61:          equipCol.createIndex("name");
 62:  
 63:          /*
 64:           *  Set autocommit mde to OFF.
 65:           */
 66:          equipCol.setAutoCommit(false);
 67:  
 68:          // Commit interval
 69:          Long commtInterval = (long) 1;
 70:  
 71:          /*
 72:           *  Store a value.
 73:           */
 74:          Equip equip = new Equip();
 75:          Long cnt = (long) 0;
 76:          byte\[\] b = new byte\[1\];
 77:          b\[0\] = 1;
 78:          while ((nextLine = reader.readNext()) != null) {
 79:  
 80:              // Store facility information.
 81:              equip.id   = nextLine\[2\];
 82:              equip.name   = nextLine\[3\];
 83:              
 84:              equipCol.put(equip);
 85:              
 86:              cnt++;
 87:              
 88:              if(0 == cnt%commtInterval) {
 89:                  // Commit a transaction.
 90:                  equipCol.commit();
 91:              }
 92:  
 93:          }
 94:  
 95:          // Release a resource
 96:          store.close();
 97:          reader.close();
 98:  
 99:  }
100:  
101:  } 

### 4.2.2 Storing Alarm History

Technically, in the monitoring system, a sensor or a facility directly sends an alarm to GridDB and stores it . For simplicity's sake, however, this section shows a sample program which loads alarm history data collectively from a CSV file storing the data. An outline of the processing flow is shown below.

1.  Connect to a server and get a GridStore instance.
2.  Create an alert Collection with a specified name ("alert_col") in GridStore and get it.
3.  Create indexes to be used for search.
4.  Store a value repeatedly while reading a CSV file, as follows:
    *   4-1. Analyze a read CSV-formatted line and create an alert object to store.
    *   4-2. Store (put) the created alert object in the alert Collection.
    *   4-3. Perform a commit if repeated the predetermined number of times.
5.  Release the GridStore instance if all CSV-formatted lines are processed.

A concrete sample program is shown below:

  1:  package pvrms;
  2:  
  3:  import java.io.FileReader;
  4:  import java.io.IOException;
  5:  import java.text.ParseException;
  6:  import java.text.SimpleDateFormat;
  7:  import java.util.Date;
  8:  import java.util.Properties;
  9:  
 10:  import au.com.bytecode.opencsv.CSVReader;
 11:  
 12:  import com.toshiba.mwcloud.gs.Collection;
 13:  import com.toshiba.mwcloud.gs.GSException;
 14:  import com.toshiba.mwcloud.gs.GridStore;
 15:  import com.toshiba.mwcloud.gs.GridStoreFactory;
 16:  import com.toshiba.mwcloud.gs.RowKey;
 17:  
 18:  // Alert information
 19:  class Alert {
 20:      @RowKey Long id;
 21:      Date    timestamp;
 22:      String  sensorId;
 23:      int     level;
 24:      String  detail;
 25:  }
 26:  
 27:  public class SimplePv1 {
 28:  
 29:      /*
 30:       * Load alert data from a CSV file.
 31:       */
 32:      public static void main(String\[\] args) throws GSException, ParseException, IOException {
 33:  
 34:          // Specify a server.
 35:          final String gsServer     = "127.0.0.1";
 36:          final String gsPort       = "10001";
 37:          final String user         = "admin";
 38:          final String password     = "admin";
 39:  
 40:          final String alertColName = "alert_col";
 41:  
 42:          // Get a GridStore instance.
 43:          final Properties prop = new Properties();
 44:          prop.setProperty("host", gsServer);
 45:          prop.setProperty("port", gsPort);
 46:          prop.setProperty("user", user);
 47:          prop.setProperty("password", password);
 48:          final GridStore store = GridStoreFactory.getInstance().getGridStore(prop);
 49:  
 50:          // Read a CSV file.
 51:          String dataFileName = "alarmHistory.csv";
 52:          CSVReader reader = new CSVReader(new FileReader(dataFileName));
 53:          String\[\] nextLine;
 54:  
 55:          /*
 56:           *  Create a Collection.
 57:           */
 58:          Collection alertCol = store.putCollection(alertColName, Alert.class);
 59:  
 60:          /*
 61:           *  Create indexes for Columns.
 62:           */
 63:          alertCol.createIndex("timestamp");
 64:          alertCol.createIndex("level");
 65:  
 66:          /*
 67:           *  Set autocommit mde to OFF.
 68:           */
 69:          alertCol.setAutoCommit(false);
 70:  
 71:          // Commit interval
 72:          Long commtInterval = (long) 1;
 73:  
 74:          /*
 75:           *  Store a value.
 76:           */
 77:          SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/ddHH:mm:ss");
 78:          Alert alert = new Alert();
 79:          Long cnt = (long) 0;
 80:          while ((nextLine = reader.readNext()) != null) {
 81:  
 82:              String dateS     = nextLine\[0\];//2011/1/1
 83:              String timeS     = nextLine\[1\];//19 (hundred hours)
 84:              String datetimeS = dateS + " " + timeS + ":00:00";
 85:              Date   date      = format.parse(datetimeS);
 86:              Long   datetime  = date.getTime();
 87:  
 88:              alert.id         = ++cnt;
 89:              alert.timestamp  = new Date(datetime);
 90:              alert.sensorId   = nextLine\[2\];
 91:              alert.level      = Integer.valueOf(nextLine\[3\]);
 92:              alert.detail     = nextLine\[4\];
 93:  
 94:              alertCol.put(alert);
 95:  
 96:              if(0 == cnt%commtInterval) {
 97:                  // Commit a transaction.
 98:                  alertCol.commit();
 99:              }
100:  
101:          }
102:  
103:          // Release a resource.
104:          store.close();
105:          reader.close();
106:  
107:  }
108:  
109:  } 

### 4.2.3 Storing Sensor Data

Technically, in the monitoring system, a sensor directly sends a measured value to be stored in GridStore. For simplicity, however, this section shows a sample program which loads sensor data collectively from a CSV file storing the data. An outline of a processing flow is shown below.

1.  Connect to a server and get a GridStore instance.
2.  Read the first line of a CSV file and create a set of TimeSeries to be used beforehand, as follows:
    *   2-1. Analyze the first CSV-formatted line and obtain multiple sensor IDs (= the names of TimeSeries to be created).
    *   2-2. Create an alert Collection in GridStore for each obtained sensor ID.
3.  Store a value repeatedly, while reading the rest of the CSV file, as follows:
    *   3-1. Analyze a read CSV-formatted file and create a Point object to store.
    *   3-2. Store (put) the created Point object in an appropriate TimeSeries.
4.  Release the GridStore instance if all CSV-formatted lines are processed.

A concrete sample program is shown below:

 1:  package pvrms;
 2:  
 3:  import java.io.FileReader;
 4:  import java.io.IOException;
 5:  import java.text.ParseException;
 6:  import java.text.SimpleDateFormat;
 7:  import java.util.Date;
 8:  import java.util.Properties;
 9:  
10:  import au.com.bytecode.opencsv.CSVReader;
11:  
12:  import com.toshiba.mwcloud.gs.GridStore;
13:  import com.toshiba.mwcloud.gs.GridStoreFactory;
14:  import com.toshiba.mwcloud.gs.RowKey;
15:  import com.toshiba.mwcloud.gs.TimeSeries;
16:  
17:  // Sensor data
18:  class Point {
19:      @RowKey Date time;
20:      double  value;
21:      String  status;
22:  }
23:  
24:  public class SimplePv2 {
25:  
26:      /*
27:       * Load time-series data form a CSV file.
28:       */
29:      public static void main(String\[\] args) throws ParseException, IOException {
30:  
31:          // Specify a server.
32:          final String gsServer     = "127.0.0.1";
33:          final String gsPort       = "10001";
34:          final String user         = "admin";
35:          final String password     = "admin";
36:  
37:          // Get a GridStore instance.
38:          final Properties prop = new Properties();
39:          prop.setProperty("host", gsServer);
40:          prop.setProperty("port", gsPort);
41:          prop.setProperty("user", user);
42:          prop.setProperty("password", password);
43:          final GridStore store = GridStoreFactory.getInstance().getGridStore(prop);
44:  
45:          // Read a CSV file.
46:          String dataFileName = "sensorHistory.csv";
47:          CSVReader reader = new CSVReader(new FileReader(dataFileName));
48:          String\[\] nextLine;
49:          nextLine = reader.readNext();
50:  
51:  
52:          // Presupposing that the 1st line contains sensor IDs and the rest of lines contain data.
53:          // Presupposing that 0:date, 1:time, ...
54:  
55:  
56:          /*
57:           *  Read a sensor ID and create a TimeSeries.
58:           */
59:          String\[\] tsNameArray = new String\[nextLine.length\];
60:          for(int j = 2; j < nextLine.length; j++) {
61:  
62:              tsNameArray\[j\] = nextLine\[j\];
63:              store.putTimeSeries(tsNameArray\[j\], Point.class);
64:  
65:          }
66:  
67:          /*
68:           *  Store a value in each TimeSeries.
69:           */
70:          SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/ddHH:mm:ss");
71:          Point point             = new Point();
72:          while ((nextLine = reader.readNext()) != null) {
73:  
74:              String dateS     = nextLine\[0\];//2011/1/1
75:              String timeS     = nextLine\[1\];//19 (hundred hours)
76:              String datetimeS = dateS + " " + timeS + ":00:00";
77:              Date   date      = format.parse(datetimeS);
78:              Long   datetime  = date.getTime();
79:  
80:              for(int i = 2, j = 2; j < nextLine.length; i++, j+=2) {
81:  
82:                  TimeSeries ts = store.getTimeSeries(tsNameArray\[i\], Point.class);
83:  
84:                  point.time   = new Date(datetime);
85:                  point.value  = Double.valueOf(nextLine\[j\]);
86:                  point.status = nextLine\[j+1\];
87:  
88:                  ts.append(point);
89:              }
90:          }
91:          
92:          // Release a resource.
93:          store.close();
94:          reader.close();
95:  
96:  }
97:  
98:  }
