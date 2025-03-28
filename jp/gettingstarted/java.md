# Java





まず、必要なimport文は以下の通りです。

``` java
import com.toshiba.mwcloud.gs.Collection;
import com.toshiba.mwcloud.gs.GSException;
import com.toshiba.mwcloud.gs.GridStore;
import com.toshiba.mwcloud.gs.GridStoreFactory;
import com.toshiba.mwcloud.gs.Query;
import com.toshiba.mwcloud.gs.RowKey;
import com.toshiba.mwcloud.gs.RowSet;
```
コンテナスキーマは、Javaでは静的クラスとして定義されています。
``` java
static class Person {
	@RowKey String name;
	int age;
}
static class HeartRate {
	@RowKey Date ts;
	int heartRate;
        String activity;
}
```
GridDBに接続するには、インストールしたGridDBの設定に基づいたPropertiesインスタンスを使用します。
``` java
Properties props = new Properties();
props.setProperty("notificationAddress", "239.0.0.1");
props.setProperty("notificationPort", "31999");
props.setProperty("clusterName", "defaultCluster");
props.setProperty("user", "admin");
props.setProperty("password", "admin");
GridStore store = GridStoreFactory.getInstance().getGridStore(props);
```
クエリを実行したりレコードを書き込むには、コンテナを取得する必要があります。
``` java
Collection<String, Person> people = store.putCollection("PEOPLE", Person.class);
```
問合せはSQL / JDBCドライバに似ています。
``` java
Query<Person< query = col.query("select * where name = 'John'");
RowSet<Person> rs = query.fetch(false);
while (rs.hasNext()) {
	// Update the searched Row
	Person person1 = rs.next();
        System.out.println("Name: "+ person1.name +" Age: "+ person1.age)
}
```
書き方は簡単です。
``` java
HeartRate hr = new HeartRate();
hr.ts = new Date();
hr.heartrate = 60;
hr.activity = "resting";
TimeSeries<HeartRate> heartRate = store.putTimeSeries("HR_"+person1.name, HeartRate.class);
heartRate.put(hr);
```
更新も簡単です。
``` java
Query<Person> query = col.query("select * where name = 'John'");
RowSet<Person> rs = query.fetch(true);
while (rs.hasNext()) {
	// Update the searched Row
	Person person1 = rs.next();
        person1.age++;
        rs.update(person1);
}
```
コンパイルするには以下のスニペットを使用します。
``` bash
$ cd gsSample/
$ export CLASSPATH=$CLASSPATH:/usr/share/java/gridstore.jar
$ javac Sample1.java
$ cd .. && java gsSample/Sample1
```
GridDBでmavenを使用する方法については[こちら](https://griddb.net/en/blog/using-maven-to-develop-griddb-applications/)を参照してください。