/**
**/

db.exec('CREATE TABLE IF NOT EXISTS t ( date DATE, value INTEGER )');
db.exec('DELETE FROM t');

db.exec("INSERT INTO t (date, value) VALUES ('2018-02-01', 8);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-02', 2);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-05', 5);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-06', 4);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-07', 1);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-10', 6);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-11', 0);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-12', 2);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-13', 1);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-14', 3);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-15', 11);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-18', 4);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-20', 1);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-21', 5);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-02-28', 10);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-02', 6);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-03', 7);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-04', 3);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-08', 5);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-09', 6);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-15', 1);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-16', 3);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-25', 5);");
db.exec("INSERT INTO t (date, value) VALUES ('2018-03-31', 1);");

var stmt = db.prepare(`
SELECT date, value, 
avg(value) OVER (
    ORDER BY CAST (strftime('%s', date) AS INT)
    RANGE BETWEEN 3 * 24 * 60 * 60 PRECEDING
        AND 3 * 24 * 60 * 60 FOLLOWING
) AS WeeklyMovingAverage
FROM t ORDER BY date;
`)

data = [];
while (stmt.step()) data.push(stmt.getAsObject())
