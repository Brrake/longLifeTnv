package com.tnvacademy.tnvauth

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
class TnvauthApplication

fun main(args: Array<String>) {
	runApplication<TnvauthApplication>(*args)
}
