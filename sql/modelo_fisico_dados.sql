CREATE TABLE localization (
	ID_loc serial NOT NULL PRIMARY KEY,
	city varchar(100),
	neighborhood varchar(100),
	coordinates varchar(100)NULL
);

CREATE TABLE sensor (
	ID_sen serial NOT NULL PRIMARY KEY,
	ID_localization int NULL,
	mac varchar(20) NOT NULL UNIQUE,
	FOREIGN KEY (ID_localization) REFERENCES localization (ID_loc)
);

CREATE TABLE data_sensor (
	ID_data serial NOT NULL PRIMARY KEY,
	ID_sensor int NOT NULL,
	date_hour timestamp,
	temperature double precision,
	humidity double precision,
	pressure double precision,
	FOREIGN KEY (ID_sensor) REFERENCES sensor (ID_sen)
);

CREATE TABLE daily_data_analysis (
	ID_d_d_analysis serial NOT NULL PRIMARY KEY,
	ID_sensor int NOT NULL,
	temperature_mean double precision,
	temperature_maximun double precision,
	temperature_minimun double precision,
	temperature_mode double precision,
	temperature_median double precision,
	humidity_mean double precision,
	humidity_maximun double precision,
	humidity_minimun double precision,
	humidity_mode double precision,
	humidity_median double precision,
	pressure_mean double precision,
	pressure_maximun double precision,
	pressure_minimun double precision,
	pressure_mode double precision,
	pressure_median double precision,
	FOREIGN KEY (ID_sensor) REFERENCES sensor (ID_sen)
);

ALTER DATABASE "estacao_IOT" SET datestyle TO ISO, DMY;