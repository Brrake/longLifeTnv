package com.tnvacademy.tnvauth.services

import com.tnvacademy.tnvauth.models.User
import com.tnvacademy.tnvauth.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun save(user: User): User {
        return this.userRepository.save(user)
    }

    fun findByEmail(email: String): User? {
        return this.userRepository.findByEmail(email)
    }

    fun getById(id: Int): User? {
        return this.userRepository.getReferenceById(id)
    }
}