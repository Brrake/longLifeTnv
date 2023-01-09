package com.tnvacademy.tnvauth.repositories

import com.tnvacademy.tnvauth.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Int> {
    fun findByEmail(email:String): User?
}