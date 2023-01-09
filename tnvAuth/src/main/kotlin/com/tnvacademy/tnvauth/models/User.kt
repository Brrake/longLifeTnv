package com.tnvacademy.tnvauth.models

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder


@Entity
@Table(name="users")
class User() {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int = 0

    @Column
    var name = ""

    @Column(unique = true)
    var email = ""

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "users_roles",
        joinColumns = arrayOf(JoinColumn(name="user_id")) ,
        inverseJoinColumns = arrayOf(JoinColumn(name="role_id"))
    )
    var roles:List<Role> = listOf()

    @Column
    var password = ""
        @JsonIgnore
        get() = field
        set(value) {
            val passwordEncoder = BCryptPasswordEncoder()
            field = passwordEncoder.encode(value)
        }

    constructor(name: String, email: String, roles: List<Role>, password: String) : this() {
        this.name = name
        this.email = email
        this.roles = roles
        this.password = password
    }
    constructor(id: Int, name: String, email: String, roles: List<Role>, password: String) : this() {
        this.id = id
        this.name = name
        this.email = email
        this.roles = roles
        this.password = password
    }

    fun comparePassword(password: String): Boolean {
        return BCryptPasswordEncoder().matches(password, this.password)
    }

}