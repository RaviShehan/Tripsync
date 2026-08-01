package com.tripsync.car;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableCaching
@EnableKafka
public class CarServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarServiceApplication.class, args);
	}

}
