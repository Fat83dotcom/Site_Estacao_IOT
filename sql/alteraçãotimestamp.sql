select * from "Core_sensor";

select * from "Core_datasensor" where "id_sensor_id"=1 order by "id_data_sensor" desc limit 2000;

ALTER TABLE "Core_datasensor"
ALTER COLUMN date_hour TYPE timestamp without time zone;
