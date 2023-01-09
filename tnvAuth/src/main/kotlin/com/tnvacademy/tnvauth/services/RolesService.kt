package com.tnvacademy.tnvauth.services

import com.tnvacademy.tnvauth.models.Role
import com.tnvacademy.tnvauth.repositories.RolesRepository
import org.springframework.stereotype.Service

@Service
class RolesService(private val rolesRepository: RolesRepository) {

    fun save(role: Role): Role {
        return this.rolesRepository.save(role)
    }

}