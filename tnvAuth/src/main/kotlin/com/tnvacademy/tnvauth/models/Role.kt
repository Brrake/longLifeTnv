package com.tnvacademy.tnvauth.models

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name="roles")
class Role() {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Int = 0

    @Column
    var name:String = ""

    @ManyToMany(mappedBy = "roles",fetch = FetchType.EAGER)
    @JsonIgnore
    val users:List<User> = listOf()

    constructor(id: Int, name: String) : this() {
        this.id = id
        this.name = name
    }
    constructor(name: String) : this() {
        this.name = name
    }
}