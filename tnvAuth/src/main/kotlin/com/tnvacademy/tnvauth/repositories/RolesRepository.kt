package com.tnvacademy.tnvauth.repositories

import com.tnvacademy.tnvauth.models.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RolesRepository: JpaRepository<Role, Int> {
}